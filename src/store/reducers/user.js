import { handleActions } from "redux-actions";
import { map, set } from "lodash-es";
import { Success, Fail } from "utils/status";
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DEL_USER,
  GET_USER,
  SET_USER_PARAMS
} from "store/constants";

const initialState = {
  users: [],
  user: null,
  count: 0,
  params: {
    page: 1,
    limit: 5
  },
  error: ""
};

export default handleActions(
  {
    [SET_USER_PARAMS]: (state, { payload }) => ({
      ...state,
      params: {
        ...state.params,
        ...payload
      }
    }),
    [Success(GET_USERS)]: (state, { payload }) => ({
      ...state,
      users: payload.users,
      count: payload.count,
      error: null
    }),
    [Fail(GET_USERS)]: (state, { payload }) => ({
      ...state,
      error: payload.data
    }),
    [Success(CREATE_USER)]: (state, { payload }) => ({
      ...state,
      user: payload,
      error: null
    }),
    [Fail(CREATE_USER)]: (state, { payload }) => {
      return {
        ...state,
        error: payload.data,
        user: null
      };
    },
    [Success(UPDATE_USER)]: (state, { payload }) => {
      const updatedIdx = map(state.users, "_id").indexOf(payload["_id"]);
      const newState = Object.assign({}, state);
      set(newState, `users.${updatedIdx}`, payload);

      return {
        ...newState,
        user: payload,
        error: null
      };
    },
    [Fail(UPDATE_USER)]: (state, { payload }) => {
      return {
        ...state,
        error: payload.data
      };
    },
    [Success(GET_USER)]: (state, { payload }) => {
      return {
        ...state,
        user: payload,
        error: null
      };
    },
    [Fail(GET_USER)]: (state, { payload }) => {
      return {
        ...state,
        error: payload.data
      };
    },
    [Success(DEL_USER)]: state => {
      return {
        ...state,
        error: null
      };
    },
    [Fail(DEL_USER)]: (state, { payload }) => {
      return {
        ...state,
        error: payload.data
      };
    }
  },
  initialState
);
