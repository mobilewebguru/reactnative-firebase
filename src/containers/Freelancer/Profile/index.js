import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Permissions from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from '@components/ActionSheet/';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setAvatar } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatarUri: props.globals.user.avatar_url,
            workImage1: props.globals.user.portfolio1,
            workImage2: props.globals.user.portfolio2,
            workImage3: props.globals.user.portfolio3,
            workImage4: props.globals.user.portfolio4,
            workImage5: props.globals.user.portfolio5,
            workImage6: props.globals.user.portfolio6,
            aboutMe: this.props.globals.user.about,
            curDate: new Date(),
            editableDesc: false,
            ratings: [],
            totalCount: 0,
            ratePageNo: 0,
        };
        this.selectedImgNo = 0;
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetRatings();
        }, Global.mountTimeout);
    }

    doGetRatings() {
        let isOK;
        fetch(Global.API_URL + '/get_ratings', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                page_no: this.state.ratePageNo
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                let tmp = this.state.ratings;
                responseData.ratings.forEach(item => {
                    tmp.push(item);
                });
                this.setState({ ratings: tmp, totalCount: responseData.count });
                this.props.globals.reviews_cnt = responseData.count;
                this.setState({ ratePageNo: this.state.ratePageNo + 1 });
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
                        { cancelable: false }
                    );
                }
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }

    onAddPhoto() {
        this.props.navigator.push({
            id: 'takeitemphoto',
            passProps: {
                callback: this.onCameraCallback
            },
        });
    }

    onCameraCallback = (imageUri) => {
        this.setState({ avatarUri: imageUri });
        this.doUploadImage(imageUri);
    };

    doUploadImage(workImage) {
        const formdata = new FormData();
        formdata.append('image', { uri: workImage, name: 'image.jpg', type: 'image/jpg' });
        formdata.append('index', this.selectedImgNo);
        formdata.append('token', Global.token);
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
            this.updatePropsImage(responseData.message.index, responseData.message.url);
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    doDeleteImage(index) {
        fetch(Global.API_URL + '/update_portfolio', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                index: index
            }),
        }).then((response) => {
            console.log('response', response);
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            this.updatePropsImage(responseData.message.index, responseData.message.url);
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    updatePropsImage(index, url) {
        switch (parseInt(index)) {
            case 1: this.props.globals.user.portfolio1 = url; break;
            case 2: this.props.globals.user.portfolio2 = url; break;
            case 3: this.props.globals.user.portfolio3 = url; break;
            case 4: this.props.globals.user.portfolio4 = url; break;
            case 5: this.props.globals.user.portfolio5 = url; break;
            case 6: this.props.globals.user.portfolio6 = url; break;
            default: this.props.globals.user.avatar_url = url; this.props.setAvatar(url); break;
        }
    }

    doUpdateAbout() {
        let isOK;
        fetch(Global.API_URL + '/update_about', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                about: this.state.aboutMe
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.globals.user.about = this.state.aboutMe;
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
                        { cancelable: false }
                    );
                }
            }
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    onActionSheetMenu(index) {
        const options = {
            quality: 1.0,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        switch (index) {
            case 0:
                Permissions.check('camera')
                    .then((response) => {
                        if (response !== 'denied') {
                            ImagePicker.launchCamera(options, (response) => {
                                this.onImagePicker(response);
                            });
                        } else {
                            Alert.alert(
                                I18n.t('CAN_ACCESS_PHOTO_TITLE'),
                                I18n.t('CAN_ACCESS_PHOTO_BODY'),
                                [
                                    { text: I18n.t('NO_WAY'), style: 'cancel' },
                                    { text: I18n.t('OPEN_SETTINGS'), onPress: Permissions.openSettings }
                                ],
                                { cancelable: false }
                            );
                        }
                    });
                break;
            case 1:
                Permissions.check('photo')
                    .then((response) => {
                        if (response !== 'denied') {
                            ImagePicker.launchImageLibrary(options, (response) => {
                                this.onImagePicker(response);
                            });
                        } else {
                            Alert.alert(
                                I18n.t('CAN_ACCESS_PHOTO_TITLE'),
                                I18n.t('CAN_ACCESS_PHOTO_BODY'),
                                [
                                    { text: I18n.t('NO_WAY'), style: 'cancel' },
                                    { text: I18n.t('OPEN_SETTINGS'), onPress: Permissions.openSettings }
                                ],
                                { cancelable: false }
                            );
                        }
                    });
                break;
            default:
        }
    }

    showActionSheetMenu() {
        this.ActionSheet.show();
    }

    onImagePicker(response) {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            let source = '';
            if (Platform.OS === 'android') {
                source = { uri: response.uri };
            } else {
                source = { uri: response.uri.replace('file://', ''), isStatic: true };
            }
            ImageResizer.createResizedImage(source.uri, 800, 600, 'JPEG', 80)
                .then((resizedImageUri) => {
                    let isChanged = true;
                    switch (this.selectedImgNo) {
                        case 1: if (resizedImageUri !== this.state.workImage1) this.setState({ workImage1: resizedImageUri }); else isChanged = false; break;
                        case 2: if (resizedImageUri !== this.state.workImage2) this.setState({ workImage2: resizedImageUri }); else isChanged = false; break;
                        case 3: if (resizedImageUri !== this.state.workImage3) this.setState({ workImage3: resizedImageUri }); else isChanged = false; break;
                        case 4: if (resizedImageUri !== this.state.workImage4) this.setState({ workImage4: resizedImageUri }); else isChanged = false; break;
                        case 5: if (resizedImageUri !== this.state.workImage5) this.setState({ workImage5: resizedImageUri }); else isChanged = false; break;
                        case 6: if (resizedImageUri !== this.state.workImage6) this.setState({ workImage6: resizedImageUri }); else isChanged = false; break;
                        default: if (resizedImageUri !== this.state.avatarUri) this.setState({ avatarUri: resizedImageUri }); else isChanged = false; break;
                    }
                    if (isChanged) this.doUploadImage(resizedImageUri);
                }).catch((err) => {
                    console.log('imageResize', err);
                    return Utils.toast('Unable to resize the photo');
                }
                );
        }
    }

    onAddWorkImage(imgNo) {
        this.selectedImgNo = imgNo;
        this.showActionSheetMenu()
    }

    onDelWorkImage(imgNo) {
        switch (imgNo) {
            case 1: this.setState({ workImage1: '' }); break;
            case 2: this.setState({ workImage2: '' }); break;
            case 3: this.setState({ workImage3: '' }); break;
            case 4: this.setState({ workImage4: '' }); break;
            case 5: this.setState({ workImage5: '' }); break;
            case 6: this.setState({ workImage6: '' }); break;
        }
        this.doDeleteImage(imgNo);
    }

    onDateChange(date) {
        this.props.navigator.push({
            id: 'availability',
            passProps: {
                selectedDate: date,
            },
        });
    }

    onOffers() {
        this.props.replaceRoute('products');
    }

    onScroll(event) {
        // const currentOffset = event.nativeEvent.contentOffset.y;
        // if (currentOffset < 0) {
        //   this.scrollView.scrollTo({ y: 0, animated: false });
        //   return;
        // }
    }

    doLogout() {
        let isOK = false;
        this.props.setSpinnerVisible(true);
        fetch(Global.API_URL + '/auth/logout', {
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
                store.delete('token').then(() => {
                    Global.token = null;
                    this.props.replaceRoute('login');
                });
            } else {
                this.props.replaceRoute('login');
            }
        }).catch((error) => {
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}>
                <Icon name={'md-menu'} size={25} style={{ color: Colors.white }} />
            </TouchableOpacity>
        );
        const headerView = (
            <View style={styles.topView}>
                <Text style={[Fonts.style.h2, styles.nameText]}>
                    {this.props.globals.user.first_name ? this.props.globals.user.first_name + ' ' + this.props.globals.user.last_name : ''}
                </Text>
                <View style={styles.rateContainer}>
                    <StarRating
                        disabled
                        starColor={'white'}
                        buttonStyle={{ marginLeft: 3 }}
                        maxStars={5}
                        starSize={11}
                        rating={this.props.globals.user.rating} />
                    <Text style={styles.rateText}>{this.props.globals.user.rating}</Text>
                </View>
            </View>
        );
        const imageAvatar = (
            <View style={styles.avatarContainer}>
                <Image
                    resizeMode={'stretch'}
                    style={styles.imgAvatar}
                    source={this.state.avatarUri ? { uri: this.state.avatarUri } : Images.imgAvatarPlaceholder} />
                {CommonWidgets.renderAddIconButton(() => {
                    this.onAddPhoto();
                    // this.onAddWorkImage(0);
                })}
            </View>
        );
        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={[Styles.navBarStyle, { height: Metrics.navBarHeight * 0.7, justifyContent: 'flex-start' }]}
                    statusBar={{ style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                {headerView}
                <KeyboardAwareScrollView
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white} style={Styles.center}>
                        <View style={styles.jobDescContainer}>
                            <View style={styles.jobDescSubView}>
                                {/*<Text style={[styles.jobDescText, { fontSize: 16, backgroundColor: 'transparent' }]}>0</Text>*/}
                                {/*<Text style={styles.jobDescText}>{I18n.t('JOB_CANCELED')}</Text>*/}
                            </View>
                            <View style={styles.jobDescSubView}>
                                <Text style={[styles.jobDescText, { fontSize: Fonts.size.h4, backgroundColor: 'transparent' }]}>{this.props.globals.reviews_cnt ? this.props.globals.reviews_cnt : this.state.totalCount}</Text>
                                <Text style={styles.jobDescText}>{I18n.t('REVIEWS')}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', padding: Metrics.screenWidth / 10, paddingTop: 20 }}>
                            <Text style={styles.headerText}>{I18n.t('MY_WORK_EXAMPLES')}</Text>
                            {CommonWidgets.renderSpacer()}
                            <View style={styles.workImageContainer}>
                                {CommonWidgets.renderWorkImage(this.state.workImage1, () => this.onAddWorkImage(1), () => this.onDelWorkImage(1))}
                                {CommonWidgets.renderWorkImage(this.state.workImage2, () => this.onAddWorkImage(2), () => this.onDelWorkImage(2))}
                                {CommonWidgets.renderWorkImage(this.state.workImage3, () => this.onAddWorkImage(3), () => this.onDelWorkImage(3))}
                            </View>
                            <View style={styles.workImageContainer}>
                                {CommonWidgets.renderWorkImage(this.state.workImage4, () => this.onAddWorkImage(4), () => this.onDelWorkImage(4))}
                                {CommonWidgets.renderWorkImage(this.state.workImage5, () => this.onAddWorkImage(5), () => this.onDelWorkImage(5))}
                                {CommonWidgets.renderWorkImage(this.state.workImage6, () => this.onAddWorkImage(6), () => this.onDelWorkImage(6))}
                            </View>
                            {CommonWidgets.renderBigSpacer()}
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>
                                    {I18n.t('ABOUT_ME') + ' '}
                                </Text>
                                <TouchableOpacity
                                    style={{ width: 50, justifyContent: 'center' }}
                                    onPress={() => {
                                        if (this.state.editableDesc) {
                                            this.doUpdateAbout();
                                        } else {
                                            if (this.refs.aboutInput) this.refs.aboutInput.focus();;
                                        }
                                        this.setState({ editableDesc: !this.state.editableDesc });
                                    }}>
                                    <Icon name={this.state.editableDesc ? 'md-add-circle' : 'md-create'} size={16} style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            {!this.state.editableDesc ? (
                                <Text style={[styles.headerText, { fontSize: Fonts.size.h6 }]}>
                                    {(this.state.aboutMe ? this.state.aboutMe : I18n.t('ABOUT_ME')) + ' '}
                                </Text>
                            ) : (
                                    <TextInput
                                        style={styles.descriptionText}
                                        underlineColorAndroid={'transparent'}
                                        ref="aboutInput"
                                        placeholder={I18n.t('ABOUT_ME')}
                                        editable
                                        maxLength={300}
                                        multiline
                                        numberOfLines={3}
                                        onChangeText={text => this.setState({ aboutMe: text })}
                                        value={this.state.aboutMe}
                                        returnKeyType={'next'}
                                        textAlignVertical={'top'}
                                    />
                                )
                            }
                            {CommonWidgets.renderBigSpacer()}
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>
                                    {I18n.t('MY_OFFER') + ' '}
                                </Text>
                                <TouchableOpacity style={{ width: 50, justifyContent: 'center' }} onPress={() => this.onOffers()}>
                                    <Icon name='md-create' size={16} style={{ marginLeft: 20 }} />
                                </TouchableOpacity>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            {this.props.globals.products.map(item => (
                                <View style={Styles.rowSpace} key={item.id}>
                                    <Text style={[styles.headerText, { width: Metrics.screenWidth / 3 }]}>
                                        {Global.categories[item.category_id - 1].name + ' '}
                                    </Text>
                                    <Text style={[styles.headerText, { width: Metrics.screenWidth / 3 }]}>
                                        {Global.categories[item.category_id - 1].subCategory[item.sub_category_id - 1].name + ' '}
                                    </Text>
                                    <Text style={styles.headerText}>
                                        {item.price + '€'}
                                    </Text>
                                    {/*<TouchableOpacity onPress={() => console.log(item.key)}>*/}
                                    {/*<Image style={Styles.imageIconStyle} source={Icons.iconClose}/>*/}
                                    {/*</TouchableOpacity>*/}
                                </View>)
                            )}
                            {CommonWidgets.renderBigSpacer()}
                            {this.state.ratings.map(item => (
                                <View key={item.id}>
                                    <Image
                                        source={item.avatar_url ? { uri: item.avatar_url } : Images.imgAvatarPlaceholder}
                                        style={styles.reviewImage} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <StarRating
                                            disabled
                                            starColor={'black'}
                                            buttonStyle={{ marginLeft: 3 }}
                                            maxStars={5}
                                            starSize={11}
                                            rating={item.score} />
                                        <Text style={styles.reviewRateText}>{item.score + ''}</Text>
                                    </View>
                                    {CommonWidgets.renderSmallSpacer()}
                                    <Text>
                                        {'"' + item.feedback + '"'}
                                    </Text>
                                    {CommonWidgets.renderBigSpacer()}
                                </View>)
                            )}
                            {this.state.ratePageNo * Global.pageSize < this.state.totalCount &&
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerText}>{I18n.t('SHOW_MORE') + ' '}</Text>
                                    <TouchableOpacity style={{ width: 50 }} onPress={() => this.doGetRatings()}>
                                        <Icon name='md-arrow-dropdown' size={22} style={{ marginLeft: 5 }} />
                                    </TouchableOpacity>
                                </View>}
                        </View>
                        <TouchableOpacity
                            style={{ alignSelf: 'center' }}
                            onPress={() => this.doLogout()}>
                            <Text style={styles.logoutText}>{I18n.t('LOGOUT')}</Text>
                        </TouchableOpacity>
                        {CommonWidgets.renderSpacer()}
                        <Text style={styles.logoutText}>Version 1.0</Text>
                    </View>
                    {CommonWidgets.renderLargeSpacer()}
                </KeyboardAwareScrollView>
                {imageAvatar}
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={Constants.IP_BUTTONS}
                    cancelButtonIndex={Constants.IP_BUTTONS.length - 1}
                    onPress={this.onActionSheetMenu.bind(this)}
                    tintColor={Colors.textSecondary}
                />
                <OverlaySpinner visible={this.props.globals.spinnerVisible} />
            </View>
        );
    }
}

Profile.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        openDrawer: () => dispatch(openDrawer()),
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
        setProducts: user => dispatch(setProducts(products)),
    };
}

function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
