import Types from './actionTypes';

export const getNewRequestsAttempt = params =>
    ({ type: Types.GET_NEW_REQUESTS_ATTEMPT, params });
export const getNewRequestsSuccess = message =>
    ({ type: Types.GET_NEW_REQUESTS_SUCCESS, message });
export const getNewRequestsFailure = error =>
    ({ type: Types.GET_NEW_REQUESTS_FAILURE, error });
