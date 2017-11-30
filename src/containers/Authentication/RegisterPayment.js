import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';

import { pushNewRoute, popRoute } from '@actions/route';
import CommonWidgets from '@components/CommonWidgets';
import { Styles, Images, Icons, Colors, Fonts } from '@theme/';
import styles from './styles';

class RegisterPayment extends Component {
  doRegisterPayWay() {
    this.props.pushNewRoute('registercredit')
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
              {I18n.t('PAYMENT_INFORMATION')}
            </Text>
          </View>
          <View style={styles.button} onPress={() => this.doRegister()}>
            <Text style={[Fonts.style.h5, { color: Colors.textPrimary }]}>
              {I18n.t('CREDIT_CARD')}
            </Text>
          </View>
          {CommonWidgets.renderMaterialButton(I18n.t('CONTINUE'),
            Colors.black, () => this.doRegisterPayWay())}
          {CommonWidgets.renderBackButton(() => this.props.popRoute())}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

RegisterPayment.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
  };
}
function mapStateToProps(state) {
  return { };
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPayment);
