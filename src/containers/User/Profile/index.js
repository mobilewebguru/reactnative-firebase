import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import Moment from 'moment';
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Permissions from 'react-native-permissions';
import ActionSheet from '@components/ActionSheet/';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
            phoneEditable: false,
            phoneNo: props.globals.user.phone,
            pastJobs: [],
            totalCount: 0,
            ratePageNo: 0,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetPastJobs();
        }, Global.mountTimeout);
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
        this.setState({avatarUri: imageUri});
        this.doUploadImage(imageUri);
    };

    doUploadImage(workImage) {
        const formdata = new FormData();
        formdata.append('image', {uri: workImage, name: 'image.jpg', type: 'image/jpg'});
        formdata.append('index', 0);
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

    updatePropsImage(index, url) {
        this.props.setAvatar(url);
    }

    doUpdatePhoneNo() {
        let isOK;
        fetch(Global.API_URL + '/update_phone', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                phone: this.state.phoneNo
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.globals.user.phone = this.state.phoneNo;
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
            console.log('error', error);
        }).done();
    }

    doGetPastJobs() {
        let isOK;
        fetch(Global.API_URL + '/get_past_jobs', {
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
                let tmp = this.state.pastJobs;
                responseData.jobs.forEach(item => {
                    tmp.push(item);
                });
                this.setState({pastJobs: tmp, totalCount: responseData.count});
                this.setState({ratePageNo: this.state.ratePageNo + 1});
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

    onGoRatePage(item) {
        this.props.navigator.push({
            id: 'bookingrate',
            passProps: {
                job: item,
                callback: this.onCallback
            },
        });
    }

    onCallback = (item) => {
        const tmp = Utils.clone(this.state.pastJobs);
        const index = tmp.indexOf(item);
        tmp.splice(index, 1);
        this.setState({pastJobs: tmp});
    };

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

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}>
                <Icon name={'md-menu'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('MYPROFILE'),
            style: Styles.navBarTitle,
        };
        const imageAvatar = (
            <View>
                <Image
                    resizeMode={'stretch'}
                    style={styles.imgAvatar}
                    source={this.state.avatarUri ? {uri: this.state.avatarUri} : Images.imgAvatarPlaceholder} />
                {CommonWidgets.renderAddIconButton(() => {
                    this.onAddPhoto();
                })}
            </View>
        );

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
                    <View backgroundColor={Colors.white} style={Styles.center}>
                        {CommonWidgets.renderBigSpacer()}
                        {imageAvatar}
                        {CommonWidgets.renderSpacer()}
                        <Text style={[Fonts.style.h2, styles.nameText]}>
                            {this.props.globals.user.first_name ? this.props.globals.user.first_name + ' ' + this.props.globals.user.last_name : ''}
                        </Text>
                        {CommonWidgets.renderBigSpacer()}
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 0.2}}/>
                            <View style={{flex: 0.7}}>
                                <Text style={styles.phoneText}>
                                    {I18n.t('PHONE_NUMBER')}
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <TextInput
                                    ref="phoneInput"
                                    style={styles.editText}
                                    editable={this.state.phoneEditable}
                                    maxLength={15}
                                    multiline={false}
                                    numberOfLines={1}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.phoneNo}
                                    keyboardType={'phone-pad'}
                                    returnKeyType={'done'}
                                    onChangeText={(text) => this.setState({text})}
                                />
                                <TouchableOpacity
                                    style={{alignSelf: 'flex-end', position: 'absolute'}}
                                    onPress={() => {
                                        if (this.state.phoneEditable) this.doUpdatePhoneNo();
                                        else this.refs.phoneInput.focus();
                                        this.setState({phoneEditable: !this.state.phoneEditable})
                                    }}>
                                    <Text style={styles.buttonText}>{this.state.phoneEditable ? I18n.t('SAVE') : I18n.t('EDIT')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.2}}/>
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        <Text style={[Fonts.style.h3, styles.nameText]}>
                            {I18n.t('RATE_PAST_JOB')}
                        </Text>
                        <View style={styles.subContainer}>
                            {this.state.pastJobs.map(item => (
                                <TouchableOpacity key={item.id} onPress={() => this.onGoRatePage(item)}>
                                    <View style={styles.itemContainer}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <Image
                                                source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}
                                                style={styles.reviewImage}/>
                                        </View>
                                        <View style={{flex: 4}}>
                                            <Text style={styles.nameText}>{item.first_name + ' ' + item.last_name}</Text>
                                            <Text style={styles.dateText}>{Utils.revertFromUTC(item.book_time).format('D. MMMM YYYY')}</Text>
                                        </View>
                                    </View>
                                    {CommonWidgets.renderSmallSpacer()}
                                </TouchableOpacity>)
                            )}
                            {this.state.ratePageNo * Global.pageSize < this.state.totalCount &&
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>{I18n.t('SHOW_MORE') + ' '}</Text>
                                <TouchableOpacity style={{ width: 50 }} onPress={() => this.doGetPastJobs()}>
                                    <Icon name='md-arrow-dropdown' size={22} style={{ marginLeft: 5}}/>
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <TouchableOpacity onPress={() => this.doLogout()}>
                            <Text style={styles.logoutText}>{I18n.t('LOGOUT')}</Text>
                        </TouchableOpacity>
                        {CommonWidgets.renderSpacer()}
                        <Text style={styles.logoutText}>Version 1.0</Text>
                    </View>
                    {CommonWidgets.renderLargeSpacer()}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
Profile.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
