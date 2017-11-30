import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import update from 'react-addons-update';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import Geocoder from 'react-native-geocoder'
import Moment from 'moment';
import ActionSheet from '@components/ActionSheet/';
import CommonWidgets from '@components/CommonWidgets';
import HourToggleView from '@components/HourToggleView';
import OfferSentModalView from '@components/ModalViewOfferSent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CardView from 'react-native-cardview'
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import { getFreelancerAttempt } from '@actions/get_freelancer';
import { getRatingsAttempt } from '@actions/get_ratings';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

const countMenu = [{ id: 0, label: I18n.t('CANCEL') },
    { id: 1, name: 0 }, { id: 2, name: 1 }, { id: 3, name: 2 }, { id: 4, name: 3 },
    { id: 5, name: 4 }, { id: 6, name: 5 }, { id: 7, name: 6 }, { id: 8, name: 7 },
    { id: 9, name: 8 }, { id: 10, name: 9 }, { id: 11, name: 10 },];

class BookingMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            freelancer: props.freelancer,
            selectedOfferIndex : -1,
            workImages: [],
            offers: [],
            curDate: new Date(),
            selectedHour: -1,
            dayhour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
            address: '',
            ratings: [],
            totalCount: 0,
            ratePageNo: 0,
            isPending: false,
        };
        this.total = 0;
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetFreelancerData();
            this.doGetRatingData();
            this.doGetAddress();
        }, Global.mountTimeout);
    }

    componentWillReceiveProps(nextProps) {
        console.log("BookingMain received nextProps.");
        if (this.props.response1 !== nextProps.response1) {
            if (nextProps.response1.attempting) {
            } else if (nextProps.response1.isOK) {
                let responseData = nextProps.response1.data;
                this.setState({
                    freelancer: Object.assign(this.state.freelancer, responseData.freelancer),
                    offers: responseData.products,
                    isPending: responseData.pending
                });
                let tmpImages = [];
                if (responseData.freelancer.portfolio1) tmpImages.push(responseData.freelancer.portfolio1);
                if (responseData.freelancer.portfolio2) tmpImages.push(responseData.freelancer.portfolio2);
                if (responseData.freelancer.portfolio3) tmpImages.push(responseData.freelancer.portfolio3);
                if (responseData.freelancer.portfolio4) tmpImages.push(responseData.freelancer.portfolio4);
                if (responseData.freelancer.portfolio5) tmpImages.push(responseData.freelancer.portfolio5);
                if (responseData.freelancer.portfolio6) tmpImages.push(responseData.freelancer.portfolio6);
                this.setState({workImages: tmpImages});
            } else if (nextProps.response1.data) {
                let message = nextProps.response1.data.message;
                if (message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                } else {
                    console.log('error', message);
                }
            }
        } else if (this.props.response2 !== nextProps.response2) {
            if (nextProps.response2.attempting) {
            } else if (nextProps.response2.isOK) {
                let responseData = nextProps.response2.data;
                let tmp = this.state.ratings;
                responseData.ratings.forEach(item => {
                    tmp.push(item);
                });
                this.setState({ratings: tmp, totalCount: responseData.count});
                this.setState({ratePageNo: this.state.ratePageNo + 1});
            } else if (nextProps.response2.data) {
                let message = nextProps.response2.data.message;
                if (message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                } else {
                    console.log('error', message);
                }
            }
        }
    }

    doGetFreelancerData() {
        this.props.getFreelancerAttempt({
            token: Global.token,
            freelancer_id: this.props.freelancer.id
        });
    }

    doGetRatingData() {
        this.props.getRatingsAttempt({
            token: Global.token,
            user_id: this.state.freelancer.id,
            page_no: this.state.ratePageNo
        });
    }

    doGetAddress() {
        let NY = {
            lat: this.state.freelancer.latitude,
            lng: this.state.freelancer.longitude,
        };
        Geocoder.geocodePosition(NY).then(res => {
            console.log('geocodePosition', res);
            this.setState({address: res[0].formattedAddress});
        }).catch(err => {
            console.log('address error', err)
        });
    }

    doSendRequest(serverFormattedTime) {
        let isOK;
        fetch(Global.API_URL + '/send_request', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job: {
                    freelancer_id: this.state.freelancer.id,
                    book_time: serverFormattedTime,
                    total_price: this.total,
                    unit: '€',
                    latitude: this.props.location.latitude,
                    longitude: this.props.location.longitude,
                },
                offers: this.state.offers
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            this.props.setSpinnerVisible(false);
            console.log('responseData', responseData);
            if (isOK) {
                if (responseData.message === 'ok') {
                    this.setState({isPending: true});
                } else {
                    Alert.alert(
                        I18n.t('APP_NAME'),
                        I18n.t(responseData.message),
                        [{
                            text: I18n.t('OK'), onPress: () => {

                            }
                        }],
                        {cancelable: false}
                    );
                }
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

    onDateChange(date) {
        console.log(Moment(date).format('YYYY-MM-DD'));
        this.setState({ curDate: date });
    }

    onTimeChange(index) {
        if (this.state.dayhour[index] === 0) {
            console.log('You can not select unavailable hour.');
            // return;
        }
        this.setState({ selectedHour: index });
    }

    onSendRequest() {
        if (this.total === 0) {
            Utils.toast(I18n.t('OFFER_SELECT_WARNING'));
        } else if (this.state.selectedHour < 0) {
            Utils.toast('Select booking hour.');
        } else {
            const time = Moment(Utils.getFormattedTime(this.state.curDate, this.state.selectedHour)).utc();
            if (Moment().diff(time) > 0) {
                Utils.toast('You can not select unavailable hour.');
            } else {
                this.doSendRequest(time.format(Global.serverTimeFormat));
            }
        }
    }

    onGotoHome() {
        this.props.popRoute();
        // this.props.replaceRoute('bookingcomplete');
    }

    showActionSheetMenu(index) {
        console.log('selected skill index', index);
        this.ActionSheet.show();
        this.setState({selectedOfferIndex: index});
    }

    onActionSheetItemSelected(index) {
        console.log('selected number index', index);
        this.setState({
            offers: update(
                this.state.offers,
                {
                    [this.state.selectedOfferIndex] : {
                        'amount': {$set: countMenu[index].name}
                    }
                }
            ),
        });
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}>
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const headerView = (
            <View style={styles.topView}>
                <Text style={[Fonts.style.h2, styles.nameText]}>
                    {this.state.freelancer.first_name + ' ' + this.state.freelancer.last_name}
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
                    source={this.state.freelancer.avatar_url ? {uri: this.state.freelancer.avatar_url} : Images.imgAvatarPlaceholder} />
            </View>
        );
        this.total = 0;
        this.state.offers.map(item =>{
            this.total = this.total + item.price * (item.amount ? item.amount : 0);
        });

        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={[Styles.navBarStyle, { height: Metrics.navBarHeight * 0.7, justifyContent: 'flex-start' }]}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                {headerView}
                <KeyboardAwareScrollView
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white}>
                        {CommonWidgets.renderLargeSpacer()}
                        {CommonWidgets.renderSmallSpacer()}
                        <View style={styles.subView}>
                            <Text style={styles.headerText}>{I18n.t('MY_WORKS')}</Text>
                            <View style={styles.workImageContainer}>
                                {CommonWidgets.renderImageView({uri: this.state.workImages[0]})}
                                {CommonWidgets.renderImageView({uri: this.state.workImages[1]})}
                                {CommonWidgets.renderImageView({uri: this.state.workImages[2]})}
                            </View>
                            <View style={styles.workImageContainer}>
                                {CommonWidgets.renderImageView({uri: this.state.workImages[3]})}
                                {CommonWidgets.renderImageView({uri: this.state.workImages[4]})}
                                {CommonWidgets.renderImageView({uri: this.state.workImages[5]})}
                            </View>
                            {CommonWidgets.renderBigSpacer()}
                            <View style={Styles.rowSpace}>
                                <Text style={styles.headerText}>
                                    {I18n.t('ABOUT_ME')}
                                </Text>
                            </View>
                            {CommonWidgets.renderSmallSpacer()}
                            <Text style={styles.aboutText}>
                                {this.state.freelancer.about}
                            </Text>
                            {CommonWidgets.renderBigSpacer()}
                            <View style={Styles.rowSpace}>
                                <Text style={styles.headerText}>
                                    {I18n.t('MY_OFFER')}
                                </Text>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            {this.state.offers.map((item, index) => (
                                <View key={item.id} style={styles.skillView}>
                                    <View style={{ flex: 0.3, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={[styles.aboutText, { width: '95%' }]}>
                                            {Global.categories[item.category_id - 1].name + ' '}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 0.3, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={[styles.aboutText, {width: '95%'}]}>
                                            {Global.categories[item.category_id - 1].subCategory[item.sub_category_id - 1].name + ' '}
                                        </Text>
                                    </View>
                                    <Text style={[styles.aboutText, { flex: 0.2}]}>
                                        {item.price + '€'}
                                    </Text>
                                    <TouchableOpacity style={[Styles.center, {flex: 0.15}]} onPress={() => this.showActionSheetMenu(index)}>
                                        <View style={styles.numberView}>
                                            <Text style={[styles.aboutText, {flex: 3, textAlign: 'center'}]}>
                                                {item.amount ? (item.amount + '') : '0'}
                                            </Text>
                                             <View style={{backgroundColor: 'transparent', height: 12, flex: 1}}> 
                                                <Icon name={'md-arrow-dropdown'} size={12} style={{flex: 1}}/>
                                             </View> 
                                        </View>
                                    </TouchableOpacity>
                                </View>)
                            )}
                            {CommonWidgets.renderSpacer()}
                            <View style={styles.underline}/>
                            {CommonWidgets.renderSmallSpacer()}
                            <View style={styles.skillView}>
                                <View style={{ width: Metrics.screenWidth * 0.3, alignItems: 'flex-start' }}>
                                    <Text style={[styles.aboutText, { width: Metrics.screenWidth * 0.3 }]}>{I18n.t('TOTAL') + ' '}</Text>
                                </View>
                                <Text style={styles.aboutText}>{this.total + ',-€ '}</Text>
                            </View>
                        </View>

                        {CommonWidgets.renderBigSpacer()}
                        <View style={styles.subView}>
                            <Text style={styles.headerText}>
                                {I18n.t('DATE&TIME')}
                            </Text>
                        </View>
                        {CommonWidgets.renderSpacer()}

                        <View style={styles.bottomContainer}>
                            {CommonWidgets.renderSmallSpacer()}
                            {CommonWidgets.renderCalendar(this.state.curDate, 0.65, (date) => this.onDateChange(date))}
                            {CommonWidgets.renderBigSpacer()}
                            <Text style={styles.dateText}>
                                {Moment(this.state.curDate).format('DD. MMM YYYY')}
                            </Text>
                            {CommonWidgets.renderSpacer()}
                            <HourToggleView
                                navigator={this.props.navigator}
                                hour={this.state.dayhour}
                                selectedHour={this.state.selectedHour}
                                onPress={(index) => this.onTimeChange(index)}/>
                            {CommonWidgets.renderSmallSpacer()}
                        </View>
                        <View style={{padding: Metrics.screenWidth / 10}}>
                            {this.state.ratings.map(item => (
                                <View key={item.id}>
                                    <Image
                                        source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}
                                        style={styles.reviewImage}/>
                                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                        <StarRating
                                            disabled
                                            starColor={'black'}
                                            buttonStyle={{ marginLeft: 3 }}
                                            maxStars={5}
                                            starSize={11}
                                            rating={item.score}/>
                                        <Text style={styles.reviewRateText}>{item.score}</Text>
                                    </View>
                                    {CommonWidgets.renderSmallSpacer()}
                                    <Text>
                                        {'"' + item.feedback + '"'}
                                    </Text>
                                    {CommonWidgets.renderBigSpacer()}
                                </View>)
                            )}
                            {this.state.ratePageNo * Global.pageSize < this.state.totalCount &&
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontFamily: Fonts.type.italic}}>{I18n.t('SHOW_MORE') + ' '}</Text>
                                <TouchableOpacity style={{ width: 50 }} onPress={() => this.doGetRatingData()}>
                                    <Icon name='md-arrow-dropdown' size={22} style={{ marginLeft: 5}}/>
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <CardView style={[Styles.circleButtonShadow, {alignItems: 'center'}]}
                                  cardElevation={5}
                                  cardMaxElevation={5}
                                  cornerRadius={5}>
                            {CommonWidgets.renderSpacer()}
                            <View style={Styles.rowSpace}>
                                <View style={{flex: 1.2, alignItems: 'center'}}>
                                    <Image
                                        style={[styles.logoImage, { borderColor: Colors.textPrimary }]}
                                        source={this.state.freelancer.avatar_url ? {uri: this.state.freelancer.avatar_url} : Images.imgAvatarPlaceholder}/>
                                </View>
                                <View style={{flex: 2.3, alignItems: 'flex-end'}}>
                                    <Text style={styles.infoText}>
                                        {Moment(this.state.curDate).format('DD. MMM YYYY, ') +
                                        (this.state.selectedHour >= 0 ? (this.state.selectedHour + ':00 ') : '')}
                                    </Text>
                                    <Text style={styles.infoText}>{this.state.address + ' '}</Text>
                                    <Text style={styles.infoText}>{this.total + ', -€ '}</Text>
                                </View>
                                <View style={{flex: 0.25}}/>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            {CommonWidgets.renderMaterialButton(
                                I18n.t('SEND_REQUEST'), Colors.textThird,() => this.onSendRequest())}
                            {CommonWidgets.renderBigSpacer()}
                        </CardView>
                        {CommonWidgets.renderLargeSpacer()}
                    </View>
                </KeyboardAwareScrollView>
                {imageAvatar}
                <OfferSentModalView
                    navigator={this.props.navigator}
                    onNext={() => this.onGotoHome()}
                    dialogVisible = {this.state.isPending}
                />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={countMenu}
                    cancelButtonIndex={0}
                    onPress={this.onActionSheetItemSelected.bind(this)}
                    tintColor={Colors.textSecondary}
                />
            </View>
        );
    }
}
BookingMain.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        getFreelancerAttempt: params => dispatch(getFreelancerAttempt(params)),
        getRatingsAttempt: params => dispatch(getRatingsAttempt(params)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    const response1 = state.get('get_freelancer');
    const response2 = state.get('get_ratings');
    return { globals, response1, response2 };
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingMain);
