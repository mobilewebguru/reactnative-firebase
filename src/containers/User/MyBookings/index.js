import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Calendar from '@components/Calendar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import OneSignal from 'react-native-onesignal';
import Moment from 'moment';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { popRoute, replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setBookings } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class MyBookings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dates1: [],//pending
            dates2: [],//accepted
            selectedDate: Moment().format(),
            bookingHistory: [],
            totalCount: 0,
            ratePageNo: 0,
        };
    }

    componentDidMount() {
        console.log('MyBookings component mounted');
        OneSignal.addEventListener('received', (notification) => this.onReceived(notification));
        setTimeout(() => {
            this.doGetBookings();
            this.doGetBookingHistory()
        }, Global.mountTimeout);
    }

    componentWillReceiveProps(nextProps) {
        console.log("MyBookings received nextProps.");
        if (this.props.globals.bookings !== nextProps.globals.bookings) {
            this.setDates(nextProps.globals.bookings);
        }
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', (notification) => this.onReceived(notification));
    }

    onReceived(notification) {
        let booking = notification.payload.additionalData;
        if (booking) {
            let tmp = Utils.clone(this.props.globals.bookings);
            let index = 0;
            for (let i = 0; i < tmp.length; i ++) {
                if (tmp[i].id === booking.id) {
                    index = i;
                    break;
                }
            }
            if (booking.status === Constants.jobStatus.Accepted) {
                tmp[index].status = Constants.jobStatus.Accepted;
            } else {
                tmp.splice(index, 1);
            }
            this.props.setBookings(tmp);
        }
    };

    setDates(jobs) {
        let tmp1 = [], tmp2 = [];
        jobs.forEach(job => {
            let date = Moment(job.book_time).format('YYYY-MM-DD');
            if (job.status < Constants.jobStatus.Accepted && !tmp1.includes(date)) {
                tmp1.push(date);
            }
        });
        jobs.forEach(job => {
            let date = Moment(job.book_time).format('YYYY-MM-DD');
            if (job.status === 2 && !tmp1.includes(date) && !tmp2.includes(date)) {
                tmp2.push(date);
            }
        });
        console.log('offers for date', tmp1, tmp2);
        this.setState({dates1: tmp1, dates2: tmp2});
    }

    doGetBookings() {
        let isOK;
        fetch(Global.API_URL + '/get_bookings', {
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
                this.props.setBookings(responseData.bookings);
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

    doGetBookingHistory() {
        let isOK;
        fetch(Global.API_URL + '/get_history', {
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
                let tmp = this.state.bookingHistory;
                responseData.jobs.forEach(item => {
                    tmp.push(item);
                });
                this.setState({bookingHistory: tmp, totalCount: responseData.count});
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

    onDateSelect(date) {
        let formattedDate = Moment(date).format('YYYY-MM-DD');
        if (this.state.dates1.includes(formattedDate) || this.state.dates2.includes(formattedDate)) {
            this.props.navigator.push({
                id: 'bookinglist',
                passProps: {
                    date: formattedDate
                },
            });
        } else {
            Utils.toast(I18n.t('NO_BOOKINGS') + ' ' + Moment(date).format('D. MMM YYYY'));
        }
    }

    onGotoBookingMain(item) {
        item.id = item.user_id;
        this.props.navigator.push({
            id: 'bookingmain',
            passProps: {
                freelancer: item,
            },
        });
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}
            >
                <Icon name={'md-menu'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('MYBOOKINGS'),
            style: Styles.navBarTitle,
        };
        const customStyle = {
            hasEventCircle: {
                backgroundColor: Colors.brandSecondary,
            },
            hasEventACircle: {
                backgroundColor: Colors.black,
            },
            currentDayCircle: {
                backgroundColor: Colors.brandPrimary,
            },
            selectedDayCircle: {
                backgroundColor: Colors.brandPrimary,
            },
            hasEventText: {
                color: Colors.white,
            }
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
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View style={styles.containerStyle}>
                        <Calendar
                            ref="calendar"
                            eventDates={this.state.dates1}
                            eventADates={this.state.dates2}
                            customStyle={customStyle}
                            showControls
                            dayHeadings={Constants.customDayHeadings}
                            monthNames={Constants.customMonthNames}
                            titleFormat={'MMMM'}
                            onDateSelect={(date) => this.onDateSelect(date)}
                        />
                        {CommonWidgets.renderBigSpacer()}
                        <View>
                            <View style={styles.markingView}>
                                <View style={[styles.circleView, {backgroundColor: Colors.black}]}/>
                                <Text style={styles.markingText}>{I18n.t('ACCEPTED_BOOKINGS')}</Text>
                            </View>
                            {CommonWidgets.renderSmallSpacer()}
                            <View style={styles.markingView}>
                                <View style={[styles.circleView, {backgroundColor: Colors.brandSecondary}]}/>
                                <Text style={styles.markingText}>{I18n.t('PENDING_BOOKINGS')}</Text>
                            </View>
                        </View>
                        {CommonWidgets.renderLargeSpacer()}
                        <Text style={styles.bookingHistoryText}>{I18n.t('BOOKING_HISTORY')}</Text>
                        {CommonWidgets.renderSmallSpacer()}
                        {this.state.bookingHistory.map(item => (
                            (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.requestView, { borderColor: Colors.textPrimary }]}
                                    onPress={() => this.onGotoBookingMain(item)}>
                                    <View style={{flex: 1}}/>
                                    <View style={[Styles.rowSpace, {flex: 5}]}>
                                        <View style={Styles.rowSpace}>
                                            <Image
                                                style={styles.avatarImage}
                                                source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}/>
                                            <View style={{marginLeft: 10}}>
                                                <Text style={styles.nameText}>
                                                    {item.first_name + ' ' + item.last_name}
                                                </Text>
                                                <Text style={styles.dateText}>
                                                    {Utils.revertFromUTC(item.book_time).format('HH:mm, D. MMMM YYYY')}
                                                </Text>
                                            </View>
                                        </View>
                                        <StarRating
                                            disabled
                                            starColor={'white'}
                                            buttonStyle={{ marginRight: 3}}
                                            maxStars={5}
                                            starSize={11}
                                            rating={item.score}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </TouchableOpacity>
                            )
                        ))}
                        {CommonWidgets.renderSpacer()}
                        {this.state.ratePageNo * Global.pageSize < this.state.totalCount &&
                        <View style={styles.headerRow}>
                            <Text style={styles.headerText}>{I18n.t('SHOW_MORE') + ' '}</Text>
                            <TouchableOpacity style={{ width: 50 }} onPress={() => this.doGetBookingHistory()}>
                                <Icon name='md-arrow-dropdown' size={22} style={{ marginLeft: 5}}/>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    {CommonWidgets.renderBigSpacer()}
                    {CommonWidgets.renderBigSpacer()}
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
MyBookings.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
    openDrawer: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        replaceRoute: route => dispatch(replaceRoute(route)),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setBookings: bookings => dispatch(setBookings(bookings)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyBookings);
