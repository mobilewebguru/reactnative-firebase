import React, { Component } from 'react';
import { Text, TextInput, Image, View, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import store from 'react-native-simple-store';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { replaceRoute, popRoute } from '@actions/route';
import CommonWidgets from '@components/CommonWidgets';
import { Metrics, Styles, Images, Colors, Fonts } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

class OfferActive extends Component {
    render() {
        return (
            <View style={[Styles.fullScreen, Styles.center, styles.container]}>
                {CommonWidgets.renderStatusBar('transparent')}
                <View style={[Styles.center, { flex: 6 }]}>
                    <Text style={[styles.registerText, { textAlign: 'center' }]}>
                        {I18n.t('ACTIVE_PROFILE_DESCRIPTION1')}{"\n"}
                        {I18n.t('ACTIVE_PROFILE_DESCRIPTION2')}{"\n"}
                        {I18n.t('ACTIVE_PROFILE_DESCRIPTION3')}
                    </Text>
                </View>
                <View style={[Styles.center, { flex: 4 }]}>
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: Colors.white}]}
                        onPress={() => this.props.popRoute()}>
                        <Text style={[Fonts.style.h5, { color: Colors.black }]}>
                            {I18n.t('OK')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

OfferActive.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        replaceRoute: route => dispatch(replaceRoute(route)),
    };
}
function mapStateToProps(state) {
    return { };
}
export default connect(mapStateToProps, mapDispatchToProps)(OfferActive);
