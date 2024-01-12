import { combineReducers } from "redux";
import reducer from "./userReducer";
import select from "./select"


const rootReducer = combineReducers({
  login: reducer,
  select,
});

export default rootReducer;
