import {SCHEDULE_MATCH, DELETE_MATCH, UPDATE_MATCH} from './actions';

const initialState = {
  matchData: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULE_MATCH:
      return {
        ...state,
        type: action.type,
        matchData: [action.payload, ...state.matchData],
      };
    case DELETE_MATCH:
      return {
        ...state,
        matchData: [
          ...state.matchData.filter(data => data.id !== action.payload),
        ],
      };
    case UPDATE_MATCH:
      return {
        ...state,
        matchData: [
          ...state.matchData.map(data => {
            if (data.id === action.payload.id) {
              return action.payload.data;
            } else {
              return data;
            }
          }),
        ],
      };
    default:
      return state;
  }
};
