import Types from '@actions/actionTypes';

export type State = {
    drawerState: string,
    drawerDisabled: boolean
}
const initialState = {
  drawerState: 'closed',
  drawerDisabled: true,
};
export default function (state:State = initialState, action): State {
  if (action.type === Types.OPEN_DRAWER) {
    return {
      ...state,
      drawerState: 'opened',
    };
  }
  if (action.type === Types.CLOSE_DRAWER) {
    return {
      ...state,
      drawerState: 'closed',
    };
  }
  return state;
}
