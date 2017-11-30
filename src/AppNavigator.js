import React, { Component } from 'react';
import { BackAndroid, Platform, StatusBar, View, Navigator } from 'react-native';
import { connect } from 'react-redux';
import { popRoute } from '@actions/route';
import { Colors } from '@theme/';
import { closeDrawer, openDrawer } from '@actions/drawer';
import Drawer from 'react-native-drawer'

import Splash from './containers/Splash';
import Home from './containers/Home';
import Chat from './containers/Chat';
import Messages from './containers/Messages';
import TakeItemPhoto from './containers/TakeItemPhoto';

import Login from './containers/Authentication/Login';
import Register from './containers/Authentication/Register';
import RegisterPayment from './containers/Authentication/RegisterPayment';
import RegisterCredit from './containers/Authentication/RegisterCredit';
import RegisterDone from './containers/Authentication/RegisterDone';
import ForgotPassword from './containers/Authentication/ForgotPassword';
import ResetDone from './containers/Authentication/ResetDone';

import LocationProperty from './containers/Property/LocationProperty';
import LocationDetail from './containers/Property/LocationDetail';
import CropProperty from './containers/Property/CropProperty';
import CropDetail from './containers/Property/CropDetail';

import Profile from './containers/Freelancer/Profile';
import Products from './containers/Freelancer/Products';
import Dashboard from './containers/Freelancer/Dashboard';
import OfferActive from './containers/Freelancer/OfferActive';
import NewRequest from './containers/Freelancer/NewRequest';
import Requests from './containers/Freelancer/Requests';
import ViewRequest from './containers/Freelancer/ViewRequest';
import Availability from './containers/Freelancer/Availability';

import FindFreelancer from './containers/User/FindFreelancer';
import Profile2 from './containers/User/Profile';
import MyBookings from './containers/User/MyBookings';
import BookingList from './containers/User/BookingList';
import BookingDetail from './containers/User/BookingDetail';
import BookingMain from './containers/User/BookingMain';
import BookingComplete from './containers/User/BookingComplete';
import BookingRate from './containers/User/BookingRate';
import GetHelp from './containers/GetHelp';
import Terms from './containers/Terms';

import ControlPanel from './containers/Drawer'

