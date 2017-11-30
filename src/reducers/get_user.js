import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    attempting: false,
    isOK: false,
    data: null,
});

const attempt = (state, action) => ({
    ...state,
    attempting: true,
    isOK: false,
    data: null,
});

const success = (state, action) => ({
    ...state,
    attempting: false,
    isOK: true,
    data: action.message,
});

const failure = (state, action) => ({
    ...state,
    attempting: false,
    isOK: false,
    data: action.error,
});

const actionHandlers = {
    [Types.GET_USER_ATTEMPT]: attempt,
    [Types.GET_USER_SUCCESS]: success,
    [Types.GET_USER_FAILURE]: failure,
};

export default createReducer(initialState, actionHandlers);
