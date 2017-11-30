
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    signedUp: false,
    attempting: false,
    error: null,
});

const attempt = (state, action) => ({
    ...state,
    attempting: true,
    signedUp: false,
    error: null,
});

const success = (state, action) => ({
    ...state,
    attempting: false,
    signedUp: true,
    error: action.message,
});

const failure = (state, action) => ({
    ...state,
    attempting: false,
    signedUp: false,
    error: action.error,
});

const actionHandlers = {
    [Types.SIGNUP_ATTEMPT]: attempt,
    [Types.SIGNUP_SUCCESS]: success,
    [Types.SIGNUP_FAILURE]: failure,
};

export default createReducer(initialState, actionHandlers);
