import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    button: {
        ...Styles.button,
        ...Styles.buttonShadow,
        shadowOpacity: 0.45,
        // borderRadius: 30,
        borderWidth: 1,
        backgroundColor: Colors.green,
        borderColor: Colors.textPrimary,
    },
});
