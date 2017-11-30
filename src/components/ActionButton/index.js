import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Constants from '@src/constants';
import { Styles, Metrics, Colors, Fonts, Images, Global } from '@theme/';
import styles from './styles';
import Utils from '@src/utils';

class ActionButton extends Component {

    constructor(props) {
        super(props);
        this.state={
            extendVisible: false,
            key: 0
        };
    }

    onClickSkillBtn(key) {
        this.setState({ extendVisible: false, key: key });
        this.props.onSkillClick(key);
    }

    render() {
        const mainView =
            (<TouchableOpacity
                style={[this.props.mainBtnStyle, styles.mainBtnStyle]}
                onPress={() => this.setState({ extendVisible: !this.state.extendVisible })}>
                {
                    !this.state.extendVisible ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.mainBtnText}>{this.state.key === 0 ? I18n.t('WHAT_ARE_YOU_LOOKING') : Global.categories[this.state.key - 1].name}</Text>
                            <Icon size={30} name='md-arrow-dropdown'/>
                        </View>
                    ) : (
                        <Icon size={30} name='md-arrow-dropup'/>
                    )
                }
            </TouchableOpacity>);

        return (
            <View style={styles.container}>
                {mainView}
                {!this.state.extendVisible ?
                    (<View/>) : (
                        Global.categories.map((item) => {
                            return (
                                <View key={item.id} style={{ alignItems: 'center', width: Metrics.screenWidth * 0.8 }}>
                                    <View style={styles.pointDot}/>
                                    <TouchableOpacity
                                        style={styles.skillBtn}
                                        onPress={() => this.onClickSkillBtn(item.id)}>
                                        <View/>
                                        <Text style={styles.skillText}>
                                            {item.name}
                                        </Text>
                                        <View>
                                            <Image source={Images.imgSkillIcons[item.id - 1]} style={styles.skillBtnIcon}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    )
                }
            </View>
        );
    }
}
export default ActionButton;
