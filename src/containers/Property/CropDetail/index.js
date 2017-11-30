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
import {Button, FormInput, FormLabel} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-simple-modal';
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';


class CropDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            pwd1: '',
            pwd2: '',
            cutDate: new Date(),
            avatarUri: '',
            calendarVisible: false,
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
        //     this.doSignUp();
        // }
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
    onActive(){

    }
    showDatePicker() {
        this.setState({calendarVisible: true});
    }
    handleDatePicked(date) {
        // this.setState({expiaryDate: date.toDate()});
        this.hideDatePicker();
    }
    hideDatePicker() {
        this.setState({calendarVisible: false});
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
                        <Text style={[Fonts.style.h3, { color: Colors.green }]}>
                            {I18n.t('CROPDETAIL')}
                        </Text>
                        <Text style={[Fonts.style.h5, { color: Colors.textPrimary }]}>
                        {"        Describe the average yield of the\n crops listed by you in the last few seasons."}
                        </Text>
                    </View>
                    {CommonWidgets.renderSpacer()}
                    <KeyboardAwareScrollView>

                    <View style={[styles.bodyContainer, {flex: 1, borderWidth: 1, marginLeft: 20, marginRight: 20, borderColor: Colors.green, backgroundColor: Colors.box}]}>
                        <View style={{padding: 20, justifyContent: 'center'}}>
                            <View style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                        CROPS NAME
                                    </FormLabel>
                                </View>
                                <View style={[styles.viewInputStyle]}>
                                    <TextInput
                                        style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                        onChangeText={(text1) => this.setState({text1})}
                                        value={this.state.text1}
                                        placeholder={'Soy 2017-18'}
                                    />
                                </View>
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                        PLANTING DATE
                                    </FormLabel>
                                </View>
                                <View  style={[styles.viewInputStyle]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <TextInput
                                            style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                            onChangeText={(text2) => this.setState({text2})}
                                            value={this.state.text2}
                                            placeholder={'20/10/2017'}
                                        />
                                        <TouchableOpacity onPress={() => this.showDatePicker()}>
                                            <Image style={{marginTop: 5}}
                                                   source={Images.imgCalendarImage}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                       EXPECTED HARVEST DATE
                                    </FormLabel>
                                </View>
                                <View  style={[styles.viewInputStyle]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <TextInput
                                            style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                            onChangeText={(text3) => this.setState({text3})}
                                            value={this.state.text3}
                                            placeholder={'20/01/2018'}
                                        />
                                        <TouchableOpacity onPress={() => this.showDatePicker()}>

                                        <Image style={{marginTop: 5}}
                                               source={Images.imgCalendarImage}/>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                            <View
                                    style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                        PRODUCTIVITY OF THE LAST HARVEST
                                    </FormLabel>
                                </View>
                                <View  style={styles.viewInputStyle}>
                                    <TextInput
                                        style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                        onChangeText={(text4) => this.setState({text4})}
                                        value={this.state.text4}
                                        placeholder={'50,00 sacks/ac'}
                                    />
                                </View>
                            </View>
                            <View
                                style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                        CROP VARIETY
                                    </FormLabel>
                                </View>
                                <View  style={styles.viewInputStyle}>
                                    <TextInput
                                        style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                        onChangeText={(text5) => this.setState({text5})}
                                        value={this.state.text5}
                                        placeholder={'Enter the varieties grown in the crop'}
                                    />
                                </View>
                            </View>
                            <View
                                style={styles.textInputContainerStyle}>
                                <View>
                                    <FormLabel
                                        labelStyle={styles.placeHolderText}
                                    >
                                        TOTAL CROP AREA
                                    </FormLabel>
                                </View>
                                <View  style={styles.viewInputStyle}>
                                    <TextInput
                                        style={{width: Metrics.screenWidth * 0.7, padding: 0}}
                                        onChangeText={(text6) => this.setState({text6})}
                                        value={this.state.text6}
                                        placeholder={'250,00 ac'}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    </KeyboardAwareScrollView>
                    {CommonWidgets.renderStepButton(I18n.t('FINISH'),
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
                <Modal
                    open={this.state.calendarVisible}
                    offset={0}
                    overlayBackground={'rgba(0, 0, 0, 0.75)'}
                    animationDuration={200}
                    animationTension={40}
                    modalDidClose={() => this.hideDatePicker()}
                    closeOnTouchOutside
                    containerStyle={{}}
                    modalStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <Calendar
                        onChange={date => this.handleDatePicked(date)}
                        selected={this.state.curDate}
                        minDate={Moment().add(-3, 'years').startOf('day')}
                        maxDate={Moment().add(3, 'years').startOf('day')}
                        barView={{backgroundColor: Colors.green}}
                        dayTodayText={{backgroundColor: Colors.green}}
                        daySelectedText={{
                            fontWeight: 'bold',
                            backgroundColor: Colors.green,
                            color: Colors.textPrimary,
                            borderColor: Colors.green,
                            borderRadius: 15,
                            overflow: 'hidden',
                        }}
                        style={{
                            borderWidth: 1,
                            backgroundColor: Colors.green,
                            borderColor: Colors.green,
                            borderRadius: 5,
                            minWidth: Metrics.screenWidth * 0.9,
                            width: Metrics.screenWidth * 0.9,
                            right: Metrics.screenWidth * 0.035,
                        }}
                        barText={{
                            fontWeight: 'bold',
                            color: Colors.textPrimary,
                        }}
                        dayHeaderView={{
                            backgroundColor: '#F5F5F5',
                            borderBottomColor: '#BDBDBD',
                        }}
                        dayRowView={{
                            borderColor: '#F5F5F5',
                            height: 40,
                        }}
                        stageView={{
                            padding: 0,
                        }}
                    />
                </Modal>
                <OverlaySpinner visible={this.state.spinnerVisible} />

            </View>
        );
    }
}

CropDetail.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(CropDetail);
