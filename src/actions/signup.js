import Types from './actionTypes';

export const signupAttempt = userinfo =>
    ({ type: Types.SIGNUP_ATTEMPT, userinfo });
export const signupSuccess = message =>
    ({ type: Types.SIGNUP_SUCCESS, message });
export const signupFailure = error =>
    ({ type: Types.SIGNUP_FAILURE, error });
