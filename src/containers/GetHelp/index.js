import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, WebView } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from 'react-native-navbar';
import Spinner from '@components/OverlaySpinner';
import OverlaySpinner from '@components/OverlaySpinner';
import CommonWidgets from '@components/CommonWidgets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, Images, Colors, Fonts, Metrics, Icons } from '@theme/';
import { pushNewRoute, popRoute } from '@actions/route';
import { openDrawer } from '@actions/drawer';
import { setSpinnerVisible } from '@actions/globals';
import Constants from '@src/constants';
import styles from './styles';

class GetHelp extends Component {
    constructor(props) {
        super(props);
        this.state={
            spinnerVisible: false,
        }
    }
    componentWillMount() {
        this.setState({ spinnerVisible: true });
    }
    componentDidMount() {
        this.setState({ spinnerVisible: false });
    }
    render() {
        const leftButton = (
            <TouchableOpacity
                style={[Styles.center, Styles.navBarIcon]}
                onPress={() => this.props.openDrawer()}
            >
                <Icon name={'ios-menu'} size={25} style={{ color: Colors.white}}/>
            </TouchableOpacity>
        );

        let url = '';
        switch (this.props.type) {
            case 'facebook':
                url = 'https://www.facebook.com/stylenow.stylenow';
                break;
            case 'instagram':
                url = 'https://www.instagram.com/stylenowapp';
                break;
            default:
                break;
        }

        return (
            <View style={Styles.fullScreen}>
                {CommonWidgets.renderStatusBar(Colors.black)}
                <NavBar
                    containerStyle={Styles.navBarStyle}
                    statusBar={{style: 'light-content', tintColor: Colors.black }}
                    leftButton={leftButton}
                />
                <View backgroundColor={Colors.white} style={styles.container}>
                    <WebView
                        source={{uri: url}}
                    />
                </View>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}
GetHelp.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    pushNewRoute: React.PropTypes.func.isRequired,
    setSpinnerVisible: React.PropTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(GetHelp);
