import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationReducer';
import weatherReducer from './weatherSlice';
import todosReducer from './todosSlice';
export default function makeStore() {
  return configureStore({
    reducer: {
      location: locationReducer,
      weather: weatherReducer,
      todos: todosReducer,
    },
  });
}
