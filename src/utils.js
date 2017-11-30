import I18n from 'react-native-i18n';
import { Metrics, Styles, Images, Colors, Fonts, Global } from '@theme/';
import { Platform, ToastAndroid, Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import { RNS3 } from 'react-native-aws3';
import Moment from 'moment';
import moment from 'moment-timezone'
import constants from "./constants";

const Utils = {
    getUri(uriString) {
        let retUri;
        if (Platform.OS === 'android') {
            retUri = { uri: uriString, isStatic: true };
        } else {
            retUri = { uri: uriString.replace('file://', ''), isStatic: true };
        }
        return retUri.uri;
    },
    getTextInputBorderColor(state) {
        return state ? Colors.borderFocused : Colors.borderSecondary;
    },
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    clone(obj) {
        if (obj == null || typeof obj !== 'object') return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    getFullName(firstName, lastName) {
        return firstName + ' ' + lastName
    },
    getTimezoneOffset() {
        return new Date().getTimezoneOffset() / 60;
    },
    revertFromUTC(time, minOffset = 0) {
        return moment.tz(time, 'UTC').add(minOffset, 'minutes').utcOffset(-this.getTimezoneOffset());
    },
    getFormattedTime(date, hour) {
        return Moment(date).format('YYYY-MM-DD ') + (hour < 10 ? '0' : '') + hour + ':00:00'
    },
    getStringFromDate(date) {
        const month = (date.getMonth() + 1);
        const day = date.getDate();
        const year = date.getFullYear();
        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;
        return day + '/' + month + '/' + year;
    },
    getAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    todayOrYesterday(date) {
        const today = new Date();
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
        if (isToday) return 0;
        if (isYesterday) return 1;
        return 2;
    },
    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    },
    uploadImage(s3Folder, imgFile) {
        const options = {
            keyPrefix: s3Folder + "/",
            bucket: "photouploadsapplaunch",
            region: "eu-central-1",
            accessKey: "AKIAJY7ZBLHN67RN4G3A",
            secretKey: "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",
            successActionStatus: 201,
        };
        const file = {
            uri: imgFile,
            name: new Date().getTime() + ".png",
            type: "image/png"
        };
        RNS3.put(file, options).then(response => {
            if (response.status !== 201) {
                alert ("Failed to upload image to S3");
                return null;
            }
            else {
                return (response.body.postResponse.location);
            }
        });
    },
    toast(message) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Toast.show(message);
        }
    },
    updateLocation(location, user, onUpdate) {
        if (Global.token && Global.userType === 'freelancer' && user.latitude) {
            let registeredCoord = {
                latitude: user.latitude,
                longitude: user.longitude
            };
            let distance = geolib.getDistanceSimple(registeredCoord, location.coords);
            // console.log('location updated\n' + 'original: (' + Global.currentCoord.latitude + ', ' + Global.currentCoord.longitude + ')\n' +
            //     'new: (' + location.coords.latitude + ', ' + location.coords.longitude + ')\n' +
            //     'distance: ' + distance);
            // alert(JSON.stringify(location));
            // Utils.toast('distance: '  + distance);
            if (distance > 1000) {
                Alert.alert(
                    I18n.t('APP_NAME'),
                    I18n.t('ALERT_LOCATION_WARNING'),
                    [
                        { text: I18n.t('NO'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: I18n.t('YES'), onPress: () => this.doUpdateLocation(onUpdate) },
                    ]);
            }
        }
        Global.currentCoord = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    },
    doUpdateLocation(onUpdate) {
        let isOK;
        fetch(Global.API_URL + '/update_location', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                token: Global.token,
                coord: Global.currentCoord
            }),
        }).then((response) => {
            console.log('response', response);
            isOK = response.ok;
            return response.json();
        }).then((responseData) => {
            console.log('responseData', responseData);
            if (isOK) {
                onUpdate();
                alert(I18n.t('LOCATION_UPDATE_SUCCESS'));
            } else {
                if (responseData.error.message.includes('Token')) {
                    Alert.alert(
                        I18n.t('AUTHENTICATION'),
                        responseData.error.message,
                        [{
                            text: I18n.t('OK'), onPress: () => {
                            }
                        }],
                        {cancelable: false}
                    );
                }
            }
        }).catch((error) => {
            console.log('error', error);
        }).done();
    },
    getRevealCostIndex(potential) {
        for (let i = 0; i < constants.IN_APP_PRODUCT.length; i ++) {
            let item = constants.IN_APP_PRODUCT[i];
            if (potential >= item.from && (item.to < 0 || potential <= item.to)) {
                return i;
            }
        }
        return 0;
    },
};

export default Utils;
