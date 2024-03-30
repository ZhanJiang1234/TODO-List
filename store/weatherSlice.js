// store/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as Location from 'expo-location';
const API_KEY = 'f7ff4100e0bc7448bf1e46e3666a038f';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

// 定义一个单独的 thunk 用于获取天气数据
export const fetchWeather = createAsyncThunk(
    'weather/fetchWeather',
    async ({ lat, lon }, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  // 定义一个 thunk 用于请求位置权限和获取用户的位置，然后获取天气数据
  export const fetchWeatherByLocation = createAsyncThunk(
    'weather/fetchWeatherByLocation',
    async (_, { dispatch, rejectWithValue }) => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return rejectWithValue('Permission to access location was denied');
        }
  
        let location = await Location.getCurrentPositionAsync({});
        return dispatch(fetchWeather({
          lat: location.coords.latitude,
          lon: location.coords.longitude
        }));
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  const initialState = {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  };
  
  const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchWeather.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchWeather.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
        })
        .addCase(fetchWeather.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload ? action.payload : "Failed to fetch weather data";
        });
    },
  });
  
  export default weatherSlice.reducer;