import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import Moment from 'moment';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import Timer from '@components/CountDownTimer';
import TimeLabel from '@components/CountDownTimer/TimeLabel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { popRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setBookings } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

class BookingList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingsForDate: [],
            selectedItem: null,
        };
    }

    componentDidMount() {
        console.log('BookingList component mounted');
        let tmp = [];
        this.props.globals.bookings.forEach(job => {
            if (Moment(job.book_time).format('YYYY-MM-DD') === this.props.date) {
                tmp.push(job);
            }
        });
        this.setState({bookingsForDate: tmp});
    }

    onBookingDetail(item) {
        if (item === null) return;
        this.props.navigator.push({
            id: 'bookingdetail',
            passProps: {
                booking: item,
            },
        });
    }

    onExpired(index) {
        const tmp1 = Utils.clone(this.state.bookingsForDate);
        tmp1.splice(index, 1);

        const tmp2 = Utils.clone(this.props.globals.bookings);
        const index2 = tmp2.indexOf(tmp1[index]);
        tmp2.splice(index2, 1);

        this.setState({bookingsForDate: tmp1});
        this.props.setBookings(tmp2);
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );

        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                <KeyboardAwareScrollView
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white} style={styles.container}>
                        <Text style={styles.dateText}>{Moment(this.props.date).format('D. MMMM YYYY')}</Text>
                        { this.state.bookingsForDate.length > 0 ?
                            this.state.bookingsForDate.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.requestView, { borderColor: item.status === Constants.jobStatus.Accepted ? Colors.black : Colors.textPrimary }]}
                                    onPress={() => this.onBookingDetail(item)}>
                                    <View style={[Styles.rowSpace, {flex: 1, justifyContent: 'center'}]}>
                                        <Image
                                            style={styles.avatarImage}
                                            source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}/>
                                    </View>
                                    <View style={{flex: 0.2}}/>
                                    <View style={{flex: 2.3}}>
                                        <Text style={styles.hourText}>
                                            {Utils.revertFromUTC(item.book_time).format('YYYY-MM-DD HH:mm')}
                                        </Text>
                                    </View>
                                    <View style={[Styles.center, {flex: 1.5}]}>
                                        { item.status < Constants.jobStatus.Accepted ?
                                            <Timer
                                                till={new Date(Utils.revertFromUTC(item.request_time, 30).format('MM/DD/YYYY HH:mm:ss'))}
                                                renderTick={(data) =>
                                                    <TimeLabel
                                                        style={styles.timeText}
                                                        {...data}
                                                    />}
                                                onTick={null}
                                                onFinish={() => this.onExpired(index)}
                                            />
                                            :
                                            <Text style={styles.priceText}>
                                                {I18n.t('CONFIRMED')}
                                            </Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                            ))
                            :
                            <View style={{marginTop: 50}}>
                                <Text style={{fontFamily: Fonts.type.semibold, fontSize: Fonts.size.h4, color: Colors.textSecondary}}>
                                    {I18n.t('NO_BOOKINGS') + ' ' + Moment(this.props.date).format('D. MMM YYYY')}
                                </Text>
                            </View>
                        }
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
BookingList.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setBookings: bookings => dispatch(setBookings(bookings)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingList);
