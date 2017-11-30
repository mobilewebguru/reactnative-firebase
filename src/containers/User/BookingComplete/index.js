import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { pushNewRoute, popRoute, replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import styles from './styles';

class BookingComplete extends Component {
    constructor(props) {
        super(props);
    }
    onComplete() {
        this.props.pushNewRoute('bookingrate');
    }
    onComplain() {
        this.props.pushNewRoute('bookingrate');
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
        const imageAvatar = (
            <View style={styles.avatarContainer}>
                <Image
                    resizeMode={'stretch'}
                    style={styles.imgAvatar}
                    source={{ uri: 'https://s17.postimg.org/nnar4n263/images3.jpg' }} />
            </View>
        );
        return (
            <View style={[Styles.fullScreen, { backgroundColor: Colors.black }]}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={[Styles.navBarStyle, { height: Metrics.navBarHeight * 0.7, justifyContent: 'flex-start' }]}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                {imageAvatar}
                <Text style={styles.nameStyle}>
                    Martin
                </Text>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateStyle}>
                        16:30Uhr 3. April 2017
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    {CommonWidgets.renderSwipeButton(
                        'Swipe to complete', Colors.textPrimary, Colors.white, () => this.onComplete())}
                    {CommonWidgets.renderSpacer()}
                    {CommonWidgets.renderSwipeButton(
                        'Swipe to complain', Colors.textPrimary, Colors.white, () => this.onComplain())}
                </View>
            </View>
        );
    }
}
BookingComplete.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    pushNewRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        replaceRoute: route => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingComplete);
