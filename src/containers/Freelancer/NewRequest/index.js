import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert, NativeModules, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import InAppBilling from 'react-native-billing';
import Geocoder from 'react-native-geocoder'
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import PurchaseModalView from '@components/ModalViewPurchase';
import Moment from 'moment';
import MapView from 'react-native-maps';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, replaceRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';
import Utils from '@src/utils';

const { InAppUtils } = NativeModules;

class NewRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requests: props.requests,
            location: [],
            purchaseModalVisible: false,
            selectedItem: null
        };
    }

    componentDidMount() {
        this.getLocation();
    }

    componentDidUpdate() {
        // if (this.props.requests.length === 0) {
        //     this.onOpenDashboard();
        // }
    }

    getLocation() {
        let tmpLocation = [];
        this.state.requests.forEach(request => {
            if (!request.latitude) {
                tmpLocation.push('');
            } else {
                this.doGetAddress(request.latitude, request.longitude).then(res => {
                    tmpLocation.push(res);
                    if (tmpLocation.length === this.state.requests.length) this.setState({location: tmpLocation});
                });
            }
        });
    }
    async doGetAddress(latitude, longitude) {
        let NY = {
            lat: latitude,
            lng: longitude
        };
        let address = '';
        try {
            const res = await Geocoder.geocodePosition(NY);
            console.log('location', res);
            address = res[0].formattedAddress;
        }
        catch(err) {
            console.log(err);
        }
        return address;
    }

    onOpenDashboard() {
        this.props.replaceRoute('dashboard');
    }

    onRequestDetail(index) {
        if (this.state.selectedItem === null) return;
        this.props.navigator.push({
            id: 'viewrequest',
            passProps: {
                request: this.state.selectedItem,
                address: this.state.location[index],
                count: this.state.requests.length,
                callback: this.onCallback
            },
        });
    }

    onCallback = (index) => {
        const tmp = Utils.clone(this.state.requests);
        tmp.splice(index, 1);
        this.setState({requests: tmp});
    };

    openPurchaseModal() {
        this.setState({ purchaseModalVisible: true });
    }
    onPurchase(index) {
        console.log('onPurchase triggered');
        if (Platform.OS === 'android') {
            this.androidPay(index).then(response => {
                console.log('payResponse:', response);
            });
        } else {
            this.applePay(index);
        }
    }
    applePay(index) {
        let productIdentifier = 'com.se.stylenow.product' + (index + 1);
        let products = [productIdentifier,];
        InAppUtils.loadProducts(products, (error, products) => {
            console.log('loadProducts', error, products);
            //update store here.
            InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
                console.log('purchaseProduct', error, products);
                // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                if (response && response.productIdentifier) {
                    Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
                    this.doPurchaseRequest(index);
                } else {
                    Alert.alert(
                        null,
                        error,
                        [
                            {
                                text: I18n.t('OK'), onPress: () => {}
                            },
                        ],
                        {cancelable: false}
                    );
                }
            });
        });
    }
    async androidPay(index) {
        // let productId = 'android.test.purchased';
        let productId = 'com.se.stylenow.product' + (index + 1);
        await InAppBilling.close();
        try {
            await InAppBilling.open();
            if (!await InAppBilling.isPurchased(productId)) {
                const details = await InAppBilling.purchase(productId);
                this.doPurchaseRequest(index);
                console.log('You Purchased: ', details);
            }
            const transactionStatus = await InAppBilling.getPurchaseTransactionDetails(productId);
            console.log('Transaction Status', transactionStatus);
            const productDetails = await InAppBilling.getProductDetails(productId);
            console.log('Product Details', productDetails);
        } catch (err) {
            console.log(err);
        } finally {
            await InAppBilling.consumePurchase(productId);
            await InAppBilling.close();
        }
    }
    doPurchaseRequest(index) {
        let isOK;
        fetch(Global.API_URL + '/update_request', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                job_id: this.state.selectedItem.id,
                status: Constants.jobStatus.Purchased
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.onPurchaseSuccess();
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
            this.props.setSpinnerVisible(false);
            console.log('error', error);
        }).done();
    }
    onPurchaseSuccess() {
        let tmp = Utils.clone(this.state.requests);
        const index = tmp.indexOf(this.state.selectedItem);
        tmp[index].status = Constants.jobStatus.Purchased;
        this.setState({requests: tmp});

        this.setState({ purchaseModalVisible: false });
        this.onRequestDetail(index);
    }
    onPurchaseCancel() {
        this.setState({ purchaseModalVisible: false });
    }

    onSkipRequest() {
        this.props.replaceRoute('profile');
    }

    render() {
        return (
            <View style={[Styles.fullScreen, styles.container]}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <Text style={styles.newRequestText}>
                    {I18n.t('YOU_HAVE_NEW_REQUEST')}
                </Text>
                <ScrollView style={{marginTop: Metrics.defaultMargin * 2, marginBottom: Metrics.defaultMargin}}>
                    {this.state.requests && this.state.requests.map((item, index) => (
                        (
                            <TouchableOpacity
                                key={index}
                                style={[styles.requestView, {
                                    backgroundColor: Colors.listItemSecondary,
                                    borderColor: Colors.listItemBorder2
                                }]}
                                onPress={() => {
                                    if (item.status > Constants.jobStatus.Pending) {
                                        this.onRequestDetail(index)
                                    } else {
                                        this.setState({selectedItem: item});
                                        this.openPurchaseModal();
                                    }
                                }}>
                                <View style={Styles.rowSpace}>
                                    <View style={{flex: 1.2, alignItems: 'center'}}>
                                        { item.status > Constants.jobStatus.Pending ?
                                            <Image
                                                style={styles.avatarImage}
                                                source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}/>
                                            :
                                            CommonWidgets.renderAvatarPlaceholder(styles.avatarImage)
                                        }
                                    </View>
                                    <View style={{flex: 0.2}}/>
                                    <View style={{flex: 2.6}}>
                                        <Text style={styles.timeText}>
                                            {Utils.revertFromUTC(item.book_time).format('YYYY-MM-DD HH:mm')}
                                        </Text>
                                        <Text style={styles.locationText}>
                                            {this.state.location[index]}
                                        </Text>
                                    </View>
                                    <View style={{flex: 0.9, alignItems: 'flex-start'}}>
                                        <Text style={styles.priceText}>
                                            {item.total_price + (item.unit ? item.unit : '€')}
                                        </Text>
                                    </View>
                                    <View style={{flex: 0.1}}/>
                                </View>
                            </TouchableOpacity>
                        )
                    ))}
                </ScrollView>
                <View style={[Styles.rowSpace, { width: Metrics.screenWidth * 0.7, justifyContent: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => this.onOpenDashboard()}
                        style={[styles.buttonStyle, { backgroundColor: Colors.white }]}>
                        <Text style={[Fonts.style.h6, {color: Colors.textSecondary}]}>{I18n.t('TODASHBOARD')}</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity*/}
                    {/*onPress={() => this.onSkipRequest()}*/}
                    {/*style={[styles.buttonStyle, { backgroundColor: Colors.black }]}>*/}
                    {/*<Text style={[Fonts.style.h6, { color: Colors.white }]}>{I18n.t('SKIP')}</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                {this.state.purchaseModalVisible &&
                <PurchaseModalView
                    navigator={this.props.navigator}
                    price={this.state.selectedItem.total_price}
                    onPurchase={(index) => this.onPurchase(index)}
                    onCancel={() => this.onPurchaseCancel()}
                />}
            </View>
        );
    }
}
NewRequest.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewRequest);
