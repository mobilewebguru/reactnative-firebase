import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    containerStyle: {
        ...Styles.center,
        paddingTop: Metrics.screenHeight * 0.05,
    },
    markingView: {
        flexDirection: 'row',
    },
    markingText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
    },
    circleView: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 20,
    },
    bookingHistoryText: {
        fontFamily: Fonts.type.semibold,
        fontSize: Fonts.size.h4,
    },
    requestView: {
        flexDirection: 'row',
        backgroundColor: Colors.black,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight * 0.1,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    avatarImage: {
        width: Metrics.screenHeight * 0.07,
        height: Metrics.screenHeight * 0.07,
        borderRadius: Metrics.screenHeight * 0.035,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    nameText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        marginRight: 10,
    },
    dateText: {
        color: Colors.textPrimary,
        fontFamily: Fonts.type.regular,
        fontSize: 11,
        marginRight: 10,
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerText: {
        fontFamily: Fonts.type.italic,
    },
});
