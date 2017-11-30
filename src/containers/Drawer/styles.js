import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    controlText: {
        color: 'white',
    },
    headerView: {
        flexDirection: 'row',
        height: Metrics.screenHeight / 3,
        backgroundColor: Colors.white,
    },
    headerText: {
        fontSize: Fonts.size.h3,
        fontFamily: Fonts.type.regular,
        color: Colors.black,
    },
    menuContainer: {
        padding: 20,
        paddingTop: 30,
    },
    menuItemText: {
        fontSize: Fonts.size.h3,
        fontFamily: Fonts.type.regular,
        color: Colors.black,
    },
    avatarImage: {
        width: Metrics.screenWidth / 4,
        height: Metrics.screenWidth / 4,
        borderRadius: Metrics.screenWidth / 8,
        borderWidth: 2,
        borderColor: Colors.brandPrimary,
        marginTop: 40,
        marginLeft: 20,
    },
    activeTextContainer: {
        ...Styles.center,
        width: Metrics.screenWidth / 4,
        marginLeft: 20,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    activeText: {
        color: Colors.brandPrimary,
        fontFamily: Fonts.type.regular,
    },
    socialIcon: {
        width: Metrics.screenWidth * 0.07,
        height: Metrics.screenWidth * 0.07,
    },
});
