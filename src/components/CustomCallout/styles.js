import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts, Styles } from '@theme/';

export default StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },
    bubble: {
        width: 140,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: 'black',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(201, 195, 195, 0.46)',
    },
    amount: {
        flex: 1,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: 'black',
        alignSelf: 'center',
        marginTop: -1.5,
        marginBottom: -13,
    },
    topView: {
        flex: 5,
        flexDirection: 'row',
    },
    avatarStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    nameText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h6,
    },
    scoreText: {
        color: Colors.white,
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.default,
    },
    skillText: {
        color: Colors.white,
        fontFamily: Fonts.type.light,
        fontSize: Fonts.size.h5,
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eyeContainer: {
        ...Styles.center,
        width: 40,
        height: 15,
        borderRadius: 20,
        backgroundColor: Colors.white,
    },
    eyeImage: {
        ...Styles.center,
        width: 20,
        height: 13,
        backgroundColor: Colors.black,
        borderRadius: 7,
    },
    iconStyle: {
        color: Colors.white,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 1 : 0,
    },
    skillBtnIcon: {
        marginLeft: 5,
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
})
