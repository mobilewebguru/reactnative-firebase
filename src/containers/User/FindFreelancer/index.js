import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, TextInput, Platform, Alert, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import CustomCallout from '@components/CustomCallout';
import ActionButton from '@components/ActionButton';
import MapView from 'react-native-maps';
import store from 'react-native-simple-store';
import Geocoder from 'react-native-geocoder'
import { Styles, Images, Colors, Fonts, Metrics, Icons, Global } from '@theme/';
import { popRoute, replaceRoute, pushNewRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible, setLocation } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';
import Utils from "../../../utils";
import NavBar from 'react-native-navbar';

class FindFreelancer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatarUri: props.globals.user.avatar_url,
            selectedVisible: false,
            selectedSkillId: 0,
            freelancers: [],
            filteredFreelancers: [],
            address: '',
            searchCoord: {}
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.doGetFreelancers();
        }, Global.mountTimeout);
    }

    setFindingLocation() {
        // let visible = this.state.selectedVisible;
        // if (visible) this.onSkillClick(0);
        // else this.setState({searchCoord: this.props.globals.coord});
        // this.setState({ selectedVisible: !this.state.selectedVisible });
        this.props.pushNewRoute('locationdetail');

    }

    onOpenDrawer() {
        this.props.openDrawer();
    }

    onSkillClick(skillId) {
        this.setState({selectedSkillId: skillId});
        this.updateFilteredFreelancers(skillId);
    }

    updateFilteredFreelancers(skillId) {
        if (skillId > 0) {
            let tmp = [];
            for (let i = 0; i < this.state.freelancers.length; i ++) {
                let products = this.state.freelancers[i].products;
                for (let j = 0; j < products.length; j ++) {
                    if (products[j].category_id === skillId) {
                        tmp.push(this.state.freelancers[i]);
                        break;
                    }
                }
            }
            this.setState({filteredFreelancers: tmp});
        } else {
            this.setState({filteredFreelancers: this.state.freelancers})
        }
    }

    onSelectLocation(data, geometry) {
        // const coord = {
        //     latitude: geometry.location.lat,
        //     longitude: geometry.location.lng,
        //     latitudeDelta: this.props.globals.coord.latitudeDelta,
        //     longitudeDelta: this.props.globals.coord.longitudeDelta,
        // };
        // this.props.setLocation(coord);
        this.props.replaceRoute('locationdetail');

    }

    onSelectCurLocation() {
        // const coord = {
        //     latitude: Global.currentCoord.latitude ? Global.currentCoord.latitude : this.props.globals.user.latitude,
        //     longitude: Global.currentCoord.longitude ? Global.currentCoord.longitude : this.props.globals.user.longitude,
        //     latitudeDelta: this.props.globals.coord.latitudeDelta,
        //     longitudeDelta: this.props.globals.coord.longitudeDelta,
        // };
        // this.props.setLocation(coord);
        this.props.replaceRoute('locationdetail');

    }

    onGotoBookingMain(item) {
        this.props.navigator.push({
            id: 'bookingmain',
            passProps: {
                freelancer: item,
                location: this.state.searchCoord
            },
        });
    }

    doGetFreelancers() {
        let isOK;
        fetch(Global.API_URL + '/get_freelancers', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                this.setState({freelancers: responseData.message});
                this.updateFilteredFreelancers(0);
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

    onRegionChanged(coord) {
        console.log('regionChanged to', coord);
        if (!this.props.globals.coord || (coord.longitude !== this.props.globals.coord.longitude)) {
            this.props.setLocation(coord);
            if (!this.state.selectedVisible) this.doGetAddress(coord);
        }
    }

    doGetAddress(coord) {
        let NY = {
            lat: coord.latitude,
            lng: coord.longitude
        };
        Geocoder.geocodePosition(NY).then(res => {
            console.log(res);
            let address = res[0].formattedAddress;
            if (this.state.address !== address) this.setState({address: res[0].formattedAddress});
            // alert(address)
        }).catch(err => {
            console.log('address error', err)
        });
    }

    render() {
        let showingCoord = {
            latitude: Global.currentCoord.latitude ? Global.currentCoord.latitude : this.props.globals.user.latitude,
            longitude: Global.currentCoord.longitude ? Global.currentCoord.longitude : this.props.globals.user.longitude,
            latitudeDelta: this.props.globals.coord && this.props.globals.coord.latitudeDelta ? this.props.globals.coord.latitudeDelta : Constants.mapDelta[0],
            longitudeDelta: this.props.globals.coord && this.props.globals.coord.longitudeDelta ? this.props.globals.coord.longitudeDelta : (Constants.mapDelta[0] * Metrics.screenWidth) / Metrics.screenHeight
        };
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}
            >
                {/*<Icon name={'md-menu'} size={25} style={{ color: Colors.white}}/>*/}
            </TouchableOpacity>
        );
        const rightButton = (
            <TouchableOpacity
                style={[Styles.center]}
                onPress={() => this.onActive()}
            >
                <Image
                    style={styles.activeAvatar}
                    source={Images.imgStepImage}/>
                {/*<Text style={styles.activeText}>{I18n.t('INACTIVE')}</Text>*/}
            </TouchableOpacity>
        );
        const navBarTitleConfig = {
            title: I18n.t('DASHBOARD'),
            style: Styles.navBarTitle,
        };
        const customStyle = {
            hasEventCircle: {
                backgroundColor: Colors.brandPrimary,
            },
            hasEventACircle: {
                backgroundColor: Colors.brandSecondary,
            },
            hasEventText: {
                color: Colors.white
            },
            hasEventAText: {
                color: Colors.white
            },
        };
        return (

            <View style={Styles.fullScreenMap}>
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.white }}
                    leftButton={leftButton}
                    // rightButton={rightButton}
                    title={rightButton}
                />
                <View style={Styles.center}>
                    <Text style={[Fonts.style.h3, { color: Colors.green}]}>
                        {I18n.t('PROPERTYLOCATION')}
                    </Text>
                    <Text style={[Fonts.style.h5, { color: Colors.textPrimary }]}>
                        {"Drag and drop the marketer on the property."}
                    </Text>
                </View>
                <View style={{width: Metrics.screenWidth, height: 1}}/>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <MapView
                        scrollEnabled={!this.state.selectedVisible}
                        zoomEnabled={true}
                        style={{width: '100%', height: '100%'}}
                        provider={MapView.PROVIDER_GOOGLE}
                        onRegionChangeComplete={(region) => this.onRegionChanged(region)}
                        initialRegion={showingCoord}
                        region={showingCoord}
                    >
                        {this.state.selectedVisible ?
                            this.state.filteredFreelancers.map((item, index) => {
                                return (
                                    <MapView.Marker
                                        key={index}
                                        coordinate={{
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                        }}>
                                        <View>
                                            <Icon name='ios-pin' size={50} style={{color: Colors.black}}/>
                                            <Image style={styles.imgMarkStyle} source={item.avatar_url ? {uri: item.avatar_url} : Images.imgAvatarPlaceholder}/>
                                        </View>
                                        <MapView.Callout tooltip={true} onPress={() => this.onGotoBookingMain(item)}>
                                            <CustomCallout
                                                image={item.avatar_url}
                                                name={item.first_name}
                                                rating={item.rating}
                                                skill={item.products}
                                            />
                                        </MapView.Callout>
                                    </MapView.Marker>
                                )
                            }) : <View/>
                        }
                    </MapView>
                    <View pointerEvents="none" style={styles.imgPinMarkContainer}>
                        <Image source={Images.imgMarkMine} style={styles.imgPinMarkStyle}/>
                    </View>
                </View>
                {CommonWidgets.renderStepButton(I18n.t('NEXT'),
                    Colors.green, () => this.setFindingLocation())}
                {!this.state.selectedVisible ?
                    CommonWidgets.renderAutoComplete(
                        (data, geometry) => this.onSelectLocation(data, geometry),
                        () => this.onSelectCurLocation(),
                        this.state.address
                    ) : (
                        <ActionButton onSkillClick={skillId => this.onSkillClick(skillId)}/>
                    )}
                {CommonWidgets.renderMenuButton(() => this.onOpenDrawer())}
                <OverlaySpinner visible={this.props.globals.spinnerVisible} />
            </View>
        );
    }
}
FindFreelancer.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        popRoute: () => dispatch(popRoute()),
        replaceRoute: route => dispatch(replaceRoute(route)),
        openDrawer: () => dispatch(openDrawer()),
        setLocation: coord => dispatch(setLocation(coord)),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(FindFreelancer);
