import Types from './actionTypes';

export const getRatingsAttempt = params =>
    ({ type: Types.GET_RATINGS_ATTEMPT, params });
export const getRatingsSuccess = message =>
    ({ type: Types.GET_RATINGS_SUCCESS, message });
export const getRatingsFailure = error =>
    ({ type: Types.GET_RATINGS_FAILURE, error });
