import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
    activeAvatar: {
        width: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        height: Platform.OS === 'ios' ? Metrics.screenWidth / 13 : Metrics.screenWidth / 11,
        borderRadius: Platform.OS === 'ios' ? Metrics.screenWidth / 26 : Metrics.screenWidth / 22,
    },
});
