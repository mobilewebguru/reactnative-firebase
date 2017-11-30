import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';

import { replaceRoute, popRoute } from '@actions/route';
import CommonWidgets from '@components/CommonWidgets';
import { Metrics, Styles, Images, Icons, Colors, Fonts, Global } from '@theme/';
import styles from './styles';

class RegisterCredit extends Component {
    doSignUp() {
        this.props.replaceRoute(Global.userType === 'freelancer' ? 'registerdone' : 'findfreelancer');
    }
    render() {
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: Colors.white }}
                extraScrollHeight={0}
                automaticallyAdjustContentInsets={false}>
                <View style={[Styles.fullScreen, styles.registerPayContainer]}>
                    {CommonWidgets.renderStatusBar('transparent')}
                    <View>
                        {CommonWidgets.renderSpacer()}
                        <Text style={Fonts.style.h4}>
                            {I18n.t('CREDIT_CARD_PAYMENT')}
                        </Text>
                    </View>
                    <View style={Styles.center}>
                        <Text style={Fonts.style.h5}>
                            {I18n.t('CREDIT_CARD_NUMBER')}
                        </Text>
                        {CommonWidgets.renderSpacer()}
                        <View style={[Styles.rowSpace, { width: Metrics.screenWidth * 0.7 }]}>
                            <TextInput
                                style={styles.cardInputStyle}
                                maxLength={1}
                                underlineColorAndroid={'transparent'}
                                multiline={false}
                                onChangeText={text => this.setState({ cardNum1: text })}
                                keyboardType={'number-pad'}
                            />
                            <TextInput
                                maxLength={1}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ cardNum2: text })}
                                keyboardType={'number-pad'}
                            />
                            <TextInput
                                maxLength={1}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ cardNum3: text })}
                                keyboardType={'number-pad'}
                            />
                            <TextInput
                                maxLength={1}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ cardNum4: text })}
                                keyboardType={'number-pad'}
                            />
                        </View>
                        {CommonWidgets.renderSpacer()}
                        <Text style={Fonts.style.h5}>
                            {I18n.t('EXPIRES')}
                        </Text>
                        {CommonWidgets.renderSpacer()}
                        <View style={[Styles.rowSpace, { width: Metrics.screenWidth * 0.35 }]}>
                            <TextInput
                                maxLength={2}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ ExpiresMonth: text })}
                                keyboardType={'number-pad'}
                            />
                            <TextInput
                                maxLength={4}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ ExpiresYear: text })}
                                keyboardType={'number-pad'}
                            />
                        </View>
                        {CommonWidgets.renderSpacer()}
                        <Text style={Fonts.style.h5}>
                            {I18n.t('SECURITY_CODE')}
                        </Text>
                        {CommonWidgets.renderSpacer()}
                        <View style={Styles.rowSpace}>
                            <TextInput
                                maxLength={4}
                                underlineColorAndroid={'transparent'}
                                style={styles.cardInputStyle}
                                multiline={false}
                                onChangeText={text => this.setState({ SecurityCode: text })}
                                keyboardType={'number-pad'}
                            />
                        </View>
                    </View>
                    {CommonWidgets.renderMaterialButton(I18n.t('CONTINUE'),
                        Colors.black, () => this.doSignUp())}
                    {CommonWidgets.renderBackButton(() => this.props.popRoute())}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

RegisterCredit.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
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
export default connect(mapStateToProps, mapDispatchToProps)(RegisterCredit);
