import React, { Component } from 'react';
import { Text, TextInput, Image, View, Platform, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Permissions from 'react-native-permissions';
import { replaceRoute } from '@actions/route';
import { signupAttempt } from '@actions/signup';
import CommonWidgets from '@components/CommonWidgets';
import ActionSheet from '@components/ActionSheet/';
import TextField from '@components/TextField/';
import OverlaySpinner from '@components/OverlaySpinner';
import { Metrics, Styles, Images, Icons, Colors, Fonts, Global } from '@theme/';
import Utils from '@src/utils';
import Constants from '@src/constants';
import styles from './styles';

class LocationProperty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            pwd1: '',
            pwd2: '',
            avatarUri: '',
            spinnerVisible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.attempting) {
            this.setState({ spinnerVisible: true });
        } if (nextProps.auth.signedUp) {
            this.setState({ spinnerVisible: false });
            if (this.state.avatarUri) this.doUploadImage();
            Alert.alert(
                I18n.t('REGISTER'),
                I18n.t(nextProps.auth.error),
                [{
                    text: 'OK', onPress: () => {
                        this.props.replaceRoute('login')
                    }
                }],
                { cancelable: false }
            );
        } else if (nextProps.auth.error) {
            this.setState({ spinnerVisible: false });
            Alert.alert(
                I18n.t('REGISTER'),
                I18n.t(nextProps.auth.error.message) ? I18n.t(nextProps.auth.error.message) : nextProps.auth.error.message,
                [{
                    text: 'OK', onPress: () => {

                    }
                }],
                { cancelable: false }
            );
        }
    }

    onSubmit() {
        if (this.isInputValidate()) {
            this.doSignUp();
        }
    }

    doSignUp() {
        if (Global.currentCoord.latitude === null) {
            Alert.alert(
                I18n.t('LOCATION_ACCESS_TITLE'),
                I18n.t('LOCATION_ACCESS_MESSAGE'),
                [
                    { text: I18n.t('NO_WAY'), style: 'cancel' },
                    { text: I18n.t('OPEN_SETTINGS'), onPress: Permissions.openSettings }
                ],
                { cancelable: false }
            );
        } else {
            this.props.signupAttempt({
                user: {
                    email: this.state.email,
                    password: this.state.pwd1,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    phone: this.state.phone,
                    type: Global.userType === 'client',
                    latitude: Global.currentCoord.latitude,
                    longitude: Global.currentCoord.longitude,
                }
            });
        }
    }

    doUploadImage() {
        const formdata = new FormData();
        formdata.append('image', { uri: this.state.avatarUri, name: 'image.jpg', type: 'image/jpg' });
        formdata.append('email', this.state.email);
        fetch(Global.API_URL + '/upload_image', {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            method: 'POST',
            body: formdata,
        }).then(response => {
            console.log('response', response);
            return response.json()
        }).then((responseData) => {
            console.log('responseData', responseData);
        }).catch((error) => {
            Utils.toast(error);
        }).done();
    }

    isInputValidate() {
        if (this.state.first_name.trim() === '') {
            this.first_nameInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_NAME'));
            return false;
        } else if (this.state.last_name.trim() === '') {
            this.last_nameInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_NAME'));
            return false;
        } else if (this.state.email.trim() === '') {
            this.emailInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_EMAIL'));
            return false;
        } else if (!Utils.validateEmail(this.state.email)) {
            this.emailInput.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_INVALID_EMAIL'));
            return false;
        } else if (this.state.phone.trim() === '') {
            this.phone.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_TELEPHONE'));
            return false;
        } else if (this.state.pwd1 === '') {
            this.pwd1Input.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_EMPTY_PASSWORD'));
            return false;
        } else if (this.state.pwd1 !== this.state.pwd2) {
            this.pwd2Input.focus();
            Utils.toast(I18n.t('ALERT_LOGIN_NOMATCH_PASSWORD'));
            return false;
        }
        return true;
    }

    showActionSheetMenu() {
        this.ActionSheet.show();
    }

    onActionSheetMenu(index) {
        const options = {
            quality: 1.0,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        switch (index) {
            case 0:
                ImagePicker.launchCamera(options, (response) => {
                    this.onImagePicker(response);
                });
                break;
            case 1:
                ImagePicker.launchImageLibrary(options, (response) => {
                    this.onImagePicker(response);
                });
                break;
            default:
        }
    }

    onImagePicker(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else if (response.uri !== undefined) {
            let source = '';
            if (Platform.OS === 'android') {
                source = { uri: response.uri };
            } else {
                source = { uri: response.uri.replace('file://', ''), isStatic: true };
            }
            ImageResizer.createResizedImage(source.uri, 400, 300, 'JPEG', 80)
                .then((resizedImageUri) => {
                    this.setState({
                        avatarUri: resizedImageUri,
                    });
                }).catch((err) => {
                console.log('imageResize', err);
            });
        }
    }

    render() {
        return (
            <View>

                {/*<KeyboardAwareScrollView*/}
                {/*style={{ backgroundColor: Colors.white }}*/}
                {/*alwaysBounceVertical={false}>*/}
                <Image
                    source={Images.bkgSplash}
                    resizeMode={'cover'}
                    style={[Styles.fullScreen, {position: 'absolute'}]}>
                </Image>
                <View>
                    {CommonWidgets.renderStatusBar(Colors.black)}
                    {/*<View style={{ height: Metrics.screenHeight * 0.1 }} />*/}
                    <View style={Styles.center}>
                        {/*<Text style={[Fonts.style.h2, { color: Colors.textPrimary, margin: 10 }]}>*/}
                        {/*{I18n.t('REGISTER')}*/}
                        {/*</Text>*/}
                        {/*<View>*/}
                        {/*<Image*/}
                        {/*resizeMode={'cover'}*/}
                        {/*style={styles.imgAvatar}*/}
                        {/*source={this.state.avatarUri === '' ? Images.imgAvatarPlaceholder : { uri: this.state.avatarUri }} />*/}
                        {/*<TouchableOpacity*/}
                        {/*style={styles.addIconContainer}*/}
                        {/*onPress={() => this.showActionSheetMenu()}>*/}
                        {/*<Image*/}
                        {/*style={styles.addIconStyle}*/}
                        {/*source={Icons.iconAdd} />*/}
                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*<View style={[Styles.center, {flex: 2}]}>*/}
                        {/*{CommonWidgets.renderLogo()}*/}
                        {/*<Text style={[Fonts.style.h2, { color: Colors.textPrimary }]}>*/}
                        {/*{Global.userType === 'freelancer' ? I18n.t('LOGIN_FREELANCER') : I18n.t('LOGIN_USER')}*/}
                        {/*</Text>*/}
                        {CommonWidgets.renderLogo()}
                        {/*</View>*/}
                        {CommonWidgets.renderMaterialButton(I18n.t('LOGIN_WITH_FB'),
                            Colors.green, () => this.loginFB())}
                        {/*<Text style={[Fonts.style.h5, { color: Colors.textPrimary }]}>*/}
                        {/*{I18n.t('UPLOAD_PHOTO')}*/}
                        {/*</Text>*/}
                    </View>
                    <View style={styles.bodyContainer}>
                        <View style={styles.textInputContainerStyle}>
                            <TextField
                                ref={(c) => { this.first_nameInput = c; }}
                                underlineColorAndroid={'transparent'}
                                label={I18n.t('FIRSTNAME')}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                onChangeText={text => this.setState({ first_name: text })}
                                autoCapitalize={'words'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.last_nameInput.focus()}
                                value={this.state.first_name} />
                        </View>
                        {/*<View style={styles.textInputContainerStyle}>*/}
                        {/*<TextField*/}
                        {/*ref={(c) => { this.last_nameInput = c; }}*/}
                        {/*underlineColorAndroid={'transparent'}*/}
                        {/*label={I18n.t('LASTNAME')}*/}
                        {/*labelColor={Colors.textPlaceholder}*/}
                        {/*highlightColor={Colors.textHighlightColor}*/}
                        {/*multiline={false}*/}
                        {/*onChangeText={text => this.setState({ last_name: text })}*/}
                        {/*autoCapitalize={'words'}*/}
                        {/*returnKeyType={'next'}*/}
                        {/*onSubmitEditing={() => this.emailInput.focus()}*/}
                        {/*value={this.state.last_name} />*/}
                        {/*</View>*/}
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
                                onSubmitEditing={() => this.phone.focus()}
                                value={this.state.email} />
                        </View>
                        {/*<View*/}
                        {/*style={styles.textInputContainerStyle}>*/}
                        {/*<TextField*/}
                        {/*ref={(c) => { this.phone = c; }}*/}
                        {/*underlineColorAndroid={'transparent'}*/}
                        {/*label={I18n.t('TELEPHONE')}*/}
                        {/*labelColor={Colors.textPlaceholder}*/}
                        {/*highlightColor={Colors.textHighlightColor}*/}
                        {/*multiline={false}*/}
                        {/*onChangeText={text => this.setState({ phone: text })}*/}
                        {/*keyboardType={'phone-pad'}*/}
                        {/*returnKeyType={'next'}*/}
                        {/*onSubmitEditing={() => this.pwd1Input.focus()}*/}
                        {/*value={this.state.phone} />*/}
                        {/*</View>*/}
                        <View
                            style={styles.textInputContainerStyle}>
                            <TextField
                                ref={(c) => { this.pwd1Input = c; }}
                                underlineColorAndroid={'transparent'}
                                label={I18n.t('PASSWORD')}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ pwd1: text })}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.pwd2Input.focus()}
                                value={this.state.pwd1} />
                        </View>
                        <View
                            style={styles.textInputContainerStyle}>
                            <TextField
                                ref={(c) => { this.pwd2Input = c; }}
                                underlineColorAndroid={'transparent'}
                                label={I18n.t('CONFIRM_PASSWORD')}
                                labelColor={Colors.textPlaceholder}
                                highlightColor={Colors.textHighlightColor}
                                multiline={false}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ pwd2: text })}
                                returnKeyType={'go'}
                                onSubmitEditing={() => this.onSubmit()}
                                value={this.state.pwd2} />
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        {CommonWidgets.renderMaterialButton(I18n.t('REGISTER'),
                            Colors.green, () => this.onSubmit())}
                        <TouchableOpacity onPress={() => this.onGotoRegister()}>
                            <Text style={[Fonts.style.h4, { color: Colors.textThird }]}>
                                {I18n.t('CANCEL')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ActionSheet
                        ref={(as) => { this.ActionSheet = as; }}
                        options={Constants.IP_BUTTONS}
                        cancelButtonIndex={Constants.IP_BUTTONS.length - 1}
                        onPress={this.onActionSheetMenu.bind(this)}
                        tintColor={Colors.textSecondary} />
                    {CommonWidgets.renderBackButton(() => this.props.replaceRoute('login'))}
                </View>
                {/*</KeyboardAwareScrollView>*/}
                <OverlaySpinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

LocationProperty.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        signupAttempt: user => dispatch(signupAttempt(user)),
    };
}
function mapStateToProps(state) {
    const auth = state.get('signup');
    return { auth };
}
export default connect(mapStateToProps, mapDispatchToProps)(LocationProperty);
