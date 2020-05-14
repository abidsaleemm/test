import { combineReducers } from "redux";

import auth from "./auth";
import record from "./record";
import user from "./user";
import toast from "./toast";

export default combineReducers({
  auth,
  record,
  user,
  toast
});
