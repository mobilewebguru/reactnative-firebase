import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import Geocoder from 'react-native-geocoder'
import Communications from 'react-native-communications';
import Moment from 'moment'
import OverlaySpinner from '@components/OverlaySpinner';
import CancelModalView from '@components/ModalViewCancel';
import AcceptModalView from '@components/ModalViewAccept';
import CommonWidgets from '@components/CommonWidgets';
import MapView from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setJobs } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class ViewRequest extends Component {

    constructor(props) {
        super(props);
        console.log('ViewRequest initial props', props.request);
        this.state= {
            client: {},
            address: props.address,
            offers: [],
            cancelModalVisible: false,
            acceptModalVisible: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetRequestDetail();
            // if (!this.state.address) this.doGetAddress();
        }, Global.mountTimeout);
    }

    onCall() {
        if (this.props.request.status === Constants.jobStatus.Accepted) Communications.phonecall(this.state.client.phone, false);
        else alert(I18n.t('YOU_NOT_ACCEPTED'));
    }

    doGetRequestDetail() {
        let isOK;
        fetch(Global.API_URL + '/get_request', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job_id: this.props.request.id
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.setState({
                    client: responseData.client,
                    offers: responseData.offers
                });
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }
    //accept
    doAcceptRequest() {
        let isOK;
        fetch(Global.API_URL + '/update_request', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job_id: this.props.request.id,
                status: Constants.jobStatus.Accepted
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.onAcceptSuccess();
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }
    onAcceptSuccess() {
        if (this.props.callback) {
            this.props.callback(this.props.request);
            this.props.request.status = Constants.jobStatus.Accepted;
        } else {
            const tmp = Utils.clone(this.props.globals.jobs);
            const index = tmp.indexOf(this.props.request);
            tmp[index].status = Constants.jobStatus.Accepted;
            this.props.setJobs(tmp);
        }
        this.openAcceptModal();
    }
    openAcceptModal() {
        this.setState({ acceptModalVisible: true });
    }
    onAccepted() {
        this.setState({ acceptModalVisible: false });
    }

    onSkip() {
        this.setState({ acceptModalVisible: false });
    }
    onSendMessage() {
        this.setState({ acceptModalVisible: false });
        this.props.navigator.push({
            id: 'chat',
            passProps: {
                // item: Constants.REQUESTS[0],
            },
        });
    }
    //decline
    doDeclineRequest() {
        let isOK;
        fetch(Global.API_URL + '/update_request', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job_id: this.props.request.id,
                status: Constants.jobStatus.Declined
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.onDeclineSuccess();
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }
    onDeclineSuccess() {
        if (this.props.callback) {
            this.props.callback(this.props.request);
            this.props.request.status = Constants.jobStatus.Declined;
        } else {
            const tmp = Utils.clone(this.props.globals.jobs);
            const index = tmp.indexOf(this.props.request);
            tmp.splice(index, 1);
            this.props.setJobs(tmp);
        }
        this.onBack();
    }
    openCancelModal() {
        this.setState({ cancelModalVisible: true });

    }
    onConfirm() {
        this.doDeclineRequest();
        this.setState({ cancelModalVisible: false });
    }
    onCancel() {
        this.setState({ cancelModalVisible: false });
    }

    doGetAddress() {
        let NY = {
            lat: this.state.client.latitude,
            lng: this.state.client.longitude
        };
        Geocoder.geocodePosition(NY).then(res => {
            console.log(res);
            this.setState({address: res[0].formattedAddress});
        }).catch(err => {
            console.log('address error', err)
        });
    }

    onBack() {
        if (this.props.callback && this.props.request.status >= Constants.jobStatus.Accepted && this.props.count === 1) {
            this.props.replaceRoute('dashboard');
        } else {
            this.props.popRoute();
        }
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.onBack()}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: this.state.client.first_name ? this.state.client.first_name + ' ' + this.state.client.last_name : '',
            style: Styles.navBarTitle,
        };
        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                    title={navBarTitleConfig}
                />
                <KeyboardAwareScrollView
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white} style={styles.container}>
                        <View style={styles.avatarView}>
                            {CommonWidgets.renderBigSpacer()}
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}/>
                                <Image
                                    style={[styles.logoImage, { borderColor: /*this.props.request.status === Constants.jobStatus.Accepted ? Colors.brandPrimary : */Colors.textPrimary }]}
                                    source={this.state.client.avatar_url ? {uri: this.state.client.avatar_url} : Images.imgAvatarPlaceholder}/>
                                <View style={{flex: 1}}>
                                    {this.props.request.status === Constants.jobStatus.Accepted &&
                                    <Image
                                        style={styles.acceptedImage}
                                        source={Images.imgAccepted}/>
                                    }
                                </View>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            <Text style={[styles.aboutText, {width: Metrics.screenWidth * 0.8, textAlign: 'center', fontSize: Fonts.size.h4}]}>
                                {Utils.revertFromUTC(this.props.request.book_time).format('DD.MM.YYYY, HH:mm')}
                                {'\n'}{this.state.address}
                                {'\n'}{this.props.request.total_price + ', -€'}
                            </Text>
                        </View>
                        {CommonWidgets.renderSpacer()}
                        {
                            this.state.offers.map(item => (
                                <View key={item.id} style={styles.skillView}>
                                    <View style={{ flex: 0.3, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={[styles.aboutText, {width: '95%'}]}>
                                            {Global.categories[item.category_id - 1].name}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.3, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={[styles.aboutText, {width: '95%'}]}>
                                            {Global.categories[item.category_id - 1].subCategory[item.sub_category_id - 1].name + ' '}
                                        </Text>
                                    </View>
                                    <Text style={[styles.aboutText, { flex: 0.25}]}>
                                        {item.price + '€'}
                                    </Text>
                                    <View style={[styles.numberView, { flex: 0.1 }]}>
                                        <Text style={[styles.aboutText, {flex: 3, textAlign: 'center'}]}>
                                            {item.amount + ''}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        }
                        {CommonWidgets.renderSpacer()}
                        <View style={styles.underline}/>
                        {CommonWidgets.renderSmallSpacer()}
                        <View style={styles.skillView}>
                            <View style={{ width: Metrics.screenWidth * 0.3, alignItems: 'flex-start' }}>
                                <Text style={[styles.aboutText, { width: Metrics.screenWidth * 0.3 }]}>{I18n.t('TOTAL')}</Text>
                            </View>
                            <Text style={styles.aboutText}>{this.props.request.total_price + ',-€'}</Text>
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        <View style={[Styles.center, { flex: 1 }]}>
                            {
                                this.props.request.status < Constants.jobStatus.Accepted ? (
                                    <View>
                                        {CommonWidgets.renderMaterialButton(
                                            I18n.t('CLICK_ACCEPT'), Colors.black, () => {
                                                this.doAcceptRequest();
                                            })}
                                        {CommonWidgets.renderSpacer()}
                                        {CommonWidgets.renderMaterial2Button(
                                            I18n.t('CLICK_DECLINE'), Colors.textPrimary, Colors.white, Colors.brandSecondary, () => {
                                                this.openCancelModal();
                                            })}
                                    </View>
                                ) : (
                                    this.props.request.status === Constants.jobStatus.Accepted ?
                                        <View>
                                            {CommonWidgets.renderMaterialButton(
                                                I18n.t('CLICK_CALL'), Colors.black, () => this.onCall())}
                                        </View>
                                        :
                                        null
                                )
                            }
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        {this.state.client.latitude && this.state.address !== '' &&
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.mapView}
                                provider={MapView.PROVIDER_GOOGLE}
                                initialRegion={{
                                    latitude: this.state.client.latitude,
                                    longitude: this.state.client.longitude,
                                    latitudeDelta: Constants.mapDelta[0],
                                    longitudeDelta: (Constants.mapDelta[0] * Metrics.screenWidth) / Metrics.screenHeight,
                                }}>
                                <MapView.Marker
                                    coordinate={{
                                        latitude: this.state.client.latitude,
                                        longitude: this.state.client.longitude,
                                    }}
                                    // image={Images.imgMark5}
                                    // description={'home'}
                                >
                                    <View>
                                        <Icon name='ios-pin' size={50} style={{color: Colors.black}}/>
                                        <Image style={styles.imgMarkStyle}
                                               source={this.state.client.avatar_url ? {uri: this.state.client.avatar_url} : Images.imgAvatarPlaceholder}/>
                                    </View>
                                </MapView.Marker>
                            </MapView>
                        </View>}
                    </View>
                </KeyboardAwareScrollView>
                <AcceptModalView
                    navigator={this.props.navigator}
                    username={this.state.client.first_name}
                    onSendMessage={() => this.onSendMessage()}
                    onSkip={() => this.onSkip()}
                    onAccepted={() => this.onAccepted()}
                    dialogVisible = {this.state.acceptModalVisible}
                />
                <CancelModalView
                    navigator={this.props.navigator}
                    username={this.state.client.first_name}
                    onAccept={() => this.onConfirm()}
                    onClose={() => this.onCancel()}
                    dialogVisible = {this.state.cancelModalVisible}
                />
            </View>
        );
    }
}
ViewRequest.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setJobs: jobs => dispatch(setJobs(jobs)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewRequest);
