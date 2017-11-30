import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import CardView from 'react-native-cardview';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Geocoder from 'react-native-geocoder'
import Communications from 'react-native-communications';
import Moment from 'moment'
import ActionSheet from '@components/ActionSheet/';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, pushNewRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class BookingDetail extends Component {

    constructor(props) {
        super(props);
        this.state= {
            freelancer: {},
            address: '',
            offers: [],
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetBookingDetail();
        }, Global.mountTimeout);
    }

    doGetBookingDetail() {
        let isOK;
        fetch(Global.API_URL + '/get_booking', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job_id: this.props.booking.id
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.setState({
                    freelancer: responseData.freelancer,
                    offers: responseData.offers
                });
                this.doGetAddress();
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

    onCall() {
        if (this.props.booking.status === Constants.jobStatus.Accepted) Communications.phonecall(this.state.freelancer.phone, false);
        else alert(I18n.t('FREELANCER_NOT_ACCEPTED'));
    }

    doGetAddress() {
        let NY = {
            lat: this.state.freelancer.latitude,
            lng: this.state.freelancer.longitude
        };
        Geocoder.geocodePosition(NY).then(res => {
            console.log('geocodePosition', res);
            this.setState({address: res[0].formattedAddress});
        }).catch(err => {
            console.log('address error', err)
        });
    }

    render() {
        const navBarTitleConfig = {
            title: I18n.t('YOUR_BOOKING_REQUEST'),
            style: Styles.navBarTitle,
        };
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const headerView = (
            <View style={styles.topView}>
                <Text style={[Fonts.style.h2, styles.nameText]}>
                    {this.state.freelancer.first_name ? this.state.freelancer.first_name + ' ' + this.state.freelancer.last_name : ''}
                </Text>
                <View style={styles.rateContainer}>
                    <StarRating
                        disabled
                        starColor={'white'}
                        buttonStyle={{ marginLeft: 3}}
                        maxStars={5}
                        starSize={11}
                        rating={this.state.freelancer.rating}/>
                    <Text style={styles.rateText}>{this.state.freelancer.rating}</Text>
                </View>
            </View>
        );
        const imageAvatar = (
            <View style={styles.avatarContainer}>
                <Image
                    resizeMode={'stretch'}
                    style={styles.imgAvatar}
                    source={ this.state.freelancer.avatar_url ? {uri: this.state.freelancer.avatar_url} : Images.imgAvatarPlaceholder} />
            </View>
        );
        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                {headerView}
                <KeyboardAwareScrollView
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white} style={Styles.center}>
                        {CommonWidgets.renderSmallSpacer()}
                        <View style={{ flexDirection: 'row', width: '100%', height: Metrics.screenHeight / 10, alignItems: 'center'}}>
                            <View style={{flex: 2}}/>
                            {this.props.booking.status === Constants.jobStatus.Accepted &&
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image
                                    style={styles.acceptedImage}
                                    source={Images.imgAccepted}/>
                                <Text style={styles.acceptedText}>
                                    {I18n.t('ACCEPTED')}
                                </Text>
                            </View>}
                        </View>
                        {CommonWidgets.renderSpacer()}
                        <View style={styles.subView}>
                            <Text style={styles.headerText}>
                                {Utils.revertFromUTC(this.props.booking.book_time).format('DD.MM.YYYY, HH:mm')}
                            </Text>
                            <Text style={[styles.headerText, {fontSize: Fonts.size.h5, textAlign: 'center'}]}>
                                {this.state.address}
                            </Text>
                            <Text style={[styles.headerText, {fontSize: Fonts.size.h5}]}>
                                {this.props.booking.total_price}, -€
                            </Text>
                        </View>
                        {CommonWidgets.renderSpacer()}
                        {CommonWidgets.renderSmallSpacer()}
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
                                <Text style={[styles.aboutText, { width: Metrics.screenWidth * 0.3 }]}>Summe</Text>
                            </View>
                            <Text style={styles.aboutText}>{this.props.booking.total_price + ',-€'}</Text>
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        <CardView style={[Styles.circleButtonShadow, {alignItems: 'center'}]}
                                  cardElevation={5}
                                  cardMaxElevation={5}
                                  cornerRadius={5}>
                            {CommonWidgets.renderSpacer()}
                            <View style={Styles.rowSpace}>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Image
                                        style={[styles.logoImage, { borderColor: Colors.textPrimary }]}
                                        source={this.state.freelancer.avatar_url ? {uri: this.state.freelancer.avatar_url} : Images.imgAvatarPlaceholder}/>
                                </View>
                                <View style={{flex: 2.5, alignItems: 'flex-end'}}>
                                    <Text style={styles.infoText}>
                                        {Utils.revertFromUTC(this.props.booking.book_time).format('DD.MM.YYYY, HH:mm')}
                                    </Text>
                                    <Text style={[styles.infoText, {textAlign: 'right'}]}>
                                        {this.state.address}
                                    </Text>
                                    <Text style={styles.infoText}>
                                        {this.props.booking.total_price}, -€
                                    </Text>
                                </View>
                                <View style={{flex: 0.25}}/>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            {CommonWidgets.renderMaterialButton(
                                I18n.t('CALL'), Colors.black,() => this.onCall())}
                            {CommonWidgets.renderBigSpacer()}
                        </CardView>
                    </View>
                    {CommonWidgets.renderBigSpacer()}
                </KeyboardAwareScrollView>
                {imageAvatar}
            </View>
        );
    }
}
BookingDetail.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    pushNewRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingDetail);
