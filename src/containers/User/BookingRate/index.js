import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import Utils from '@src/utils';
import styles from './styles';

class BookingRate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starRating: 0,
            feedback: '',
        }
    }

    onStarRating(rating) {
        this.setState({ starRating: rating });
    }

    onSubmit() {
        if (this.state.starRating === 0) {
            Utils.toast(I18n.t('PLEASE_RATE'));
        } else {
            this.doSendFeedback();
        }
    }

    doSendFeedback() {
        let isOK;
        fetch(Global.API_URL + '/send_feedback', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                freelancer_id: this.props.job.user_id,
                job_id: this.props.job.id,
                score: this.state.starRating,
                feedback: this.state.feedback.trim(),
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.callback(this.props.job);
                this.props.popRoute();
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
                onPress={() => this.props.popRoute()}>
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const imageAvatar = (
            <View style={styles.avatarContainer}>
                <Image
                    resizeMode={'stretch'}
                    style={styles.imgAvatar}
                    source={this.props.job.avatar_url ? { uri: this.props.job.avatar_url } : Images.imgAvatarPlaceholder} />
            </View>
        );
        return (
            <KeyboardAwareScrollView
                style={{backgroundColor: Colors.black}}
                alwaysBounceVertical={false}>
                <View>
                    {CommonWidgets.renderStatusBar(Colors.black)}
                    <NavBar
                        containerStyle={[Styles.navBarStyle, { height: Metrics.navBarHeight * 0.7, justifyContent: 'flex-start' }]}
                        statusBar={{style: 'light-content', tintColor: Colors.black }}
                        leftButton={leftButton}
                    />
                    <View style={Styles.center}>
                        {CommonWidgets.renderSpacer()}
                        {imageAvatar}
                        {CommonWidgets.renderSpacer()}
                        <Text style={[Fonts.style.h3, styles.nameText]}>
                            {this.props.job.first_name + ' ' + this.props.job.last_name}
                        </Text>
                        {CommonWidgets.renderBigSpacer()}
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateStyle}>
                                {I18n.t('THANK')}
                            </Text>
                        </View>
                        {CommonWidgets.renderBigSpacer()}
                        <View style={styles.buttonContainer}>
                            <Text style={styles.rateText}>{I18n.t('PLEASE_RATE')}</Text>
                            {CommonWidgets.renderSpacer()}
                            <StarRating
                                starColor={'white'}
                                buttonStyle={{ marginLeft: 10}}
                                maxStars={5}
                                starSize={45}
                                rating={this.state.starRating}
                                selectedStar={(rating) => this.onStarRating(rating)}/>
                            {CommonWidgets.renderSpacer()}
                            <TextInput
                                style={styles.editText}
                                underlineColorAndroid={'transparent'}
                                multiline={true}
                                placeholder={I18n.t('TYPE_STH')}
                                returnKeyType={'done'}
                                onChangeText={(text) => this.setState({feedback: text})}
                            />
                            {CommonWidgets.renderSpacer()}
                            <TouchableOpacity
                                style={[Styles.button, Styles.buttonShadow, {borderColor: Colors.white, borderWidth: 1}]}
                                onPress={() => this.onSubmit()}>
                                <Text style={[Fonts.style.buttonText, {color: Colors.white}]}>
                                    {I18n.t('FINISH')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
BookingRate.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingRate);
