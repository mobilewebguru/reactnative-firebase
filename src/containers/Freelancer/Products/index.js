import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import OverlaySpinner from '@components/OverlaySpinner';
import ActionSheet from '@components/ActionSheet/';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { popRoute, replaceRoute } from '@actions/route';
import { setSpinnerVisible } from '@actions/globals';
import styles from './styles';
import Utils from '@src/utils';
import Global from "@theme/Global";

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Product: props.globals.products,
            actionMenuValue: [],
            selectedMainCategory: I18n.t('MAIN_CATEGORY'),
            selectedMainCatId: -1,
            selectedSubCategory: I18n.t('SUB_CATEGORY'),
            selectedSubCatId: -1,
            selectedPrice: '',
        };
        this.menuType = '';
    }

    componentWillMount() {
        const tmp = Utils.clone(Global.categories);
        tmp.push({ key: tmp.length, label: I18n.t('CANCEL') });
        this.setState({ actionMenuValue: tmp });
    }

    onCloseProduct(item) {
        const tmp = Utils.clone(this.state.Product);
        const index = tmp.indexOf(item);
        tmp.splice(index, 1);
        this.setState({ Product: tmp });

        this.doRemoveProduct(index);
    }

    doRemoveProduct(index) {
        let isOK;
        fetch(Global.API_URL + '/remove_product', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                product_id: this.props.globals.products[index].id,
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.globals.products = this.state.Product;
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    onAddProduct() {
        const tmp = Utils.clone(this.state.Product);
        tmp.push({
            category_id: this.state.selectedMainCatId + 1,
            sub_category_id: this.state.selectedSubCatId + 1,
            price: this.state.selectedPrice,
            unit: '€'
        });
        if (this.state.selectedMainCatId === -1 || this.state.selectedPrice === 0 || this.state.selectedSubCatId === -1) return;
        this.setState({
            Product: tmp,
            selectedMainCategory: I18n.t('MAIN_CATEGORY'),
            selectedSubCategory: I18n.t('SUB_CATEGORY'),
            selectedPrice: '',
            selectedMainCatId: -1,
            selectedSubCatId: -1,
        });

        this.doAddProduct();
    }

    doAddProduct() {
        let isOK;
        fetch(Global.API_URL + '/add_product', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                user_id: this.props.globals.user.id,
                category_id: this.state.selectedMainCatId + 1,
                sub_category_id: this.state.selectedSubCatId + 1,
                price: this.state.selectedPrice,
                unit: '€'
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.props.globals.products = [...this.props.globals.products, responseData.message];
                this.setState({Product: this.props.globals.products});
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                                store.delete('token').then(() => {
                                    this.props.replaceRoute('login');
                                });
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            console.log('error', error);
        }).done();
    }

    onActionSheetMenu(index) {
        if (this.menuType === 'main') {
            this.setState({ selectedMainCatId: index });
            this.setState({ selectedMainCategory: Global.categories[index].name})
        } else if (this.menuType === 'sub') {
            this.setState({ selectedSubCatId : index });
            this.setState({ selectedSubCategory: Global.categories[this.state.selectedMainCatId].subCategory[index].name})
        }
    }

    showActionSheetMenu() {
        if (this.menuType === 'main') {
            const tmp = Utils.clone(Global.categories);
            tmp.push({ key: tmp.length, label: I18n.t('CANCEL') });
            this.setState({ actionMenuValue: tmp });
            this.ActionSheet.reloadHeight(tmp);
            this.ActionSheet.show();
        } else if (this.menuType === 'sub' && this.state.selectedMainCatId !== -1) {
            const tmp = Utils.clone(Global.categories[this.state.selectedMainCatId].subCategory);
            tmp.push({ key: tmp.length, label: I18n.t('CANCEL') });
            this.setState({ actionMenuValue: tmp });
            this.ActionSheet.reloadHeight(tmp);
            this.ActionSheet.show();
        } else {
            alert(I18n.t('ALERT_EMPTY_MAIN_CATEGORY'));
        }
    }
    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.replaceRoute('profile')}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('PRODUCTS'),
            style: Styles.navBarTitle,
        };
        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                    title={navBarTitleConfig}
                />
                <KeyboardAwareScrollView
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    { this.state.Product.map((item, index) => (
                        <View key={index} style={styles.subContainer}>
                            <View style={styles.buttonItem}>
                                <Text style={styles.textStyle}>
                                    {Global.categories[item.category_id - 1].name}
                                </Text>
                            </View>
                            <View style={styles.buttonItem}>
                                <Text style={styles.textStyle}>
                                    {Global.categories[item.category_id - 1].subCategory[item.sub_category_id - 1].name}
                                </Text>
                            </View>
                            <TextInput
                                keyboardType={'number-pad'}
                                editable={false}
                                underlineColorAndroid={'transparent'}
                                maxLength={3}
                                style={styles.inputItem}
                                value={item.price.toString() + item.unit}/>
                            <TouchableOpacity
                                onPress={() => this.onCloseProduct(item)}
                                style={styles.closeIconContainer}>
                                <Image style={styles.closeIcon} source={Icons.iconClose}/>
                            </TouchableOpacity>
                        </View>
                    )) }
                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            onPress={()=>{
                                this.menuType = 'main';
                                this.showActionSheetMenu();
                            }}
                            style={styles.buttonItem}>
                            <View/>
                            <Text style={styles.textStyle}>
                                {this.state.selectedMainCategory}
                            </Text>
                            <Icon name='md-arrow-dropdown' style={{color: 'white'}} size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.menuType = 'sub';
                                this.showActionSheetMenu();
                            }}
                            style={styles.buttonItem}>
                            <View/>
                            <Text style={styles.textStyle}>
                                {this.state.selectedSubCategory}
                            </Text>
                            <Icon name='md-arrow-dropdown' style={{color: 'white'}} size={25}/>
                        </TouchableOpacity>
                        <TextInput
                            keyboardType={'number-pad'}
                            placeholder={I18n.t('PRICE')}
                            underlineColorAndroid={'transparent'}
                            maxLength={3}
                            style={styles.inputItem}
                            value={this.state.selectedPrice}
                            onChangeText={value => this.setState({ selectedPrice: value })}/>
                        <TouchableOpacity
                            onPress={() => this.onAddProduct()}
                            style={styles.addIconContainer}>
                            <Image style={styles.closeIcon} source={Icons.iconAddNew}/>
                        </TouchableOpacity>
                    </View>
                    {CommonWidgets.renderLargeSpacer()}
                </KeyboardAwareScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.actionMenuValue}
                    cancelButtonIndex={this.state.actionMenuValue.length - 1}
                    onPress={this.onActionSheetMenu.bind(this)}
                    tintColor={Colors.textSecondary}
                />
            </View>
        );
    }
}
Products.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Products);
