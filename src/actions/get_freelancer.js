import Types from './actionTypes';

export const getFreelancerAttempt = params =>
    ({ type: Types.GET_FREELANCER_ATTEMPT, params });
export const getFreelancerSuccess = message =>
    ({ type: Types.GET_FREELANCER_SUCCESS, message });
export const getFreelancerFailure = error =>
    ({ type: Types.GET_FREELANCER_FAILURE, error });
