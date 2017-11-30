import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    activeAvatar: {
        width: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        height: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        borderRadius: Platform.OS === 'ios' ? Metrics.screenWidth / 26 : Metrics.screenWidth / 22,
    },
    placeHolderText: {
        fontSize: Fonts.size.h6,
        fontFamily: Fonts.type.base,
        fontWeight: 'normal',
        color: Colors.green,
        marginLeft: 0,
    },
    viewInputStyle: {
        borderBottomColor: Colors.green,
        borderBottomWidth: 1,
        width: Metrics.screenWidth * 0.8,
        alignItems: 'center',
    },
    formInputStyle: {
      width: Metrics.screenWidth * 0.8,
    },

});
