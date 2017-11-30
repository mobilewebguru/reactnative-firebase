import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import Store from 'react-native-simple-store';
import sagas from './sagas';
import '@i18n/I18n';
import { Global } from '@theme/';
import AppNavigator from './AppNavigator';
import configureStore from './configureStore';
import Utils from "./utils";

const store = configureStore();
sagas.forEach(saga => store.runSaga(saga));

function setup() {
    class Root extends Component {

        constructor(props) {
            super(props);
        }

        componentWillMount() {
            // Store.get(['token', 'device']).then((response) => {
            //     console.log('[token, device]', response);
            //     if (response[0] !== null) {
            //         Global.token = response[0];
            //             if (response[1] !== null) {
            //                 Global.device = response[1];
            //
            //             }
            //     }
            // }).catch((error) => {
            //     console.log(error);
            // });

            OneSignal.addEventListener('received', this.onReceived);
            OneSignal.addEventListener('opened', this.onOpened);
            OneSignal.addEventListener('registered', this.onRegistered);
            OneSignal.addEventListener('ids', this.onIds);
            const permissions = {
                alert: true,
                badge: true,
                sound: true,
            };
            OneSignal.configure({
                
            });
            OneSignal.inFocusDisplaying(2);
            if (Platform.OS === 'ios') OneSignal.requestPermissions(permissions);
        }

        componentWillUnmount() {
            OneSignal.removeEventListener('received', this.onReceived);
            OneSignal.removeEventListener('opened', this.onOpened);
            OneSignal.removeEventListener('registered', this.onRegistered);
            OneSignal.removeEventListener('ids', this.onIds);
        }

        onReceived(notification) {
            console.log(notification.payload);
            if (notification.isAppInFocus) {
                console.log('isAppInFocus = true')
            } else {
                console.log('isAppInFocus = false')
            }
        }

        onOpened(openResult) {
            Utils.toast('opened with notification');
            console.log('Message: ', openResult.notification.payload.body);
            console.log('Data: ', openResult.notification.payload.additionalData);
            console.log('isActive: ', openResult.notification.isAppInFocus);
            console.log('openResult: ', openResult);
        }

        onRegistered(notifData) {
            console.log("Device had been registered for push notifications!", notifData);
        }

        onIds(device) {
            console.log('Device info: ', device);
            Store.save('device', device);

            // let isOK;
            // fetch(Global.API_URL + '/auth/set_device', {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     method: 'POST',
            //     body: JSON.stringify({
            //         token: Global.token,
            //         device: device
            //     }),
            // }).then((response) => {
            //     console.log('response', response);
            //     isOK = response.ok;
            //     return response.json();
            // }).then((responseData) => {
            //     console.log('responseData', responseData);
            //     if (isOK) {
            //         Store.save('device', device);
            //     } else {
            //         if (responseData.error.message.includes('Token')) {
            //             console.log(responseData.error.message);
            //         }
            //     }
            // }).catch((error) => {
            //     console.log('error', error);
            // }).done();
        }


        render() {
            return (
                <Provider store={store}>
                    <AppNavigator />
                </Provider>
            );
        }
    }

    return Root;
}

export default setup;
