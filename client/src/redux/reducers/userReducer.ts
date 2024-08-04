import { UserActions } from '../actions/userActions';

interface UserState {
  user: any;
}

const initialState: UserState = {
  user: null,
};

const userReducer = (state = initialState, action: UserActions) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export default userReducer;
