import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import I18n from 'react-native-i18n';
import api from '@api/api';
import { Global } from '@theme';
import Types from '@actions/actionTypes';
import { getNewRequestsSuccess, getNewRequestsFailure } from '@actions/get_new_requests';

const apis = api.create(Global.API_URL);

function* runGetNewRequests(action) {
    try {
        const {response, timeout} = yield race({
            response: call(apis.get_new_requests, action.params),
            timeout: call(delay, Global.connectTimeout)
        });
        console.log('response', response);
        if (!timeout) {
            if (response.ok) {
                yield put(getNewRequestsSuccess(response.data));
            } else {
                switch (response.problem) {
                    case 'CLIENT_ERROR':
                    case 'SERVER_ERROR':
                        yield put(getNewRequestsFailure(response.data.error));
                        break;
                    case 'NETWORK_ERROR':
                    case 'CONNECTION_ERROR':
                    case 'TIMEOUT_ERROR':
                        yield put(getNewRequestsFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
                        break;
                }
            }
        } else {
            yield put(getNewRequestsFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
        }
    } catch (error) {
        yield put(getNewRequestsFailure(error));
    }
}

export function* getNewRequestsAttempt() {
    yield takeLatest(Types.GET_NEW_REQUESTS_ATTEMPT, runGetNewRequests);
}
