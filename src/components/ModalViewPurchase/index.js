/**
 * this modal is for freelancer only
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { Colors, Styles, Fonts, Metrics, Images, Icons } from '@theme/';
import CommonWidgets from '@components/CommonWidgets';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import Utils from '@src/utils';
import constants from "../../constants";

export default class ModalView extends React.Component {
    render() {
        let index = Utils.getRevealCostIndex(this.props.price);
        return (
            <View style={[Styles.center, styles.mainContainer]}>
                <View style={[Styles.center, styles.dialogContainer]}>
                    <View style={styles.mainDialog}>
                        <View style={{flex: 0.3, justifyContent: 'center'}}>
                            <Text style={styles.textTitle}>{I18n.t('REVEAL_CONTACT_INFO')}</Text>
                        </View>
                        <View style={{flex: 0.3, flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 3}}>
                                <Text style={styles.textSubTitle}>{
                                    'Potential earning: ' + this.props.price + '€\n' +
                                    'Reveal costs: ' + constants.IN_APP_PRODUCT[index].price + '€\n' +
                                    'Profit: ' + (this.props.price - constants.IN_APP_PRODUCT[index].price) + '€\n'
                                }
                                </Text>
                            </View>
                        </View>
                        <View style={{flex: 0.15}}>
                            <TouchableOpacity style={styles.button} onPress={() => this.props.onPurchase(index)}>
                                <Text style={styles.textButtonTitle}>{'buy now ' + constants.IN_APP_PRODUCT[index].price + '€'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.15}}/>
                        {/*<View style={{flexDirection: 'row', justifyContent: 'center', flex: 0.2}}>*/}
                            {/*<Text style={styles.textSubTitle}>{'1 ' + I18n.t('TIME')}</Text>*/}
                            {/*<Text style={styles.textSubTitle}>{'6 ' + I18n.t('MONTHS')}</Text>*/}
                            {/*<Text style={styles.textSubTitle}>{'1 ' + I18n.t('YEAR')}</Text>*/}
                        {/*</View>*/}
                         {/*<View style={{flexDirection: 'row', justifyContent: 'center', flex: 0.5}}>*/}
                            {/*<TouchableOpacity style={styles.button} onPress={() => this.props.onPurchase(0)}>*/}
                                {/*<Text style={styles.textButtonTitle}>{I18n.t('PAYMENT_ONCE')}</Text>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity style={styles.button} onPress={() => this.props.onPurchase(1)}>*/}
                                {/*<Text style={styles.textButtonTitle}>{I18n.t('PAYMENT_SIX_MONTHS')}</Text>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity style={styles.button} onPress={() => this.props.onPurchase(2)}>*/}
                                {/*<Text style={styles.textButtonTitle}>{I18n.t('PAYMENT_YEAR')}</Text>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View> */}
                        {/*<View style={{flexDirection: 'row', justifyContent: 'center', flex: 1.2}}>*/}
                            {/*<Text style={styles.textDescription}>{I18n.t('PAYMENT_DESCRIPTION1')}</Text>*/}
                            {/*<Text style={styles.textDescription}>{I18n.t('PAYMENT_DESCRIPTION2')}s</Text>*/}
                            {/*<Text style={styles.textDescription}>{I18n.t('PAYMENT_DESCRIPTION3')}</Text>*/}
                        {/*</View>*/}
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.onCancel()}
                        style={styles.closeIconContainer}>
                        <Image style={styles.closeIcon} source={Icons.iconClosePurchase}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
