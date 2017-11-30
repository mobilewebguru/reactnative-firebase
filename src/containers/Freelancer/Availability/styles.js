import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  bottomContainer: {
    ...Styles.center,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: 10,
    padding: 10,
  },
  blockAllButton: {
    ...Styles.center,
    backgroundColor: Colors.black,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  blockAllText: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: Metrics.screenWidth * 0.15,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: Colors.white,
    fontFamily: Fonts.type.italic,
    fontSize: 12,
  },
  dateText: {
    fontSize: Fonts.size.h5,
    fontFamily: Fonts.type.regular,
  }
});
