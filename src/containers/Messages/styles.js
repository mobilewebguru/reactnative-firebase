import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  topView: {
    width: Metrics.screenWidth,
    height: Metrics.navBarHeight * 1.4,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarContainer: {
    position: 'absolute',
    left: (Metrics.screenWidth - Metrics.logoSize) / 2,
    top: Metrics.screenHeight / 6.5,
  },
  imgAvatar: {
    width: Metrics.logoSize,
    height: Metrics.logoSize,
    borderRadius: Metrics.logoSize / 2,
    resizeMode: 'cover',
  },
  subContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: Metrics.screenHeight / 7,
  },
  chatItem: {
    width: Metrics.screenWidth * 0.8,
    height: Metrics.screenHeight * 0.1,
    borderRadius: Metrics.screenHeight * 0.05,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  avatarItem: {
    width: Metrics.screenHeight * 0.08,
    height: Metrics.screenHeight * 0.08,
    borderRadius: Metrics.screenHeight * 0.04,
  },
  itemText: {
    fontFamily: Fonts.type.regular,
    marginLeft: 20,
  }
});
