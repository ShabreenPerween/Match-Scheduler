export const SCHEDULE_MATCH = 'SCHEDULE_MATCH';
export const DELETE_MATCH = 'DELETE_MATCH';
export const UPDATE_MATCH = 'UPDATE_MATCH';

export const scheduleMatch = data => {
  return {
    type: SCHEDULE_MATCH,
    payload: data,
  };
};

export const deleteMatch = id => {
  return {
    type: DELETE_MATCH,
    payload: id,
  };
};

export const updateMatch = (data, id) => {
  return {
    type: UPDATE_MATCH,
    payload: {data, id},
  };
};
