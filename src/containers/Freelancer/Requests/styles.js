import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        ...Styles.center,
        flex: 1,
        // paddingTop: Metrics.screenHeight / 10,
    },
    requestView: {
        flexDirection: 'row',
        backgroundColor: Colors.listItemPrimary,
        width: Metrics.screenWidth,
        height: Metrics.screenHeight / 7,
        // borderRadius: Metrics.screenHeight * 0.05,
        paddingHorizontal: 7,
        borderWidth: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
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
        fontSize: Fonts.size.h5,
        fontFamily: Fonts.type.regular,
    },
    acceptText: {
        color: Colors.white,
        fontFamily: Fonts.type.semibold,
        fontSize: Fonts.size.h4,
    }
});
