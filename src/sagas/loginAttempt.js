import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import Types from '@actions/actionTypes';
import api from '@api/api';
import store from 'react-native-simple-store';
import I18n from 'react-native-i18n';
import { loginSuccess, loginFailure } from '@actions/login';
import { Global } from '@theme';

const apis = api.create(Global.API_URL);

function* runLogin(action) {
    try {
        const {response, timeout} = yield race({
            response: call(apis.login, action.userinfo.user),
            timeout: call(delay, Global.connectTimeout)
        });
        if (!timeout) {
            if (response.ok) {
                store.save('token', response.data.token);
                store.save('type', response.data.type);
                store.save('email', action.userinfo.user.email);
                store.save('password', action.userinfo.user.password);
                yield put(loginSuccess(response.data));
            } else {
                switch (response.problem) {
                    case 'CLIENT_ERROR':
                    case 'SERVER_ERROR':
                        yield put(loginFailure(response.data.error));
                        break;
                    case 'NETWORK_ERROR':
                    case 'CONNECTION_ERROR':
                    case 'TIMEOUT_ERROR':
                        yield put(loginFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
                }
            }
        } else {
            yield put(loginFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
        }
    } catch (error) {
        console.log('error', error);
        yield put(loginFailure('error'));
    }
}

export function* loginAttempt() {
    yield takeLatest(Types.LOGIN_ATTEMPT, runLogin);
}
