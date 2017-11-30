import React, { PropTypes } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';
import { Images } from '@theme/';
import Constants from '@src/constants';
import styles from './styles';
import Global from "../../theme/Global";

class CustomCallout extends React.Component {

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.bubble}>
                    <View style={styles.amount}>
                        <View style={styles.topView}>
                            <Image source={this.props.image ? {uri: this.props.image} : Images.imgAvatarPlaceholder} style={styles.avatarStyle}/>
                            <View style={{ alignItems: 'center'}}>
                                <Text style={styles.nameText}>{this.props.name}</Text>
                                <View style={{marginTop: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                    {this.props.skill.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                source={Images.imgSkillIcons[item.category_id - 1]}
                                                style={[styles.skillBtnIcon, {resizeMode: Platform.OS === 'android' ? 'cover' : 'contain'}]}/>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={[styles.bottomView, {marginTop: 0}]}>
                            <View style={{flex: 1}}/>
                            <View style={[styles.bottomView, {flex: 4}]}>
                                <StarRating
                                    disabled
                                    starColor={'white'}
                                    buttonStyle={{ marginLeft: 0 }}
                                    maxStars={5}
                                    starSize={9}
                                    rating={this.props.rating}/>
                                <Text style={[styles.scoreText]}>{this.props.rating}</Text>
                            </View>
                            <View style={{flex: 1}}/>
                            {/*<View style={styles.eyeContainer}>*/}
                                {/*<View style={styles.eyeImage}>*/}
                                    {/*<Icon style={styles.iconStyle} name={'md-eye'}/>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        </View>
                    </View>
                </View>
                <View style={styles.arrowBorder} />
            </View>
        );
    }
}
module.exports = CustomCallout;
