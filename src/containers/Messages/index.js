import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { pushNewRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';

class Messages extends Component {
  constructor(props) {
    super(props);
  }
  onChat(item) {
    this.props.navigator.push({
      id: 'chat',
      passProps: {
        item,
      },
    });
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
    const navBarTitleConfig = {
      title: I18n.t('MESSAGES'),
      style: Styles.navBarTitle,
    };
    const headerView = (
      <View style={styles.topView}/>
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
      <View style={Styles.fullScreen}>
        {CommonWidgets.renderStatusBar(Colors.black)}
        <NavBar
          containerStyle={Styles.navBarStyle}
          statusBar={{style: 'light-content', tintColor: Colors.black }}
          leftButton={leftButton}
          title={navBarTitleConfig}
        />
        {headerView}
        <KeyboardAwareScrollView
          backgroundColor={Colors.white}
          alwaysBounceVertical={false}>
          <View style={styles.subContainer}>
            {
              // Constants.REQUESTS.map(item => (
              //   <TouchableOpacity
              //     key={item.key}
              //     onPress={() => this.onChat(item)}
              //     style={styles.chatItem}>
              //     <Image
              //       style={styles.avatarItem}
              //       source={{ uri: item.avatar }}/>
              //     <View>
              //       <Text style={styles.itemText}>{item.date}</Text>
              //       <Text style={styles.itemText}>{item.time}Uhr</Text>
              //     </View>
              //   </TouchableOpacity>
              // ))
            }
          </View>
        </KeyboardAwareScrollView>
        {imageAvatar}
      </View>
    );
  }
}
Messages.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    openDrawer: () => dispatch(openDrawer()),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Messages);
