// Initial state: No user is logged in
export const initialState = null;

// Reducer function to handle login/logout and other user actions
export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;

    case "CLEAR":
      return null;

    case "UPDATE_PIC":
      return {
        ...state,
        pic: action.payload
      };

    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following
      };

    default:
      return state;
  }
};
