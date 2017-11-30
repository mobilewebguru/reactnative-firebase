import { StyleSheet } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  nameText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.white,
    fontFamily: Fonts.type.regular,
    fontSize: Fonts.size.h4,
    marginLeft: 15,
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
