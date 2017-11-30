import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import { replaceRoute } from '@actions/route';
import CommonWidgets from '@components/CommonWidgets';
import TextField from '@components/TextField';
import { Metrics, Styles, Images, Colors, Fonts, Global } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }

    onTextInputFocus(value) {
        this.setState({ [`${value}Focus`]: true });
    }

    onSubmit() {
        if (this.state.email.trim() === '') {
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_EMAIL'))
        } else if (!Utils.validateEmail(this.state.email)) {
            Utils.toast(I18n.t('ALERT_LOGIN_INVALID_EMAIL'))
        } else {
            this.doSendResetEmail();
        }
    }

    doSendResetEmail() {
        let isOK;
        fetch(Global.API_URL + '/auth/recovery', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                email: this.state.email
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.replaceRoute('resetdone');
            } else {
                Alert.alert(
                    I18n.t('AUTHENTICATION'),
                    responseData.error.message,
                    [{
                        text: I18n.t('OK'), onPress: () => {

                        }
                    }],
                    {cancelable: false}
                );
            }
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    onGotoLogin() {
        this.props.replaceRoute('login');
    }

    render() {
        return (
            <View style={[Styles.fullScreen, Styles.center]}>
                <View style={[Styles.fullScreen, {flex: 1}]}>
                    <Image
                        source={Images.bkgSplash}
                        resizeMode={'cover'}
                        style={[Styles.fullScreen, {position: 'absolute'}]}>
                    </Image>
                    {CommonWidgets.renderBigSpacer()}
                    {CommonWidgets.renderSpacer()}
                    <View style={Styles.center}>
                        {CommonWidgets.renderLogo()}
                    </View>
                    {CommonWidgets.renderStatusBar(Colors.black)}
                    <View style={[Styles.center, {flex: 1}]}>
                        <Text style={[Fonts.style.h3, { color: Colors.textPrimary }]}>
                            {'I would like to receive my password \n        in the registered e-mail.'}
                        </Text>
                    </View>
                    <View style={[{flex: 1.5, alignItems: 'center'}]}>
                        <View
                            style={[styles.textInputContainerStyle,
                                { borderColor: Utils.getTextInputBorderColor(this.state.emailFocus) }]}>
                            <TextField
                                underlineColorAndroid={'transparent'}
                                label={'Type your e-mail'}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                onChangeText={text => this.setState({ email: text })}
                                returnKeyType={'go'}
                                onSubmitEditing={() => this.onSubmit()}
                                onFocus={() => this.onTextInputFocus('email')}
                                value={this.state.email}/>
                        </View>
                    </View>
                    <View style={[styles.bodyContainer, {flex: 1, justifyContent: 'flex-start'}]}>
                        {CommonWidgets.renderMaterialButton('SEND',
                            Colors.green, () => this.onSubmit())}
                    </View>
                    <View style={[Styles.center, { flex: 1}]}>
                        <TouchableOpacity onPress={() => this.onGotoLogin()}>
                            <Text style={[Fonts.style.h4, { color: Colors.textThird}]}>
                                {I18n.t('RETURN')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}} />
                </View>
                {CommonWidgets.renderBackButton(() => this.props.replaceRoute('login'))}
            </View>
        );
    }
}

ForgotPassword.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
    };
}
function mapStateToProps(state) {
    return { };
}
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
