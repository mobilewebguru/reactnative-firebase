import { StyleSheet } from 'react-native';
import { Colors, Metrics, Styles } from '@theme/';

const itemMargin = Metrics.screenWidth * 0.02;

export default StyleSheet.create({
    container: {
        ...Styles.center,
    },
    itemContainer: {
        flexDirection: 'row',
        width: Metrics.screenWidth * 0.8,
        marginBottom: itemMargin,
        paddingLeft: itemMargin,
        paddingRight: itemMargin,
        justifyContent: 'space-between',
    },
    itemView: {
        ...Styles.center,
        flexDirection: 'row',
        width: Metrics.screenWidth * 0.8 / 6,
        height: 30,
        borderRadius: 5,
        borderColor: Colors.black,
    },
});
