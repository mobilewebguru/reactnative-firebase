import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import update from 'react-addons-update';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import Moment from 'moment';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HourToggleView from '@components/HourToggleView';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { popRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';
class Availability extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curDate: new Date(),
            overallhour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            dayhour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
        };
        Moment.locale('en');
        this.onOverallHourClick = this.onOverallHourClick.bind(this);
    }
    onDateChange(date) {
        this.setState({ curDate: date });
    }
    onOverallHourClick(index) {
        const value = this.state.overallhour[index] === 0 ? 1 : 0;
        this.setState({
            overallhour: update(
                this.state.overallhour,
                {
                    [index] : {$set: value}
                }
            ),
        });
    }
    onDailyHourClick(index) {
        const value = this.state.dayhour[index] === 0 ? 1 : 0;
        this.setState({
            dayhour: update(
                this.state.dayhour,
                {
                    [index] :{$set: value}
                }
            ),
        });
    }
    onBlockAll() {
        let tmp = [];
        for(let index = 0; index < 24; index = index + 1) {
            tmp.push(0);
        }
        this.setState({ dayhour: tmp });
    }
    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}
            >
                <Icon
                    name={'ios-arrow-back'}
                    size={25}
                    style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('AVAILABILITY'),
            style: Styles.navBarTitle,
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
                    <View style={{ alignItems: 'center' }}>
                        {CommonWidgets.renderSpacer()}
                        <Text style={[Fonts.style.h4, {fontWeight: 'normal'}]}>
                            {I18n.t('OVERAL_BLOCKED_TIME')}
                        </Text>
                        {CommonWidgets.renderSpacer()}
                        <HourToggleView
                            navigator={this.props.navigator}
                            hour={this.state.overallhour}
                            onPress={(index) => this.onOverallHourClick(index)}/>
                        {CommonWidgets.renderBigSpacer()}
                        <View style={styles.bottomContainer}>
                            {CommonWidgets.renderCalendar(this.state.curDate, (date) => this.onDateChange(date))}
                            {CommonWidgets.renderBigSpacer()}
                            <View style={[Styles.rowSpace, { width: Metrics.screenWidth * 0.8 }]}>
                                <View style={{ width: Metrics.screenWidth * 0.1 }}/>
                                <Text style={styles.dateText}>
                                    {Moment(this.state.curDate).format('DD. MMM YYYY')}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => this.onBlockAll()}
                                    style={styles.blockAllButton}>
                                    <Text style={styles.blockAllText}>{I18n.t('BLOCK_ALL')}</Text>
                                </TouchableOpacity>
                            </View>
                            {CommonWidgets.renderSpacer()}
                            <HourToggleView
                                navigator={this.props.navigator}
                                hour={this.state.dayhour}
                                onPress={(index) => this.onDailyHourClick(index)}/>
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Availability);
