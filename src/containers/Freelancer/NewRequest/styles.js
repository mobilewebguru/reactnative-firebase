import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        backgroundColor: Colors.black,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },
    newRequestText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h3,
    },
    buttonStyle: {
        ...Styles.center,
        width: Metrics.screenWidth * 0.3,
        height: Metrics.screenHeight * 0.06,
        borderColor: Colors.white,
        borderWidth: 1,
        borderRadius: 5,
    },

    requestView: {
        flexDirection: 'row',
        backgroundColor: Colors.listItemPrimary,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 8,
        // borderRadius: Metrics.screenHeight * 0.05,
        paddingHorizontal: 7,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarImage: {
        width: Metrics.screenHeight * 0.08,
        height: Metrics.screenHeight * 0.08,
        borderRadius: Metrics.screenHeight * 0.04,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    timeText: {
        color: Colors.white,
        fontFamily: Fonts.type.light,
        fontSize: Fonts.size.h4,
    },
    locationText: {
        color: Colors.white,
        fontFamily: Fonts.type.light,
        fontSize: Fonts.size.h5,
    },
    priceText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h4,
    }
});
