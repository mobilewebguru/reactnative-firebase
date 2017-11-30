import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    forwardIconContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: Metrics.defaultPadding,
    },
    workImageView: {
        flex: 1,
        width: Metrics.screenWidth * 0.26,
        height: Metrics.screenWidth * 0.26,
        backgroundColor: 'transparent',
        padding: 5,
    },
    workImage: {
        backgroundColor: 'red',
        width: Metrics.screenWidth * 0.24,
        height: Metrics.screenWidth * 0.24,
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
    },
    closeIcon: {
        width: 30,
        height: 30,
        borderRadius: 18,
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 0,
        top: 0,
        elevation: 1,
    },
    daySelectedText: {
        fontWeight: 'normal',
        backgroundColor: Colors.brandPrimary,
        color: Colors.textPrimary,
        borderColor: Colors.brandPrimary,
        borderRadius: 15,
        overflow: 'hidden',
    },
    calendarStyle: {
        flex: 1,
    },
    calendarBar: {
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h6,
        textAlign: 'center',
    },
    dayHeaderView: {
        backgroundColor: '#F0F',
        borderBottomColor: '#FFFFFF',
        width: Metrics.screenWidth * 0.75,
    },
    dayHeaderText: {
        fontFamily: Fonts.type.italic,
        paddingHorizontal: 5,
    },
    dayRowView: {
        borderColor: '#9FC386',
        backgroundColor: '#9FC386',
        width: Metrics.screenWidth * 0.75,
        height: Metrics.screenHeight / 20,
    },
    swipeButton: {
        ...Styles.center,
        width: Metrics.screenWidth * 0.8,
        height: Metrics.screenHeight * 0.08,
        borderColor: Colors.textPrimary,
        borderWidth: 1,
        borderRadius: 0,
    },
    defaultButton: {
        ...Styles.center,
        width: Metrics.screenWidth * 0.6,
        height: Metrics.screenHeight * 0.07,
        borderColor: Colors.textPrimary,
        borderWidth: 1,
        borderRadius: 5,
    },
    backButton: {
        ...Styles.center,
        position: 'absolute',
        left: 20,
        top: Platform.OS === 'android' ? 25 : 30,
        width: 40,
        height: 40,
    },
});
