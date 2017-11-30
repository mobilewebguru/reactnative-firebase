import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Alert, NativeModules, Platform } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import InAppBilling from 'react-native-billing';
import Geocoder from 'react-native-geocoder'
import Moment from 'moment';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import Timer from '@components/CountDownTimer';
import TimeLabel from '@components/CountDownTimer/TimeLabel';
import PurchaseModalView from '@components/ModalViewPurchase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setJobs } from '@actions/globals';
import Constants from '@src/constants';
import Utils from '@src/utils';
import styles from './styles';

const { InAppUtils } = NativeModules

class Requests extends Component {

    constructor(props) {
        super(props);
        this.state= {
            jobsForDate: null,
            location: [],
            purchaseModalVisible: false,
            selectedItem: null
        };
    }

    componentDidMount() {
        console.log('Requests component mounted');
        setTimeout(() => {
            this.setJobsForDate(this.props.globals.jobs);
        }, Global.mountTimeout / 2);
    }

    componentWillReceiveProps(nextProps) {
        console.log('Requests received nextProps');
        if (this.props.globals.jobs !== nextProps.globals.jobs) {
            this.setJobsForDate(nextProps.globals.jobs);
        }
    }

    setJobsForDate(jobs) {
        let tmp = [], tmpLocation = [];
        jobs.forEach(job => {
            if (Moment(job.book_time).format('YYYY-MM-DD') === this.props.date) {
                if (job.status > Constants.jobStatus.Accepted) return;
                tmp.push(job);
                this.doGetAddress(job.latitude, job.longitude).then(res => {
                    tmpLocation.push(res);
                    if (tmpLocation.length === tmp.length) this.setState({location: tmpLocation});
                });
            }
        });
        this.setState({jobsForDate: tmp});
    }

    onRequestDetail(index) {
        if (this.state.jobsForDate[index] === null) return;
        this.props.navigator.push({
            id: 'viewrequest',
            passProps: {
                request: this.state.jobsForDate[index],
                address: this.state.location[index]
            },
        });
    }

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
        let tmp = Utils.clone(this.props.globals.jobs);
        const index = tmp.indexOf(this.state.selectedItem);
        tmp[index].status = Constants.jobStatus.Purchased;
        this.props.setJobs(tmp);

        this.setState({ purchaseModalVisible: false });
        this.onRequestDetail(index);
    }
    onPurchaseCancel() {
        this.setState({ purchaseModalVisible: false });
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

    onExpired(index) {
        const tmp1 = Utils.clone(this.state.jobsForDate);
        tmp1.splice(index, 1);

        const tmp2 = Utils.clone(this.props.globals.jobs);
        const index2 = tmp2.indexOf(tmp1[index]);
        tmp2.splice(index2, 1);

        this.setState({jobsForDate: tmp1});
        this.props.setJobs(tmp2);
    }

    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.popRoute()}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: Moment(this.props.date).format('D. MMMM YYYY'),
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
                    ref={(c) => { this.scrollView = c; }}
                    backgroundColor={Colors.white}
                    alwaysBounceVertical={false}>
                    <View backgroundColor={Colors.white} style={styles.container}>
                        { this.state.jobsForDate && this.state.jobsForDate.length > 0 ?
                            this.state.jobsForDate.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.requestView, {
                                        backgroundColor: item.status === Constants.jobStatus.Purchased ? Colors.listItemPrimary : (item.status === Constants.jobStatus.Accepted ? Colors.listItemThird : Colors.listItemSecondary),
                                        borderColor: item.status === Constants.jobStatus.Pending ? Colors.listItemBorder : Colors.textPrimary
                                    }]}
                                    onPress={() => {
                                        //TODO: check if purchased or not
                                        if (item.status > Constants.jobStatus.Pending) {
                                            this.onRequestDetail(index)
                                        } else {
                                            this.setState({selectedItem: item});
                                            this.openPurchaseModal();
                                        }
                                    }}>
                                    <View style={Styles.rowSpace}>
                                        <View style={{flex: 0.9, alignItems: 'center'}}>
                                            { item.status > Constants.jobStatus.Pending ?
                                                <Image
                                                    style={styles.avatarImage}
                                                    source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}/>
                                                :
                                                CommonWidgets.renderAvatarPlaceholder(styles.avatarImage)
                                            }
                                        </View>
                                        <View style={{flex: 0.2}}/>
                                        <View style={{flex: 2.8}}>
                                            <Text style={styles.timeText}>
                                                {Utils.revertFromUTC(item.book_time).format('YYYY-MM-DD HH:mm')}
                                            </Text>
                                            <Text style={styles.locationText}>
                                                {this.state.location[index]}
                                            </Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Text style={styles.timeText}>
                                                {item.total_price + '€'}
                                            </Text>
                                            { item.status < Constants.jobStatus.Accepted ?
                                                <Timer
                                                    till={new Date(Utils.revertFromUTC(item.request_time, 30).format('MM/DD/YYYY HH:mm:ss'))}
                                                    renderTick={(data) =>
                                                        <TimeLabel
                                                            style={styles.acceptText}
                                                            {...data}
                                                        />}
                                                    onTick={null}
                                                    onFinish={() => this.onExpired(index)}
                                                />
                                                :
                                                (item.status === Constants.jobStatus.Accepted ?
                                                    <Text style={styles.acceptText}>
                                                        {I18n.t('ACCEPTED')}
                                                    </Text>
                                                    :
                                                    <Text style={styles.acceptText}>
                                                        {I18n.t('DECLINED')}
                                                    </Text>)
                                            }

                                        </View>
                                        <View style={{flex: 0.1}}/>
                                    </View>
                                </TouchableOpacity>
                            ))
                            :
                            <View style={{marginTop: 50}}>
                                {this.state.jobsForDate &&
                                <Text style={[styles.acceptText, {color: Colors.textSecondary}]}>
                                    {I18n.t('NO_OFFERS') + ' ' + Moment(this.props.date).format('D. MMM YYYY')}
                                </Text>}
                            </View>
                        }
                    </View>
                </KeyboardAwareScrollView>
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
Requests.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
        setJobs: jobs => dispatch(setJobs(jobs)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Requests);
