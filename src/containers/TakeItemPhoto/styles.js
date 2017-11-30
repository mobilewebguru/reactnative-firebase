import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts, Styles } from '@theme/';

const btnSize = Metrics.screenWidth / 5;

export default StyleSheet.create({
  topButtons: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  backButton: {
    ...Styles.center,
    width: 40,
    height: 40,
    position: 'absolute',
    left: 10,
    top: 30,
  },
  refreshButton: {
    ...Styles.center,
    width: 40,
    height: 40,
    position: 'absolute',
    right: 10,
    top: 30,
  },
  captureButtonContainer: {
    width: btnSize,
    height: btnSize,
    borderRadius: btnSize / 2,
    backgroundColor: 'rgba(149, 149, 149, 0.79)',
  },
  captureButton: {
    width: btnSize - 15,
    height: btnSize - 15,
    borderRadius: (btnSize - 15) / 2,
    backgroundColor: Colors.textDisabled,
  },
});
