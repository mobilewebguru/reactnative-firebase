import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import Types from '@actions/actionTypes';
import api from '@api/api';
import { signupSuccess, signupFailure } from '@actions/signup';
import store from 'react-native-simple-store';
import I18n from 'react-native-i18n';
import { Global } from '@theme';

const apis = api.create(Global.API_URL);

function* runSignup(action) {
    try {
        const {response, timeout} = yield race({
            response: call(apis.signup, action.userinfo.user),
            timeout: call(delay, Global.connectTimeout)
        });
        if (!timeout) {
            if (response.ok) {
                store.save('email', action.userinfo.user.email);
                store.save('password', action.userinfo.user.password);
                yield put(signupSuccess(response.data.message));
            } else {
                switch (response.problem) {
                    case 'CLIENT_ERROR':
                    case 'SERVER_ERROR':
                        yield put(signupFailure(response.data.error));
                        break;
                    case 'NETWORK_ERROR':
                    case 'CONNECTION_ERROR':
                    case 'TIMEOUT_ERROR':
                        yield put(signupFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
                        break;
                }
            }
        } else {
            yield put(signupFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
        }
    } catch (error) {
        yield put(signupFailure(error));
    }
}

export function* signupAttempt() {
    yield takeLatest(Types.SIGNUP_ATTEMPT, runSignup);
}
