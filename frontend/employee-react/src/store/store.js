import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice/user.slice';

// // instead of createStore, we use configureStore
const store = configureStore({
    // // you don't have to use the combineReducers method anymore, just pass an object as your combined reducer
    reducer: {
        user: userReducer,
    },
    // // you don't have to use third-party libraries to enable Redux devTools anymore
    devTools: true,
    // // the getDefaultMiddleware function contains the thunk middleware, no need to rely on third-party libraries
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;