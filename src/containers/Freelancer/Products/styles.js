import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    subContainer: {
        ...Styles.center,
        marginTop: Metrics.screenHeight * 0.05,
    },
    buttonItem: {
        ...Styles.rowSpace,
        width: Metrics.screenWidth * 0.7,
        height: Metrics.screenHeight * 0.07,
        backgroundColor: Colors.brandFourth,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 5
    },
    closeIconContainer: {
        position: 'absolute',
        right: Metrics.screenWidth * 0.11,
        top: -10,
    },
    closeIcon: {
        width: Metrics.screenWidth * 0.08,
        height: Metrics.screenWidth * 0.08,
        borderRadius: Metrics.screenWidth * 0.04,
    },
    textStyle: {
        width: Metrics.screenWidth * 0.6,
        textAlign: 'center',
        color: Colors.textSecondary,
        fontFamily: Fonts.type.italic
    },
    inputItem: {
        ...Styles.rowSpace,
        width: Metrics.screenWidth * 0.7,
        height: Metrics.screenHeight * 0.07,
        paddingHorizontal: 15,
        borderColor: Colors.textPrimary,
        color: Colors.textSecondary,
        fontFamily: Fonts.type.italic,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        textAlign: 'center',
        alignSelf: 'center',
    },
    addIconContainer: {
        top: 15,
    },
});
