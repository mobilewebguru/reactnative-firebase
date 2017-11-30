import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  containerStyle: {
    ...Styles.center,
    paddingTop: Metrics.screenHeight * 0.1,
  },
  activeAvatar: {
    width: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
    height: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
    borderRadius: Platform.OS === 'ios' ? Metrics.screenWidth / 26 : Metrics.screenWidth / 22,
    // borderWidth: 2,
    // borderColor: Colors.brandPrimary,
  },
  activeText: {
    color: Colors.brandPrimary,
    fontSize: Fonts.size.mini,
    fontFamily: Fonts.type.regular,
  },
  calendarStyle: {
  },
  calendarBar: {
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h5,
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  daySelectedText: {
    backgroundColor: Colors.brandPrimary,
    borderWidth: 0,
  },
  dayHeaderView: {
    height: Metrics.screenHeight / 15,
    borderBottomColor: '#FFFFFF',
  },
  dayHeaderText: {
    fontFamily: Fonts.type.regular,
    color: Colors.textThird,
    paddingHorizontal: 5,
  },
  dayRowView: {
    borderColor: '#FFFFFF',
    height: 40,
  },
});
