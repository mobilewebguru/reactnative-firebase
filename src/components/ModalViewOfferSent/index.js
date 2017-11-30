/**
 * this modal is for user only
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors, Styles, Fonts, Metrics, Images } from '@theme/';
import CommonWidgets from '@components/CommonWidgets';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';

export default class ModalView extends React.Component {

    render() {
        if (!this.props.dialogVisible)
            return <View/>;
        return (
            <View style={[Styles.center, styles.mainContainer]}>
                <View style={{ ...Styles.center, flex: 3 }}>
                    <Text style={{ fontFamily: Fonts.type.regular, fontSize: Fonts.size.h1, color: Colors.white }}>
                        {I18n.t('OFFER_SENT')}
                    </Text>
                </View>
                <View style={{ flex: 3 }}>
                    <Image style={styles.registerMark} source={Images.imgRegisterDone}/>
                </View>
                <View style={{ flex: 2, width: Metrics.screenWidth * 0.6 }}>
                    <Text style={{ fontFamily: Fonts.type.regular, fontSize: Fonts.size.h4, color: Colors.white, textAlign: 'center'}}>
                        {I18n.t('OFFER_VALIDATION_WARNING')}
                    </Text>
                </View>
                <View style={{ flex: 2 }}>
                    {CommonWidgets.renderDefaultButton(I18n.t('HOME'), Colors.white, Colors.black, () => this.props.onNext())}
                </View>
            </View>
        );
    }
}
