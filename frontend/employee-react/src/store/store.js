import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice/user.slice';
import documentReducer from './documentSlice/documentSlice';
import AuthReducer from "./AuthSlice/auth.slice";
import employeeReducer from "./employeeSlice/employee.slice";

// // instead of createStore, we use configureStore
const store = configureStore({
  // // you don't have to use the combineReducers method anymore, just pass an object as your combined reducer
  reducer: {
    auth: AuthReducer,
    employee: employeeReducer,
    user: userReducer,
    documents: documentReducer,
  },
  // // you don't have to use third-party libraries to enable Redux devTools anymore
  devTools: true,
  // // the getDefaultMiddleware function contains the thunk middleware, no need to rely on third-party libraries
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
