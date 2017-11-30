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
    jobDescSubView: {
        ...Styles.center,
        width: Metrics.screenWidth / 3,
    },
    jobDescText: {
        marginTop: 10,
        fontSize: Fonts.size.small,
        fontFamily: Fonts.type.italic,
        width: Metrics.screenWidth / 3,
        textAlign: 'center'
    },
    avatarContainer: {
        position: 'absolute',
        left: (Metrics.screenWidth - Metrics.logoSize) / 2,
        top: Platform.OS === 'ios' ? (Metrics.navBarHeight * 2.3 - Metrics.logoSize * 0.5) : (Metrics.navBarHeight * 2.3 - Metrics.logoSize * 0.5) + 20,
    },
    imgAvatar: {
        width: Metrics.logoSize,
        height: Metrics.logoSize,
        borderRadius: Metrics.logoSize / 2,
        resizeMode: 'cover',
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
    jobDescContainer: {
        height: Metrics.screenHeight / 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        flex: 1,
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h5,
    },
    workImageContainer: {
        marginLeft: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    reviewImage: {
        width: Metrics.screenWidth / 12,
        height: Metrics.screenWidth / 12,
        borderRadius: Metrics.screenWidth / 24,
    },
    descriptionText: {
        color: Colors.textSecondary,
        height: Metrics.screenHeight * 0.2,
        width: Metrics.screenWidth * 0.8,
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h6,
        alignSelf: 'center',
        textAlign: 'auto',
        paddingTop: 0,
    },
    reviewRateText: {
        fontFamily: Fonts.type.regular,
        marginLeft: 5,
    },
    underline: {
        width: Metrics.screenWidth * 0.8,
        borderTopWidth: 1,
        borderTopColor: Colors.textPrimary,
    },
    skillView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Metrics.screenWidth * 0.8,
        marginVertical: 5,
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
    aboutText: {
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h6,
        letterSpacing: 3,
        backgroundColor: 'transparent',
        textAlignVertical: 'center'
    },
    infoText: {
        margin: 2,
        marginLeft: 0,
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h5,
        textAlign: 'right',
        letterSpacing: 3,
        backgroundColor: 'transparent',
    },
    bottomContainer: {
        ...Styles.center,
        flex: 1,
        alignSelf: 'center',
        width: Metrics.screenWidth * 0.82,
        borderWidth: 1,
        borderColor: Colors.textPrimary,
        borderRadius: 10,
        margin: Metrics.screenWidth * 0.05,
    },
    dateText: {
        fontSize: Fonts.size.h5,
        fontFamily: Fonts.type.regular,
    },
    logoImage: {
        width: Metrics.logoSize * 0.6,
        height: Metrics.logoSize * 0.6,
        borderRadius: Metrics.logoSize * 0.6 / 2,
    },
    subView: {
        paddingHorizontal: Metrics.screenWidth / 10,
        width: Metrics.screenWidth,
    },
});
