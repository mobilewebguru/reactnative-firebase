import { StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    container: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight - Metrics.navBarHeight,
        padding: Metrics.defaultPadding
    },
});
