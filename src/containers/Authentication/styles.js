import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    bodyContainer: {
        ...Styles.center,
    },
    imgAvatar: {
        width: Metrics.logoSize - 20,
        height: Metrics.logoSize - 20,
        borderRadius: (Metrics.logoSize - 20) / 2,
    },
    textInputStyle: {
        ...Fonts.style.textInput,
        width: Metrics.buttonWidth - 20,
        height: Metrics.buttonHeight,
        alignSelf: 'center',
        textAlign: 'left',
        color: Colors.textPrimary,
    },
    forgotTextStyle: {
        width: Metrics.buttonWidth,
        alignSelf: 'center',
        textAlign: 'center',
        color: Colors.textPrimary,
        letterSpacing: 1,
        includeFontPadding: true,
    },
    textInputContainerStyle: {
        width: Metrics.buttonWidth,
        // paddingHorizontal: 10,
    },
    forgotPwdContainer: {
        marginTop: 25,
        marginBottom: 20,
        padding: 0,
        width: Metrics.buttonWidth,
        alignItems: 'center',
    },
    orContainer: {
        paddingVertical: 5,
        alignItems: 'center',
    },
    bottomAreaLogin: {
        ...Styles.center,
        justifyContent: 'flex-start',
        height: Metrics.screenHeight / 10,
    },
    bottomAreaRegister: {
        ...Styles.center,
        flexDirection: 'column',
        height: Metrics.screenHeight / 10,
    },
    button: {
        ...Styles.button,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.borderFocused,
    },
    registerDoneContainer: {
        flex: 1,
        backgroundColor: Colors.black
    },
    registerDoneContainer1: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Metrics.screenHeight * 0.15,
    },
    registerMark: {
        width: Metrics.logoSize * 0.8,
        height: Metrics.logoSize * 0.8,
    },
    registerText: {
        color: 'white',
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
    },
    addIconContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'transparent',
    },
    addIconStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    registerPayContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Metrics.screenHeight / 10
    },
    cardInputStyle: {
        width: Metrics.screenWidth / 6.5,
        height: Platform.OS === 'ios' ? Metrics.screenHeight / 20 : Metrics.screenHeight / 16,
        textAlign: 'center',
        borderColor: Colors.brandSecondary,
        borderRadius: 5,
        borderWidth: 1,
        paddingTop: 3,
    }
});
