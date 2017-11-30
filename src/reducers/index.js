import { combineReducers } from 'redux-immutable';
import globals from './globals';
import route from './route';
import drawer from './drawer';

import login from './login';
import signup from './signup';
import get_user from './get_user';
import get_new_requests from './get_new_requests';
import get_freelancer from './get_freelancer';
import get_ratings from './get_ratings';

const applicationReducers = {
    globals,
    route,
    drawer,

    login,
    signup,
    get_user,
    get_new_requests,
    get_freelancer,
    get_ratings,
};

export default function createReducer() {
    return combineReducers(applicationReducers);
}
