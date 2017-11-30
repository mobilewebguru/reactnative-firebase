import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts, Styles } from '@theme/';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: Metrics.screenWidth * 0.1,
    top: Metrics.screenHeight * 0.15,
  },
  mainBtnStyle: {
    ...Styles.center,
    width: Metrics.screenWidth * 0.8,
    height: Metrics.screenHeight * 0.07,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  mainBtnText: {
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h5,
    marginTop: 3,
    marginRight: 20,
  },
  pointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.black,
    marginVertical: 3,
  },
  skillBtn: {
    ...Styles.rowSpace,
    backgroundColor: Colors.black,
    width: Metrics.screenWidth * 0.8,
    height: Metrics.screenHeight * 0.08,
    borderRadius: Metrics.screenWidth * 0.4,
    paddingHorizontal: 30,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  skillText: {
    fontFamily: Fonts.type.light,
    fontSize: Fonts.size.h4,
    color: Colors.white,
  },
  skillBtnIcon: {
    width: 15,
    height: 20,
    resizeMode: 'contain',
  },
  roundIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
  },
});
