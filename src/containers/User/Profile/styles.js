import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    imgAvatar: {
        width: Metrics.logoSize,
        height: Metrics.logoSize,
        borderRadius: Metrics.logoSize / 2,
        resizeMode: 'cover',
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerText: {
        fontFamily: Fonts.type.italic,
    },
    nameText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h3,
        color: Colors.black,
    },
    subContainer: {
        padding: Metrics.screenWidth / 10,
        paddingTop: 20,
        alignItems: 'center'
    },
    itemContainer: {
        width: Metrics.screenWidth * 0.8,
        height: Metrics.screenHeight / 12,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: Colors.brandSecondary,
        borderWidth: 1,
    },
    phoneText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        color: Colors.black,
    },
    editText: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 40,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        borderWidth: 1,
        borderColor: Colors.brandSecondary,
        color: Colors.black,
    },
    buttonText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
        color: Colors.textThird,
        marginRight: 10
    },
    reviewImage: {
        width: Metrics.screenWidth / 10,
        height: Metrics.screenWidth / 10,
        borderRadius: Metrics.screenWidth / 20,
    },
    reviewRateText: {
        fontFamily: Fonts.type.regular,
        marginLeft: 5,
    },
    dateText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        color: Colors.textThird,
    },
    logoutText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
        color: Colors.textPrimary,
    }
});
