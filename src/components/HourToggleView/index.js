import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { View, Text, TouchableOpacity, Button, Platform } from 'react-native';
import { Styles, Metrics, Colors } from '@theme/';
import styles from './styles';

const selectedColor = Colors.calendarItem/*'#CC5B57'*/;
const unSelectedColor = Colors.calendarItem;

class HourToggleView extends Component {

    hourButton(item, index) {
        const border_width = this.props.selectedHour === index ? 2 : 0;
        return(
            <TouchableOpacity
                key={index}
                onPress={() => this.props.onPress(index)}>
                <View style={[styles.itemView,
                    { backgroundColor: item === 0 ? selectedColor : unSelectedColor, borderWidth: border_width }]}>
                    <Text style={{ backgroundColor: 'transparent', color: Colors.textThird }}>
                        {index + ':00'}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    {this.props.hour.slice(0, 5).map((item, index) =>(
                        this.hourButton(item, index)
                    ))}
                </View>
                <View style={styles.itemContainer}>
                    {this.props.hour.slice(5, 10).map((item, index) =>(
                        this.hourButton(item, index + 5)
                    ))}
                </View>
                <View style={styles.itemContainer}>
                    {this.props.hour.slice(10, 15).map((item, index) =>(
                        this.hourButton(item, index + 10)
                    ))}
                </View>
                <View style={styles.itemContainer}>
                    {this.props.hour.slice(15, 20).map((item, index) =>(
                        this.hourButton(item, index + 15)
                    ))}
                </View>
                <View style={styles.itemContainer}>
                    {this.props.hour.slice(20, 25).map((item, index) =>(
                        this.hourButton(item, index + 20)
                    ))}
                    <View style={styles.itemView}/>
                </View>
            </View>
        );
    }
}

export default HourToggleView;
