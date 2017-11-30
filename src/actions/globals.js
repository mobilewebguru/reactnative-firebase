import Types from './actionTypes';

export const setSpinnerVisible = spinnerVisible =>
    ({ type: Types.SET_SPINNER_VISIBLE, spinnerVisible });
export const setLocation = coord =>
    ({ type: Types.SET_LOCATION, coord });

export const setUser = user =>
    ({ type: Types.SET_USER, user });
export const setProducts = products =>
    ({ type: Types.SET_PRODUCTS, products });
export const setJobs = jobs =>
    ({ type: Types.SET_JOBS, jobs });
export const setBookings = bookings =>
    ({ type: Types.SET_BOOKINGS, bookings });

export const setAvatar = avatar =>
    ({ type: Types.SET_AVATAR, avatar });
