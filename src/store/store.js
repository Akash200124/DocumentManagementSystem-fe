import { configureStore } from '@reduxjs/toolkit'
import  userReducer from './userSlice'


import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage, // LocalStorage (you can use sessionStorage or others)
  whitelist: ['user'], // Only persist user slice (you can add other slices)
};

const rootReducer = combineReducers({
  user: userReducer, // Combine all your reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});


// without presisitor
// export default configureStore({
//   reducer: {
//     user: userReducer,
//   },
// })


const persistor = persistStore(store);

export { store, persistor };