Navigator.prototype.replaceWithAnimation = function (route) {
    const activeLength = this.state.presentedIndex + 1;
    const activeStack = this.state.routeStack.slice(0, activeLength);
    const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    const nextStack = activeStack.concat([route]);
    const destIndex = nextStack.length - 1;
    const nextSceneConfig = this.props.configureScene(route, nextStack);
    const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);

    const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
    this._emitWillFocus(nextStack[destIndex]);
    this.setState({
        routeStack: nextStack,
        sceneConfigStack: nextAnimationConfigStack,
    }, () => {
        this._enableScene(destIndex);
        this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
            this.immediatelyResetRouteStack(replacedStack);
        });
    });
};
export var globalNav = {};
class AppNavigator extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        globalNav.navigator = this._navigator;
        if(this.props.drawerState === 'opened')
            this.openDrawer();

        if(this.props.drawerState === 'closed')
            this.closeDrawer();
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this._navigator) {
                const routes = this._navigator.getCurrentRoutes();
                if (routes[routes.length - 1].id === 'login') {
                    return false;
                }
            }
            this.popRoute();
            return true;
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.drawerState === 'opened') {
            this.openDrawer();
        }
        if (this.props.drawerState === 'closed') {
            this._drawer.close()
        }
    }
    componentWillUnmount() {
        if (this.watchID !== null) {
            navigator.geolocation.clearWatch(this.watchID);
        }
    }
    openDrawer() {
        this._drawer.open();
    }
    openNavDrawer() {
        if (this.props.drawerState === 'closed') {
            this.props.openDrawer();
        }
    }
    closeDrawer() {
        if (this.props.drawerState === 'opened') {
            this.props.closeDrawer();
        }
    }
    popRoute() {
        this.props.popRoute();
    }
    renderScene(route, navigator) {
        switch (route.id) {
            case 'splash':
                return <Splash navigator={navigator} {...route.passProps} />;
            case 'login':
                return <Login navigator={navigator} {...route.passProps} />;
            case 'register':
                return <Register navigator={navigator} {...route.passProps} />;
            case 'registerpayment':
                return <RegisterPayment navigator={navigator} {...route.passProps} />;
            case 'registercredit':
                return <RegisterCredit navigator={navigator} {...route.passProps} />;
            case 'registerdone':
                return <RegisterDone navigator={navigator} {...route.passProps} />;
            case 'forgotpwd':
                return <ForgotPassword navigator={navigator} {...route.passProps} />;
            case 'resetdone':
                return <ResetDone navigator={navigator} {...route.passProps} />;
            case 'profile':
                return <Profile navigator={navigator} {...route.passProps} />;
            case 'products':
                return <Products navigator={navigator} {...route.passProps} />;
            case 'dashboard':
                return <Dashboard navigator={navigator} {...route.passProps} />;
            case 'offeractive':
                return <OfferActive navigator={navigator} {...route.passProps} />;
            case 'newrequest':
                return <NewRequest navigator={navigator} {...route.passProps} />;
            case 'requests':
                return <Requests navigator={navigator} {...route.passProps} />;
            case 'viewrequest':
                return <ViewRequest navigator={navigator} {...route.passProps} />;
            case 'messages':
                return <Messages navigator={navigator} {...route.passProps} />;
            case 'chat':
                return <Chat navigator={navigator} {...route.passProps} />;
            case 'takeitemphoto':
                return <TakeItemPhoto navigator={navigator} {...route.passProps} />;
            case 'availability':
                return <Availability navigator={navigator} {...route.passProps} />;

            case 'locationproperty':
                return <LocationProperty navigator={navigator} {...route.passProps} />;
            case 'locationdetail':
                return <LocationDetail navigator={navigator} {...route.passProps} />;
            case 'cropproperty':
                return <CropProperty navigator={navigator} {...route.passProps} />;
            case 'cropdetail':
                return <CropDetail navigator={navigator} {...route.passProps} />;
            case 'registerpayment2':
                return <RegisterPayment2 navigator={navigator} {...route.passProps} />;
            case 'registercredit2':
                return <RegisterCredit2 navigator={navigator} {...route.passProps} />;
            case 'resetdone2':
                return <ResetDone2 navigator={navigator} {...route.passProps} />;
            case 'findfreelancer':
                return <FindFreelancer navigator={navigator} {...route.passProps} />;
            case 'profile2':
                return <Profile2 navigator={navigator} {...route.passProps} />;
            case 'mybookings':
                return <MyBookings navigator={navigator} {...route.passProps} />;
            case 'bookinglist':
                return <BookingList navigator={navigator} {...route.passProps} />;
            case 'bookingdetail':
                return <BookingDetail navigator={navigator} {...route.passProps} />;
            case 'bookingmain':
                return <BookingMain navigator={navigator} {...route.passProps} />;
            case 'bookingcomplete':
                return <BookingComplete navigator={navigator} {...route.passProps} />;
            case 'bookingrate':
                return <BookingRate navigator={navigator} {...route.passProps} />;
            case 'gethelp':
                return <GetHelp navigator={navigator} {...route.passProps} />;
            case 'terms':
                return <Terms navigator={navigator} {...route.passProps} />;
            case 'home':
                return <Home navigator={navigator} {...route.passProps} />;
            default :
                return <Login navigator={navigator} {...route.passProps} />;
        }
    }
    render() {
        return (
            <Drawer
                ref={(ref) => { this._drawer = ref; }}
                type="overlay"
                tweenDuration={300}
                content={<ControlPanel navigator={this._navigator} />}
                tapToClose
                acceptPan={false}
                side="left"
                onClose={() => this.closeDrawer()}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={{
                    drawer: {
                        shadowColor: '#000000',
                        shadowOpacity: 0.8,
                        shadowRadius: 3,
                    },
                }}
                tweenHandler={(ratio) => {  //eslint-disable-line
                    return {
                        drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
                        main: {
                            opacity: (2 - ratio) / 2,
                        },
                        mainOverlay: {
                            right: 0,
                            opacity: ratio / 1.2,
                            backgroundColor: Colors.black,
                        },
                    };
                }}
                negotiatePan
            >
                <View style={{ flex: 1 }}>
                    <Navigator
                        ref={(ref) => { this._navigator = ref; }}
                        configureScene={(route) => {
                            const id = route.id;
                            if (id === 'splash' || id === 'login' || id === 'register' || id === 'forgotpwd' || id === 'home' || id === 'messages'
                                || id === 'dashboard' || id === 'profile' || id === 'newrequest'
                                || id === 'findfreelancer')
                                return Navigator.SceneConfigs.FadeAndroid;
                            else if (id === 'login') return Navigator.SceneConfigs.PushFromRight;
                            else if (id === 'register') return Navigator.SceneConfigs.FadeAndroid;
                            return Navigator.SceneConfigs.PushFromRight;
                        }}
                        initialRoute={{ id: (Platform.OS === 'android') ? 'splash' : 'splash' }}
                        renderScene={this.renderScene.bind(this)}
                    />
                </View>
            </Drawer>
        );
    }
}
AppNavigator.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        closeDrawer: () => dispatch(closeDrawer()),
        openDrawer: () => dispatch(openDrawer()),
    };
}

function mapStateToProps(state) {
    const { drawerState } = state.get('drawer');
    return { drawerState };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
