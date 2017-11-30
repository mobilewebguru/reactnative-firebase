import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  avatarContainer: {
    ...Styles.center,
    flex: 3,
  },
  imgAvatar: {
    width: Metrics.logoSize,
    height: Metrics.logoSize,
    borderRadius: Metrics.logoSize / 2,
    resizeMode: 'cover',
  },
  nameStyle: {
    color: Colors.white,
    alignSelf: 'center',
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h3,
  },
  dateContainer: {
    ...Styles.center,
    flex: 2,
  },
  dateStyle: {
    color: Colors.white,
    fontFamily: Fonts.type.regular,
    fontSize: 17,
  },
  buttonContainer: {
    ...Styles.center,
    flex: 4,
  },
});
