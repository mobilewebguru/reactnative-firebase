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
  registerMark: {
    width: Metrics.logoSize * 0.8,
    height: Metrics.logoSize * 0.8,
  },
});
