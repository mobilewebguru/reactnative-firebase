import React, { Component } from 'react';
import { Text, TextInput, Image, View, Platform, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Permissions from 'react-native-permissions';
import { replaceRoute, popRoute, pushNewRoute} from '@actions/route';
import { signupAttempt } from '@actions/signup';
import CommonWidgets from '@components/CommonWidgets';
import ActionSheet from '@components/ActionSheet/';
import TextField from '@components/TextField/';
import OverlaySpinner from '@components/OverlaySpinner';
import { Metrics, Styles, Images, Icons, Colors, Fonts, Global } from '@theme/';
import Utils from '@src/utils';
import Constants from '@src/constants';
import styles from './styles';
import NavBar from 'react-native-navbar';
import { Button, FormInput, CheckBox } from 'react-native-elements';
// import Dash from 'react-native-dash';

class CropProperty extends Component {

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
        // if (this.isInputValidate()) {
            this.goCropDetail();
        // }
    }

    goCropDetail() {
        this.props.pushNewRoute('cropdetail');
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
    onActive(){

    }
    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}
            >
                {/*<Icon name={'md-menu'} size={25} style={{ color: Colors.white}}/>*/}
            </TouchableOpacity>
        );
        const rightButton = (
            <TouchableOpacity
                style={Styles.center}
                onPress={() => this.onActive()}
            >
                <Image
                    style={styles.activeAvatar}
                    source={Images.imgStepImage}/>
                {/*<Text style={styles.activeText}>{I18n.t('INACTIVE')}</Text>*/}
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('DASHBOARD'),
            style: Styles.navBarTitle,
        };
        return (
            <View style={{flex: 1}}>

                {/*<KeyboardAwareScrollView*/}
                {/*style={{ backgroundColor: Colors.white }}*/}
                {/*alwaysBounceVertical={false}>*/}
                {/*<Image*/}
                {/*source={Images.bkgSplash}*/}
                {/*resizeMode={'cover'}*/}
                {/*style={[Styles.fullScreen, {position: 'absolute'}]}>*/}
                {/*</Image>*/}
                <View style={{backgroundColor: 'white', flex: 1}}>
                    {CommonWidgets.renderStatusBar(Colors.black)}
                    <NavBar
                        containerStyle={Styles.navBarStyle}
                        statusBar={{style: 'light-content', tintColor: Colors.white }}
                        leftButton={leftButton}
                        // rightButton={rightButton}
                        title={rightButton}
                    />
                    {/*<View style={{ height: Metrics.screenHeight * 0.1 }} />*/}
                    <View style={Styles.center}>
                        <Text style={[Fonts.style.h3, { color: Colors.green}]}>
                            {I18n.t('CROPPROPERTY')}
                        </Text>
                        <Text style={[Fonts.style.h5, { color: Colors.textPrimary }]}>
                            {"Select which crops you grow on your property\n                 and would like to monitor."}
                        </Text>
                    </View>
                    {CommonWidgets.renderSpacer()}
                    {CommonWidgets.renderSpacer()}

                    <View style={[styles.bodyContainer, {flex: 1}]}>
                        <View style={[styles.textInputContainerStyle, {flexDirection: 'row', borderColor: 'gray', borderWidth: 1}]}>
                            <TextInput
                                style={{height: 60, width: Metrics.screenWidth * 0.8, borderColor: 'gray', marginLeft: 20}}
                                onChangeText={(text) => this.setState({text})}
                                value={this.state.text}
                                placeholder={'Filter cultures'}
                            />
                            <Image style={{alignItems: 'center', justifyContent: 'center', marginTop: 15}}
                                source={Icons.iconSearch}/>
                        </View>
                        <KeyboardAwareScrollView>

                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked1: !this.state.checked1})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                    source={this.state.checked1 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Soy bean</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked2: !this.state.checked2})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked2 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Sugar Cane</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked3: !this.state.checked3})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked3 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Coffee</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked4: !this.state.checked4})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked4 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Corn</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked5: !this.state.checked5})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked5 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Sorgho</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked6: !this.state.checked6})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked6 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Sorgho</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked7: !this.state.checked7})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked7 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Sorgho</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.textInputContainerStyle, {padding: 20, borderBottomWidth: 1, borderColor: Colors.green}]}>

                            <TouchableOpacity
                                style={[{flexDirection: 'row'}]}
                                onPress={() => this.setState({checked8: !this.state.checked8})}
                            >
                                <Image  style={{paddingLeft: 10}}
                                        source={this.state.checked8 ? Icons.iconChecked : Icons.iconUnchecked}
                                >
                                </Image>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={{flex: 1}}>    Sorgho</Text>
                                </View>
                                {/*<Dash style={{width:100, height:1}}/>*/}
                            </TouchableOpacity>
                        </View>
                        </KeyboardAwareScrollView>
                    </View>
                    {CommonWidgets.renderStepButton(I18n.t('NEXT'),
                        Colors.green, () => this.onSubmit())}
                    <ActionSheet
                        ref={(as) => { this.ActionSheet = as; }}
                        options={Constants.IP_BUTTONS}
                        cancelButtonIndex={Constants.IP_BUTTONS.length - 1}
                        onPress={this.onActionSheetMenu.bind(this)}
                        tintColor={Colors.textSecondary} />
                    {CommonWidgets.renderBackButton(() => this.props.popRoute())}
                </View>
                {/*</KeyboardAwareScrollView>*/}
                <OverlaySpinner visible={this.state.spinnerVisible} />
            </View>
        );
        const customStyle = {
            hasEventCircle: {
                backgroundColor: Colors.brandPrimary,
            },
            hasEventACircle: {
                backgroundColor: Colors.brandSecondary,
            },
            hasEventText: {
                color: Colors.white
            },
            hasEventAText: {
                color: Colors.white
            },
        };
    }
}

CropProperty.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        popRoute: () => dispatch(popRoute()),
        replaceRoute: route => dispatch(replaceRoute(route)),
        signupAttempt: user => dispatch(signupAttempt(user)),
    };
}
function mapStateToProps(state) {
    const auth = state.get('signup');
    return { auth };
}
export default connect(mapStateToProps, mapDispatchToProps)(CropProperty);
