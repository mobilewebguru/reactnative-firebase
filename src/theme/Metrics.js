import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeightTmp = width < height ? height : width;
const bottomMargin = 24;

const metrics = {
  searchBarHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: screenHeightTmp,
  navBarHeight: Platform.OS === 'ios' ? 70 : 60,
  defaultMargin: 10,
  defaultPadding: 10,
  listItemHeight: screenHeightTmp / 9,

  buttonWidth: width * 0.7,
  buttonHeight: height / 14,
  logoSize: width / 2,
  footerHeight: width / 7,
  androidMarginBottom: bottomMargin,
  sliderThumbSize: 25,
  statusBarHeight: 20,
  circleBtnSize: 50,

  iconSizeSmall: 15,
};

export default metrics;
