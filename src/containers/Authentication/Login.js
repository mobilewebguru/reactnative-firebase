import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import { replaceRoute, pushNewRoute } from '@actions/route';
import { loginAttempt } from '@actions/login';
import { setSpinnerVisible, setUser, setProducts, setAvatar } from '@actions/globals';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import TextField from '@components/TextField';
import store from 'react-native-simple-store';
import { Styles, Images, Colors, Fonts, Metrics, Global } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    componentDidMount() {
        store.get(['email', 'password']).then((response) => {
            console.log('response', response);
            if (response[0] !== null) {
                this.setState({email: response[0]});
                this.setState({password: response[1]});
            }
        }).catch((error) => {
            Utils.toast(error.toString());
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user !== nextProps.user) {
            return;
        }
        if (this.props.spinnerVisible !== nextProps.spinnerVisible) {
            return;
        }
        if (this.props.auth !== nextProps.auth) {
            if (nextProps.auth.attempting) {
            } else if (nextProps.auth.loggedIn) {
                Global.token = nextProps.auth.data.token;
                this.doSetDeviceInfo();
                if (nextProps.auth.data.type === 0) {
                    Global.userType = 'freelancer';
                    this.doGetNewRequests();
                } else {
                    Global.userType = 'client';
                    this.doGetUser();
                }
            } else if (nextProps.auth.error) {
                this.props.setSpinnerVisible(false);
                Alert.alert(
                    I18n.t('LOGIN'),
                    nextProps.auth.error.message,
                    [{
                        text: I18n.t('OK'), onPress: () => {

                        }
                    }],
                    {cancelable: false}
                );
            }
        }
    }

    doSetDeviceInfo() {
        store.get('device').then((response) => {
            console.log('device', response);
            if (response !== null) {
                Global.device = response;
                fetch(Global.API_URL + '/auth/set_device', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        token: Global.token,
                        device: Global.device
                    }),
                }).then((response) => {
                    console.log('response', response);
                    isOK = response.ok;
                    return response.json();
                }).then((responseData) => {
                    console.log('responseData', responseData);
                    if (isOK) {
                        store.save('device', Global.device);
                    } else {
                        if (responseData.error.message.includes('Token')) {
                            console.log(responseData.error.message);
                        }
                    }
                }).catch((error) => {
                    console.log('error', error);
                }).done();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    onSubmit() {
        if (this.isInputValidate()) {
            this.doLogin();
        }
    }

    isInputValidate() {
        if (this.state.email.trim() === '') {
            this.emailInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_EMAIL'));
            return false;
        } else if (!Utils.validateEmail(this.state.email)) {
            this.emailInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_INVALID_EMAIL'));
            return false;
        } else if (this.state.password === '') {
            this.pwdInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_PASSWORD'));
            return false;
        }
        return true;
    }

    doLogin() {
        this.props.setSpinnerVisible(true);
        this.props.loginAttempt({
            user: {
                email: this.state.email,
                password: this.state.password,
            }});
    }

    doGetNewRequests() {
        let isOK;
        fetch(Global.API_URL + '/get_new_requests', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.doGetUser();
                if (responseData.message === 'ok') {
                    this.props.replaceRoute('dashboard');
                } else {
                    this.props.navigator.replace({
                        id: 'newrequest',
                        passProps: {
                            requests: responseData.requests,
                        },
                    });
                }
            } else {
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }

    doGetUser() {
        let isOK;
        fetch(Global.API_URL + '/get_user', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            this.props.setSpinnerVisible(false);
            console.log('responseData', responseData);
            if (isOK) {
                this.props.setUser(responseData.user);
                this.props.setAvatar(responseData.user.avatar_url);
                Global.categories = responseData.categories;
                if (responseData.user.type) {
                    Global.userType = 'client';
                    this.props.replaceRoute('findfreelancer');
                } else {
                    Global.userType = 'freelancer';
                    this.props.setProducts(responseData.products);
                    this.props.globals.reviews_cnt = responseData.reviews;
                    // this.props.replaceRoute('newrequest');
                }
            } else {
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }

    onShowTerms() {
        this.props.pushNewRoute('terms');
    }

    loginFB() {
        // this.props.replaceRoute('register');
    }

    render() {
        return (
            <View
                style={{ flex: 1, backgroundColor: Colors.white }}
                automaticallyAdjustContentInsets={false}>
                <View style={Styles.fullScreen}>
                    {CommonWidgets.renderStatusBar(Colors.black, false)}
                    <Image
                        source={Images.bkgSplash}
                        resizeMode={'cover'}
                        style={[Styles.fullScreen, {position: 'absolute'}]}>
                    </Image>
                    <View style={[Styles.center, {flex: 2}]}>
                        {/*{CommonWidgets.renderLogo()}*/}
                        {/*<Text style={[Fonts.style.h2, { color: Colors.textPrimary }]}>*/}
                            {/*{Global.userType === 'freelancer' ? I18n.t('LOGIN_FREELANCER') : I18n.t('LOGIN_USER')}*/}
                        {/*</Text>*/}
                        {CommonWidgets.renderLogo()}
                    </View>
                    <View style={[styles.bodyContainer, {flex: 4}]}>
                        <View
                            style={styles.textInputContainerStyle}>
                            <TextField
                                ref={(c) => { this.emailInput = c; }}
                                underlineColorAndroid={'transparent'}
                                label={I18n.t('EMAIL')}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                onChangeText={text => this.setState({ email: text })}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.pwdInput.focus()}
                                value={this.state.email}/>
                        </View>
                        <View
                            style={styles.textInputContainerStyle}>
                            <TextField
                                ref={(c) => { this.pwdInput = c; }}
                                underlineColorAndroid={'transparent'}
                                label={I18n.t('PASSWORD')}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ password: text })}
                                returnKeyType={'go'}
                                onSubmitEditing={() => this.onSubmit()}
                                value={this.state.password}/>
                        </View>
                        {CommonWidgets.renderSpacer()}
                        {CommonWidgets.renderSpacer()}

                        {CommonWidgets.renderMaterialButton(I18n.t('LOGIN'),
                            Colors.green, () => this.onSubmit())}
                        <View style={styles.forgotPwdContainer}>
                            <TouchableOpacity
                                style={{ backgroundColor: 'transparent' }}
                                onPress={() => this.props.replaceRoute('forgotpwd')}>
                                <Text style={[Fonts.style.h5, { color: Colors.textThird, textDecorationLine: 'underline' }]}>
                                    {I18n.t('RESEND_PASSWORD')/*+'?'*/}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {CommonWidgets.renderFacebookButton(I18n.t('LOGIN_WITH_FB'),
                            Colors.green, () => this.loginFB())}
                        {CommonWidgets.renderSpacer()}
                    </View>
                    <OverlaySpinner visible={this.props.globals.spinnerVisible} />
                    {CommonWidgets.renderBackButton(() => this.props.replaceRoute('home'))}
                </View>
            </View>
        );
    }
}

Login.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        loginAttempt: user => dispatch(loginAttempt(user)),
        setUser: user => dispatch(setUser(user)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
        setProducts: products => dispatch(setProducts(products)),
    };
}
function mapStateToProps(state) {
    const auth = state.get('login');
    const globals = state.get('globals');
    return { globals, auth };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
