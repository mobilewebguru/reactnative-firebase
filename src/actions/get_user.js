import Types from './actionTypes';

export const getUserAttempt = params =>
    ({ type: Types.GET_USER_ATTEMPT, params });
export const getUserSuccess = message =>
    ({ type: Types.GET_USER_SUCCESS, message });
export const getUserFailure = error =>
    ({ type: Types.GET_USER_FAILURE, error });
