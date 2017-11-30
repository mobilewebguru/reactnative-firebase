import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import CommonWidgets from '@components/CommonWidgets';
import { Styles, Colors, Fonts, Global, Images } from '@theme/';
import { replaceRoute } from '@actions/route';
import styles from './styles';

class Home extends Component {

    onGotoLogin() {
        Global.userType = 'freelancer';
        this.props.replaceRoute('login');
    }
    onGotoRegister() {
        Global.userType = 'client';
        // this.props.replaceRoute('login');
        this.props.replaceRoute('register');

    }

    render() {
        return (
            <View style={[Styles.fullScreen, { backgroundColor: Colors.red, alignItems: 'center' }]}>
                {CommonWidgets.renderStatusBar(Colors.black, false)}
                <Image
                    source={Images.bkgSplash}
                    resizeMode={'cover'}
                    style={[Styles.fullScreen, {position: 'absolute'}]}>
                </Image>
                <View style={[Styles.fullScreen, Styles.center, { position: 'absolute'}]}>
                    {CommonWidgets.renderLogo()}
                </View>
                <View style={[Styles.center, { flex: 1}]}>
                </View>
                <View style={[Styles.center, { flex: 1}]}>
                    <TouchableOpacity style={styles.button} onPress={() => this.onGotoLogin()}>
                        <Text style={[Fonts.style.h5, { color: Colors.white }]}>
                            {I18n.t('LOGIN')}
                        </Text>
                    </TouchableOpacity>
                    {CommonWidgets.renderSpacer()}
                    {CommonWidgets.renderSpacer()}
                    <TouchableOpacity onPress={() => this.onGotoRegister()}>
                        <Text style={[Fonts.style.h4, { color: Colors.textThird }]}>
                            {I18n.t('CREATE')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

Home.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        replaceRoute: route => dispatch(replaceRoute(route)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
