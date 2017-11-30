import React, { Component } from 'react';
import { View, Image, Platform, Alert, NativeModules, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import store from 'react-native-simple-store';
import geolib from 'geolib'
import CommonWidgets from '@components/CommonWidgets';
import Spinner from '@components/OverlaySpinner';
import { replaceRoute } from '@actions/route';
import { setSpinnerVisible, setUser, setProducts, setAvatar } from '@actions/globals';
import { getUserAttempt } from '@actions/get_user';
import { getNewRequestsAttempt } from '@actions/get_new_requests';
import { Styles, Images, Colors, Global } from '@theme/';
import Utils from '@src/utils';

class Splash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: true,
            animationFinished: false,
            routeName: '',
            responseData: null,
        };
        if (Global.currentCoord.latitude === null) {//this condition is just for test
            this.doGetCurrentCoordinate();
        }
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({animationFinished: true});
            if (this.state.routeName) this.gotoNextScreen();
        }, 2000);
    }

    componentDidMount() {
        store.get(['token', 'type']).then((response) => {
            console.log('[token, type]', response);
            if (response[1] !== null) {
                Global.userType = response[1];
                if (response[0] !== null) {
                    Global.token = response[0];
                    if (response[1] === 0) {
                        Global.userType = 'client';
                        this.doGetUser();
                    } else {
                        Global.userType = 'client';
                        this.doGetUser();
                    }
                } else this.setState({routeName: 'login'});
            } else this.setState({routeName: 'home'});
        }).catch((error) => {
            Utils.toast(error.toString());
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log("Splash received nextProps.");
        if (this.props.response1 !== nextProps.response1) {
            console.log('response1-', this.props.response1, nextProps.response1)
            if (nextProps.response1.attempting) {
            } else if (nextProps.response1.isOK) {
                let responseData = nextProps.response1.data;
                this.doGetUser();
                if (responseData.message === 'ok') {
                    if (this.state.animationFinished) this.props.replaceRoute('dashboard');
                    else this.setState({routeName: 'dashboard'});
                } else {
                    if (this.state.animationFinished) {
                        this.props.navigator.replace({
                            id: 'newrequest',
                            passProps: {
                                requests: responseData.requests,
                            },
                        });
                    } else this.setState({routeName: 'newrequest', responseData: responseData});
                }
            } else if (nextProps.response1.data) {
                let message = nextProps.response1.data.message;
                if (message.includes('Token')) {
                    store.delete('token').then(() => {
                        if (this.state.animationFinished) this.props.replaceRoute('login');
                        else this.setState({routeName: 'login'});
                    });
                } else {
                    console.log('error', message);
                    this.onShowAlert(message);
                }
            } else {
                console.log(nextProps.response1);
                this.props.replaceRoute('home');
            }
        } else if (this.props.response2 !== nextProps.response2) {
            console.log('response2-', this.props.response2, nextProps.response2)
            if (nextProps.response2.attempting) {
            } else if (nextProps.response2.isOK) {
                let responseData = nextProps.response2.data;
                this.props.setUser(responseData.user);
                this.props.setAvatar(responseData.user.avatar_url);
                Global.categories = responseData.categories;
                if (responseData.user.type) {
                    Global.userType = 'client';
                    if (this.state.animationFinished) this.props.replaceRoute('findfreelancer');
                    else this.setState({routeName: 'findfreelancer'});
                } else {
                    Global.userType = 'freelancer';
                    this.props.setProducts(responseData.products);
                    this.props.globals.reviews_cnt = responseData.reviews;
                }
            } else if (nextProps.response2.data) {
                let message = nextProps.response2.data.message;
                if (message.includes('Token')) {
                    store.delete('token').then(() => {
                        if (this.state.animationFinished) this.props.replaceRoute('login');
                        else this.setState({routeName: 'login'});
                    });
                } else {
                    console.log('error', message);
                    this.onShowAlert(message);
                }
            } else {
                console.log(nextProps.response2);
                this.props.replaceRoute('login');
            }
        }
    }

    onShowAlert(message) {
        if (this.state.animationFinished) this.props.replaceRoute('login');
        else this.setState({routeName: 'login'});
        // Alert.alert(
        //     I18n.t('LOGIN'),
        //     message,
        //     [{
        //         text: I18n.t('OK'), onPress: () => {
        //             if (this.state.animationFinished) this.props.replaceRoute('login');
        //             else this.setState({routeName: 'login'});
        //         }
        //     }],
        //     {cancelable: false}
        // );
    }

    doGetNewRequests() {
        this.props.getNewRequestsAttempt({
            token: Global.token,
        });
    }

    doGetUser() {
        this.props.getUserAttempt({
            token: Global.token,
        });
    }

    gotoNextScreen() {
        if (this.state.routeName === 'newrequest') {
            this.props.navigator.replace({
                id: 'newrequest',
                passProps: {
                    requests: this.state.responseData.requests,
                },
            });
        } else {
            this.props.replaceRoute(this.state.routeName);
        }
    }

    doGetCurrentCoordinate() {
        let _this = this;
        if (Platform.OS === 'ios') {
            NativeModules.RNLocation.requestAlwaysAuthorization();
            NativeModules.RNLocation.startUpdatingLocation();
            NativeModules.RNLocation.setDistanceFilter(250);
            DeviceEventEmitter.addListener('locationUpdated', (location) => {
                Utils.updateLocation(location, _this.props.globals.user, this.onLocationUpdate);
            });
        } else {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message: '<h6>Use LocationProperty?</h6>This app wants to change your device settings.',
                ok: 'YES',
                cancel: 'NO',
            }).then(function(success) {
                console.log(success);
                this.watchID = navigator.geolocation.watchPosition((location) => {
                        Utils.updateLocation(location, _this.props.globals.user, this.onLocationUpdate);
                    },
                    (error) => console.log('error', error));
            }).catch((error) => {
                console.log('catch', error);
            });
        }
    }

    onLocationUpdate = () => {
        this.props.globals.user.latitude = Global.currentCoord.latitude;
        this.props.globals.user.longitude = Global.currentCoord.longitude;
    }

    render() {
        return (
            <View>
                {CommonWidgets.renderStatusBar('transparent', true)}
                <Image
                    source={Images.bkgSplash}
                    resizeMode={'cover'}
                    style={[Styles.fullScreen]}>
                </Image>
                <Spinner visible={this.state.spinnerVisible}/>
            </View>
        );
    }
}

Splash.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        getUserAttempt: params => dispatch(getUserAttempt(params)),
        getNewRequestsAttempt: params => dispatch(getNewRequestsAttempt(params)),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setUser: user => dispatch(setUser(user)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
        setProducts: products => dispatch(setProducts(products)),
    };
}
function mapStateToProps(state) {
    const response1 = state.get('get_new_requests');
    const response2 = state.get('get_user');
    const globals = state.get('globals');
    return { globals, response1, response2 };
}
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
