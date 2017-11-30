import { race, put, call, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import I18n from 'react-native-i18n';
import api from '@api/api';
import { Global } from '@theme';
import Types from '@actions/actionTypes';
import { getRatingsSuccess, getRatingsFailure } from '@actions/get_ratings';

const apis = api.create(Global.API_URL);

function* runGetRatings(action) {
    try {
        const {response, timeout} = yield race({
            response: call(apis.get_ratings, action.params),
            timeout: call(delay, Global.connectTimeout)
        });
        console.log('response', response);
        if (!timeout) {
            if (response.ok) {
                yield put(getRatingsSuccess(response.data));
            } else {
                switch (response.problem) {
                    case 'CLIENT_ERROR':
                    case 'SERVER_ERROR':
                        yield put(getRatingsFailure(response.data.error));
                        break;
                    case 'NETWORK_ERROR':
                    case 'CONNECTION_ERROR':
                    case 'TIMEOUT_ERROR':
                        yield put(getRatingsFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
                        break;
                }
            }
        } else {
            yield put(getRatingsFailure({message: I18n.t('NO_SERVER_CONNECTION')}));
        }
    } catch (error) {
        yield put(getRatingsFailure(error));
    }
}

export function* getRatingsAttempt() {
    yield takeLatest(Types.GET_RATINGS_ATTEMPT, runGetRatings);
}
