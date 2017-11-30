import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
    spinnerVisible: false,
    coord: null,//search location for user

    user: {},
    products: [],
    jobs: [],
    bookings: [],
    reviews_cnt: 0,

    avatar: 'https://s3.eu-central-1.amazonaws.com/photouploadsapplaunch/profiles/avatar.png',
});

//for background process
const setSpinnerVisible = (state, action) => ({
    ...state,
    spinnerVisible: action.spinnerVisible,
});
//for finding location
const setLocation = (state, action) => ({
    ...state,
    coord: action.coord,
});

const setUser = (state, action) => ({
    ...state,
    user: action.user,
});
//for freelancer
const setProducts = (state, action) => ({
    ...state,
    products: action.products,
});
const setJobs = (state, action) => ({
    ...state,
    jobs: action.jobs,
});
//for user
const setBookings = (state, action) => ({
    ...state,
    bookings: action.bookings,
});
//for Drawer Menu
const setAvatar = (state, action) => ({
    ...state,
    avatar: action.avatar,
});

const actionHandlers = {
    [Types.SET_SPINNER_VISIBLE]: setSpinnerVisible,
    [Types.SET_LOCATION]: setLocation,

    [Types.SET_USER]: setUser,
    [Types.SET_PRODUCTS]: setProducts,
    [Types.SET_JOBS]: setJobs,
    [Types.SET_BOOKINGS]: setBookings,

    [Types.SET_AVATAR]: setAvatar,
};

export default createReducer(initialState, actionHandlers);
