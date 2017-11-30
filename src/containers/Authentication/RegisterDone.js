import React, { Component } from 'react';
import { Text, TextInput, Image, View, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { replaceRoute } from '@actions/route';
import CommonWidgets from '@components/CommonWidgets';
import { Metrics, Styles, Images, Colors, Fonts } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

class RegisterDone extends Component {
  render() {
    return (
      <KeyboardAwareScrollView
        style={styles.registerDoneContainer}
        extraScrollHeight={0}
        automaticallyAdjustContentInsets={false}>
        <View style={[Styles.fullScreen, styles.registerDoneContainer1]}>
          {CommonWidgets.renderStatusBar('transparent')}
          <Image style={styles.registerMark} source={Images.imgRegisterDone}/>
          <Text style={styles.registerText}>
            {I18n.t('ALMOST_DONE')}
          </Text>
          <Text style={[styles.registerText, { textAlign: 'center' }]}>
            {I18n.t('ALMOST_DONE_DESCRIPTION1')}{"\n"}
            {I18n.t('ALMOST_DONE_DESCRIPTION2')}{"\n"}
            {I18n.t('ALMOST_DONE_DESCRIPTION3')}{"\n"}
            {I18n.t('ALMOST_DONE_DESCRIPTION4')}
          </Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: Colors.white}]}
            onPress={() => this.props.replaceRoute('profile')}>
            <Text style={[Fonts.style.h5, { color: Colors.black }]}>
              {I18n.t('CONTINUE_TO_PROFILE')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

RegisterDone.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
  };
}
function mapStateToProps(state) {
  return { };
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterDone);
