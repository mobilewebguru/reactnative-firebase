import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  registerText: {
    color: 'white',
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h5,
  },
  button: {
    ...Styles.button,
    ...Styles.buttonShadow,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.borderFocused,
  },
});
