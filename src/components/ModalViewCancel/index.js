/**
 * this modal is for freelancer only
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors, Styles, Fonts, Metrics, Images } from '@theme/';
import CommonWidgets from '@components/CommonWidgets';
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

export default class ModalView extends React.Component {
  render() {
    if (!this.props.dialogVisible)
      return <View/>;
    return (
      <View style={[Styles.center, styles.mainContainer]}>
        <View style={{ flex: 2}}/>
        <View style={{ ...Styles.center, flex: 4 }}>
          <Text style={styles.titleText}>
              {I18n.t('OFFER_DECLINE_CONFIRM_DESCRIPTION') + ' ' + this.props.username + '? '}
          </Text>
        </View>
        <View style={{ flex: 1.5 }}>
          {/*<Text style={styles.warningText}>*/}
            {/*The number of cancelled jobs will be displayed on your profile. Keep the number low if you  want to keep a good rating.*/}
          {/*</Text>*/}
        </View>
        <View style={{ flex: 2.5 }}>
          {CommonWidgets.renderSwipeButton('Confirm', Colors.textPrimary, Colors.white, () => this.props.onAccept())}
          {CommonWidgets.renderSmallSpacer()}
          {CommonWidgets.renderSwipeButton('Cancel', Colors.white, Colors.textPrimary, () => this.props.onClose())}
        </View>
      </View>
    );
  }
}
