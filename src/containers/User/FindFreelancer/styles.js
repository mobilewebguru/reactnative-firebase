import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    mapView: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
    },
    setButtonContainer: {
        position: 'absolute',
        left: Metrics.screenWidth * 5 / 12,
        bottom: 80,
        width: Metrics.screenWidth / 6,
        height: Metrics.screenWidth / 6,
        borderRadius: Metrics.screenWidth / 12,
        backgroundColor: Colors.black,
    },
    imgPinMarkContainer: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    imgPinMarkStyle: {
        width: 22,
        height: 44,
        resizeMode: 'contain'
    },
    imgRoundMarkStyle: {
        width: Metrics.screenWidth / 3,
        height: Metrics.screenWidth / 3,
        resizeMode: 'cover'
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
    calloutView: {
        width: Metrics.screenWidth / 4,
        height: Metrics.screenHeight / 20,
        backgroundColor: Colors.black,
    },
    activeAvatar: {
        width: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        height: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        borderRadius: Platform.OS === 'ios' ? Metrics.screenWidth / 26 : Metrics.screenWidth / 22,
    },

});
