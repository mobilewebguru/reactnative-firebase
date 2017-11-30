import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    avatarContainer: {
        ...Styles.center,
    },
    imgAvatar: {
        width: Metrics.logoSize,
        height: Metrics.logoSize,
        borderRadius: Metrics.logoSize / 2,
        resizeMode: 'cover',
    },
    nameText: {
        color: Colors.white,
        alignSelf: 'center',
    },
    dateContainer: {
        ...Styles.center,
    },
    dateStyle: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: 17,
    },
    buttonContainer: {
        ...Styles.center,
    },
    rateText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h2,
    },
    editText: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonWidth * 0.4,
        padding: 10,
        textAlignVertical: 'top',
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.brandSecondary,
        color: Colors.black,
    },
});
