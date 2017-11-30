import { Platform } from 'react-native';

import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

const Styles = {
    button: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStep: {
        width: Metrics.screenWidth,
        height: Metrics.buttonHeight * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonFB: {
        width: Metrics.screenWidth * 0.5,
        height: Metrics.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    buttonPrimary: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonHeight,
        backgroundColor: Colors.brandPrimary,
    },
    buttonSecondary: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonHeight,
        backgroundColor: Colors.brandSecondary,
    },
    buttonThird: {
        width: Metrics.buttonWidth,
        height: Metrics.buttonHeight,
        backgroundColor: Colors.brandThird,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fullScreenMap: {
        width: Metrics.screenWidth,
        height: Platform.OS === 'android' ? Metrics.screenHeight - 20 : Metrics.screenHeight,
    },
    fullScreen: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
    },
    fixedFullScreen: {
        position: 'absolute',
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
        top: 0,
        left: 0,
    },
    navBarStyle: {
        paddingHorizontal: 15,
        justifyContent: 'center',
        height: Metrics.navBarHeight,
        // marginTop: Platform.OS === 'ios' ? 0 : 20,
    },
    navBarTitle: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontWeight: 'normal',
        fontSize: Fonts.size.h4,
    },
    navBarIcon: {
        width: 30,
        height: 40,
    },
    imgLogo: {
        width: Metrics.logoSize,
        height: Metrics.logoSize + 5,
    },
    buttonShadow: {
        shadowOpacity: 0.6,
        shadowOffset: {
            width: 0, height: 0,
        },
        shadowColor: '#AAA',
        shadowRadius: 12,
        elevation: Platform.OS === 'ios' ? 6 : 0,
    },
    circleButtonShadow: {
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0, height: -4,
        },
        shadowColor: Colors.brandSecondary,
        shadowRadius: 2,
        elevation: 4,
    },
    imageIconStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    }
};

export default Styles;
