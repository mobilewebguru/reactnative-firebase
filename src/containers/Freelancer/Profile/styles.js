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
        fontSize: Fonts.size.default,
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
        fontSize: 12,
    },
    jobDescContainer: {
        width: '100%',
        height: Metrics.screenHeight / 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerText: {
        fontFamily: Fonts.type.italic,
    },
    workImageContainer: {
        marginLeft: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    reviewImage: {
        width: Metrics.screenWidth / 12,
        height: Metrics.screenWidth / 12,
        borderRadius: Metrics.screenWidth / 24,
    },
    descriptionText: {
        color: Colors.textSecondary,
        height: Metrics.screenHeight * 0.15,
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
    logoutText: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
        color: Colors.textPrimary,
    }
});
