import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import OneSignal from 'react-native-onesignal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Calendar from '@components/Calendar';
import Moment from 'moment';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setJobs } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state= {
            dates1: [],//unread
            dates2: [],//read
            // selectedDate: Moment().format('YYYY-MM-DD'),
        };
    }

    componentDidMount() {
        console.log('Dashboard component mounted');
        OneSignal.addEventListener('received', (notification) => this.onReceived(notification));
        setTimeout(() => {
            this.doGetJobs();
        }, Global.mountTimeout);
    }

    componentWillReceiveProps(nextProps) {
        console.log("Dashboard received nextProps.");
        if (this.props.globals.jobs !== nextProps.globals.jobs) {
            this.setDates(nextProps.globals.jobs);
        }
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', (notification) => this.onReceived(notification));
    }

    onReceived(notification) {
        let tmp = Utils.clone(this.props.globals.jobs);
        console.log(tmp, notification.payload);
        this.props.setJobs([...tmp, notification.payload.additionalData]);
    };

    setDates(jobs) {
        let tmp1 = [], tmp2 = [];
        jobs.forEach(job => {
            let date = Moment(job.book_time).format('YYYY-MM-DD');
            if (job.status === Constants.jobStatus.Pending && !tmp1.includes(date)) {
                tmp1.push(date);
            }
        });
        jobs.forEach(job => {
            let date = Moment(job.book_time).format('YYYY-MM-DD');
            if (job.status > Constants.jobStatus.Pending && !tmp1.includes(date) && !tmp2.includes(date)) {
                tmp2.push(date);
            }
        });
        console.log('offers for date', tmp1, tmp2);
        this.setState({dates1: tmp1, dates2: tmp2});
    }

    onActive() {
        // this.props.pushNewRoute('offeractive');
    }

    onAddCrop() {
        // Global.userType = 'client';
        // this.props.replaceRoute('login');
        this.props.replaceRoute('locationproperty');

    }

    doGetJobs() {
        let isOK;
        fetch(Global.API_URL + '/get_jobs', {
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
                this.props.setJobs(responseData.jobs);
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
                id: 'requests',
                passProps: {
                    date: formattedDate
                },
            });
        } else {
            Utils.toast(I18n.t('NO_OFFERS') + ' ' + Moment(date).format('D. MMM YYYY'));
        }
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
        const rightButton = (
            <TouchableOpacity
                style={Styles.center}
                onPress={() => this.onActive()}
            >
                <Image
                    style={styles.activeAvatar}
                    source={Images.imgMarketingIcon}/>
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
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                    // rightButton={rightButton}
                    title={rightButton}
                />
                <KeyboardAwareScrollView
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View style={styles.containerStyle}>
                        {/*<Calendar*/}
                            {/*ref="calendar"*/}
                            {/*eventDates={this.state.dates1}*/}
                            {/*eventADates={this.state.dates2}*/}
                            {/*customStyle={customStyle}*/}
                            {/*showControls*/}
                            {/*dayHeadings={Constants.customDayHeadings}*/}
                            {/*monthNames={Constants.customMonthNames}*/}
                            {/*titleFormat={'MMMM'}*/}
                            {/*onDateSelect={(date) => this.onDateSelect(date)}*/}
                        {/*/>*/}
                        <Image
                            source={Images.imgCropImage}
                            resizeMode={'cover'}
                            style={[{}]}>
                        </Image>
                    </View>
                    {CommonWidgets.renderSpacer()}
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <TouchableOpacity onPress={() => this.onAddCrop()} style={{marginLeft: 100}}>
                                <Image style={styles.socialIcon} source={Icons.iconAddProperty}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.menuItemText, {flex: 1.5}]}>
                            {I18n.t('ADDCROP')}
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
Dashboard.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
    openDrawer: React.PropTypes.func.isRequired,
    pushNewRoute: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        replaceRoute: route => dispatch(replaceRoute(route)),
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setJobs: jobs => dispatch(setJobs(jobs)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
