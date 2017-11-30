import React, {Component} from 'React';
import { ScrollView, View, TouchableOpacity, Text, Image } from 'react-native'
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Communications from 'react-native-communications';
import { replaceRoute, pushNewRoute } from '@actions/route';
import { closeDrawer } from '@actions/drawer';
import { setAvatar } from '@actions/globals';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { Metrics, Styles, Icons, Colors, Fonts, Images, Global } from '@theme/';
import styles from './styles';
import Constants from '@src/constants';
import Utils from '@src/utils';

class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state={
            avatarUrl: props.globals.avatar,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log("Drawer received nextProps.");
        if (this.state.avatarUrl !== nextProps.globals.avatar) {
            this.setState({avatarUrl: nextProps.globals.avatar});
        }
    }

    onGotoRoute(route, type) {
        // this.props.closeDrawer();
        // if (this.props.routes.routes.toString() === route) {
        //     return;
        // }
        // if (route === 'gethelp') {
        //     if (type === 'mail') {
        //         Communications.email([Constants.ownerEmail], null, null, 'Stylenow', null);
        //     } else if (type === 'phone') {
        //         Communications.phonecall(Constants.ownerPhoneNo, false);
        //     } else if (type === 'terms') {
        //         this.props.pushNewRoute('terms');
        //     } else {
        //         this.props.navigator.replace({
        //             id: route,
        //             passProps: {
        //                 type: type,
        //             },
        //         });
        //     }
        // } else {
        //     this.props.replaceRoute(route);
        // }
    }
    onActive() {
        // this.props.closeDrawer();
        // this.props.pushNewRoute('offeractive');
    }
    doLogout() {
        this.props.closeDrawer();
        this.props.pushNewRoute('login');
    }

    render() {
        const bodyAvatar =
            <View style={styles.headerView}>
                <View style={{flex: 3.5}}>
                    <TouchableOpacity onPress = {() => this.onActive()}>
                        <Image
                            style={[styles.avatarImage, {borderWidth: 0, marginLeft: Metrics.screenWidth * 0.25}]}
                            source={Images.imgMarketingIcon} />
                    </TouchableOpacity>
                    {/*<View style={styles.activeTextContainer}>*/}
                    {/*<Text style={styles.activeText}>*/}
                    {/*{I18n.t('INACTIVE')}*/}
                    {/*</Text>*/}
                    {/*</View>*/}
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.green, marginTop: 30, width: Metrics.screenWidth}}>
                        <Image source={Images.iconAvatar}/>

                        <Text style={[styles.headerText, {marginLeft: Metrics.screenWidth * 0.2, color: Colors.white}]}>
                            {"Marcos Machado"}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    {CommonWidgets.renderBackButton(() => this.props.closeDrawer())}
                </View>
            </View>;
        const bodyContent =
            <View style={styles.menuContainer}>

                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                {CommonWidgets.renderSpacer()}
                <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <TouchableOpacity onPress={() => this.onGotoRoute('gethelp', 'facebook')} style={{marginLeft: 0}}>
                            <Image style={styles.socialIcon} source={Icons.iconConfig}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.menuItemText, {flex: 3}]}>
                        {I18n.t('CONFIG')}
                    </Text>
                </View>
                {CommonWidgets.renderSpacer()}
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <TouchableOpacity onPress={() => this.doLogout()} style={{marginLeft: 0}}>
                            <Image style={styles.socialIcon} source={Icons.iconLogout}/>
                        </TouchableOpacity>
                    </View>
                        <Text style={[styles.menuItemText, {flex: 3}]}>
                            {I18n.t('LOGOUT')}
                        </Text>

                </View>
            </View>;
        return (
            <View style={styles.container}>
                {bodyAvatar}
                {bodyContent}
            </View>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        closeDrawer: () => dispatch(closeDrawer()),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    const routes = state.get('route');
    return { globals, routes };
}
export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
