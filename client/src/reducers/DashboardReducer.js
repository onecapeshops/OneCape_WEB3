/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import assign from 'lodash/assign';
import * as types from '../constants/actionTypes';

const initialState = {
  nftData: []
};

export default function DashboardReducer(state = initialState, action) {
  switch (action.type) {
    case types.NFT_DATA: {
      return assign({}, state, {
        nftData: action.nftData
      });
    }
    default:
      return state;
  }
}
