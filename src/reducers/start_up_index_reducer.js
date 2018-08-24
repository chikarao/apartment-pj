import { START_UP_INDEX } from '../actions/types';

const initialState = {
  startUpCount: 0
};

export default function (state = initialState, action) {
  // console.log('in start up index reducer, action.payload: ', action.payload);
  switch (action.type) {
    case START_UP_INDEX:
    // console.log('in start up index reducer, START_UP_INDEX: ');

      return {
        startUpCount: state.startUpCount + 1
      };
    default:
      return state;
  }
}
