import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        ...Styles.center,
        flex: 1,
    },
    logoImage: {
        width: Metrics.logoSize,
        height: Metrics.logoSize,
        borderRadius: Metrics.logoSize / 2,
        borderWidth: 4,
    },
    acceptedImage: {
        width: Metrics.logoSize / 3,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    avatarView: {
        alignItems: 'center',
    },
    aboutText: {
        fontFamily: Fonts.type.regular,
        letterSpacing: 3,
        backgroundColor: 'transparent',
        textAlignVertical: 'center'
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
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.textPrimary,
        paddingBottom: 1,
    },
    underline: {
        width: Metrics.screenWidth * 0.8,
        height: 1,
        backgroundColor: Colors.textPrimary,
    },
    reviewImage: {
        width: Metrics.screenWidth / 12,
        height: Metrics.screenWidth / 12,
        borderRadius: Metrics.screenWidth / 24,
    },
    reviewRateText: {
        fontFamily: Fonts.type.regular,
        marginLeft: 5,
    },
    mapContainer: {
        backgroundColor: Colors.black,
        width: Metrics.screenWidth,
        height: Metrics.screenWidth * 0.7
    },
    mapView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.black,
        width: Metrics.screenWidth,
        height: Metrics.screenWidth * 0.7,
    },
    imgMarkStyle: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        marginTop: 9,
        alignSelf: 'center',
        borderColor: Colors.white,
        borderWidth: 1,
        resizeMode: 'cover'
    },
});
