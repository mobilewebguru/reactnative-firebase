import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    topView: {
        width: Metrics.screenWidth,
        height: Metrics.navBarHeight * 1.6,
        backgroundColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nameText: {
        color: Colors.white,
        marginTop: 0,
    },
    rateContainer: {
        flexDirection: 'row',
        width: Metrics.screenWidth,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rateText: {
        color: Colors.white,
        marginHorizontal: 10,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.default,
    },
    avatarContainer: {
        position: 'absolute',
        left: (Metrics.screenWidth - Metrics.logoSize) / 2,
        top: Platform.OS === 'ios' ? Metrics.navBarHeight * 1.7 : Metrics.navBarHeight * 1.9,
    },
    imgAvatar: {
        width: Metrics.logoSize,
        height: Metrics.logoSize,
        borderRadius: Metrics.logoSize / 2,
        resizeMode: 'cover',
    },

    acceptedImage: {
        width: Metrics.logoSize / 3,
        height: Metrics.logoSize / 3,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    acceptedText: {
        color: Colors.textAccepted,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
    },
    headerText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
        color: Colors.textThird,
        letterSpacing: 2,
        alignSelf: 'center',
        lineHeight: Math.round(Metrics.screenHeight / 30),
    },
    skillView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Metrics.screenWidth * 0.8,
        marginVertical: 5,
    },
    aboutText: {
        fontFamily: Fonts.type.regular,
        color: Colors.textThird,
        letterSpacing: 2,
        backgroundColor: 'transparent',
        textAlignVertical: 'center'
    },
    infoText: {
        fontFamily: Fonts.type.italic,
        color: Colors.textThird,
        letterSpacing: 2,
        backgroundColor: 'transparent',
    },
    numberView: {
        ...Styles.center,
        alignSelf: 'center',
        flexDirection: 'row',
        width: Metrics.screenWidth * 0.1,
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.textPrimary,
        paddingBottom: 1,
    },
    hourView: {
        ...Styles.center,
        width: Metrics.screenWidth * 0.15,
        height: 30,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.textPrimary,
    },
    subView: {
        paddingHorizontal: Metrics.screenWidth / 10,
        width: Metrics.screenWidth,
    },
    underline: {
        width: Metrics.screenWidth * 0.8,
        borderTopWidth: 1,
        borderTopColor: Colors.textPrimary,
    },
    logoImage: {
        width: Metrics.logoSize * 0.6,
        height: Metrics.logoSize * 0.6,
        borderRadius: Metrics.logoSize * 0.6 / 2,
    },
});
