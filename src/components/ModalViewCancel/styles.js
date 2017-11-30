import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  mainContainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.modalBackground,
  },
  titleText: {
    width: Metrics.screenWidth * 0.7,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.type.italic,
    fontSize: Fonts.size.h2,
  },
  warningText: {
    width: Metrics.screenWidth * 0.7,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h6,
  },
});
