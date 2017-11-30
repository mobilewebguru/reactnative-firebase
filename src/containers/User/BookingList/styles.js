import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        ...Styles.center,
        flex: 1,
        paddingTop: Metrics.screenHeight / 10,
    },
    dateText: {
        fontSize: Fonts.size.h4,
        fontFamily: Fonts.type.regular,
    },
    requestView: {
        flexDirection: 'row',
        backgroundColor: Colors.listItemPrimary,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight * 0.1,
        // borderRadius: Metrics.screenHeight * 0.05,
        paddingHorizontal: 7,
        borderWidth: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    avatarImage: {
        width: Metrics.screenHeight * 0.07,
        height: Metrics.screenHeight * 0.07,
        borderRadius: Metrics.screenHeight * 0.035,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    priceText: {
        width: Metrics.screenWidth * 0.2,
        color: Colors.white,
        fontFamily: Fonts.type.italic,
        fontSize: Fonts.size.h5,
        backgroundColor: 'transparent'
    },
    hourText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h5,
    },
    timeText: {
        color: Colors.white,
        fontFamily: Fonts.type.light,
        fontSize: Fonts.size.h5,
    },
});
