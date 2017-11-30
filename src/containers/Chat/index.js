import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import ActionSheet from '@components/ActionSheet/';
import Communications from 'react-native-communications';

import {GiftedChat, Actions, Bubble, MessageText} from 'react-native-gifted-chat';

import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { popRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';
import Global from "../../theme/Global";

const chatMenu = [
  { id: 0, label: I18n.t('CANCEL') },
  { id: 1, label: I18n.t('REPORT') },
  { id: 2, label: I18n.t('BLOCK') },
];

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }
  renderHeader(title) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          placeholder={Images.imgAvatarPlaceholder}
          source={{ uri: this.props.item.avatar }}
          style={{ width: Metrics.screenWidth * 0.1, height: Metrics.screenWidth * 0.1, borderRadius: Metrics.screenWidth * 0.05}}
        />
        <Text style={styles.nameText}>
          {this.props.item.name}
        </Text>
      </View>
    );
  }
  /////////////////////////////// chat functions ///////////////////////////////////////////////
  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: require('./messages.js'),
      };
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });
    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answerDemo(messages);
  }
  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }
    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }
      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }
  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }
  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: { color: '#41474f', fontFamily: Fonts.type.regular, lineHeight: 22 },
          right: { color: 'white', fontFamily: Fonts.type.regular, lineHeight: 22 },
        }}
        linkStyle={{
          left: { color: '#41474f' },
          right: { color: 'white' },
        }}
      />
    );
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.white,
            borderColor: Colors.textPrimary,
            borderRadius: 20,
            borderWidth: 1
          },
          right: {
            backgroundColor: Colors.textPrimary,
            borderRadius: 20,
          }
        }}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }
///////////////////////////////////chat function end//////////////////////////////////////////////////
  onActionSheetMenu(index) {
    if (index === 1) {
      Communications.email(['beauty@gamperl.com'], null, null, I18n.t('REPORT'), 'My body text');
    } else if (index === 2) {
      setTimeout(() => {
        Alert.alert(
          '',
          I18n.t('BLOCK_ALERT'),
          [
            { text: I18n.t('NO'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: I18n.t('YES'), onPress: () => alert('Block...') },
          ]);
      }, Global.animationTimeout);
    }
  }
  showActionSheetMenu() {
    this.ActionSheet.show();
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
    const rightButton = (
      <TouchableOpacity
        style={[Styles.center, Styles.navBarIcon]}
        onPress={() => this.showActionSheetMenu()}
      >
        <Icon name={'md-more'} size={25} style={{ color: Colors.white}}/>
      </TouchableOpacity>
    );
    return (
      <View style={Styles.fullScreen}>
        {CommonWidgets.renderStatusBar(Colors.black)}
        <NavBar
          containerStyle={Styles.navBarStyle}
          statusBar={{style: 'light-content', tintColor: Colors.black }}
          leftButton={leftButton}
          rightButton={rightButton}
          title={this.renderHeader()}
        />
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            user={{
              _id: 1, // sent messages should have same user._id
            }}
            renderBubble={this.renderBubble}
            renderMessageText={this.renderMessageText}
            renderFooter={this.renderFooter}
          />
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={chatMenu}
          cancelButtonIndex={0}
          onPress={this.onActionSheetMenu.bind(this)}
          tintColor={Colors.textSecondary}
        />
      </View>
    );
  }
}
Chat.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  setSpinnerVisible: React.PropTypes.func.isRequired,
};
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
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
