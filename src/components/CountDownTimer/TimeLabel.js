import React, {Component} from 'react'
import {
    Text,
    View,
} from 'react-native';

export default class TimeLabel extends Component {
    render() {
        return (
            <View>
                <Text style={this.props.style}>
                    {this.props.minutes} : {this.props.seconds}
                </Text>
            </View>
        )
    }
}