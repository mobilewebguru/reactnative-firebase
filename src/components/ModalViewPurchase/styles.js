import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    mainContainer: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: Colors.modalBackground,
    },
    dialogContainer: {
        width: Metrics.screenWidth / 1.5 + Metrics.screenWidth * 0.08,
        height: Metrics.screenWidth / 1.5 + Metrics.screenWidth * 0.08,
    },
    mainDialog: {
        width: Metrics.screenWidth / 1.5,
        height: Metrics.screenWidth / 1.5,
        borderRadius: 15,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: Colors.white
    },
    closeIconContainer: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 0
    },
    closeIcon: {
        width: Metrics.screenWidth * 0.08,
        height: Metrics.screenWidth * 0.08,
        borderRadius: Metrics.screenWidth * 0.04,
    },
    textTitle: {
        fontFamily: Fonts.type.semibold,
        fontSize: Fonts.size.h4,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.textSecondary,
    },
    textSubTitle: {
        flex: 1,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h6,
        // textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.textSecondary
    },
    textButtonTitle: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
        color: Colors.white,
        textAlign: 'center',
    },
    textDescription: {
        flex: 1,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.default,
        textAlign: 'center',
        color: Colors.textSecondary
    },
    button: {
        flex: 1,
        width: '50%',
        alignSelf: 'center',
        backgroundColor: Colors.buttonPurchase,
        borderRadius: 5,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
