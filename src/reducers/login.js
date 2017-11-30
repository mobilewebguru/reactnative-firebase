
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    loggedIn: false,
    attempting: false,
    error: null,
    data: null,
});

const attempt = (state, action) => ({
    ...state,
    loggedIn: false,
    attempting: true,
    error: null,
    data: null,
});

const success = (state, action) => ({
    ...state,
    loggedIn: true,
    attempting: false,
    error: null,
    data: action.token,
});

const failure = (state, action) => ({
    ...state,
    loggedIn: false,
    attempting: false,
    error: action.error,
    data: null,
});

// map our types to our handlers
const actionHandlers = {
    [Types.LOGIN_ATTEMPT]: attempt,
    [Types.LOGIN_SUCCESS]: success,
    [Types.LOGIN_FAILURE]: failure,
};

export default createReducer(initialState, actionHandlers);
