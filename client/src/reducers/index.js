import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import DashboardReducer from './DashboardReducer';
import history from '../store/history';

const appReducer = combineReducers({
  DashboardReducer,
  router: connectRouter(history),
});
const rootReducer = (state, action) => {
  return appReducer(state, action);
};
export default rootReducer;
