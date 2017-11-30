import { Dimensions, StyleSheet } from 'react-native';
import { Styles, Fonts, Colors, Metrics } from '@theme/';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    calendarContainer: {
        width: DEVICE_WIDTH * 0.85,
    },
    monthContainer: {
    },
    calendarControls: { // month container
        flexDirection: 'row',
        width: DEVICE_WIDTH / 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    controlButton: { // month arrow button view
        alignSelf: 'center'
    },
    controlButtonText: { // month arrow text
        margin: 10,
        fontSize: 20,
        fontFamily: Fonts.type.regular,
    },
    title: { // month title
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        margin: 10,
        fontFamily: Fonts.type.regular,
    },
    calendarHeading: { // week container
        flexDirection: 'row',
    },
    dayHeading: { // each week view except for weekend
        flex: 1,
        fontSize: 15,
        fontFamily: Fonts.type.regular,
        textAlign: 'center',
        marginLeft: 1,
    },
    weekendHeading: { // each weekend view
        flex: 1,
        fontSize: 15,
        fontFamily: Fonts.type.regular,
        textAlign: 'center',
        marginLeft: 1,
    },
    weekRow: { // week row of days
        flexDirection: 'row',
    },
    dayButton: { // day button
        alignItems: 'center',
        width: Math.round(DEVICE_WIDTH * 0.85 / 7),
        paddingVertical: 10,
    },
    dayButtonFiller: {
        width: Math.round(DEVICE_WIDTH / 8.2),
    },
    day: {
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: Fonts.type.regular,
    },
    eventIndicatorFiller: {
        marginTop: 3,
        borderColor: 'transparent',
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    eventIndicator: {
        backgroundColor: '#cccccc',
    },
    dayCircleFiller: {
        ...Styles.center,
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 16,
        paddingBottom: 2,
    },
    currentDayCircle: {
        backgroundColor: 'red',
    },
    currentDayText: {
        color: Colors.brandPrimary,
    },
    selectedDayCircle: {
        backgroundColor: 'black',
    },
    hasEventCircle: {
    },
    hasEventDaySelectedCircle: {
    },
    hasEventText: {
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'normal',
    },
    weekendDayText: {
        color: '#cccccc',
    },
});

export default styles;
