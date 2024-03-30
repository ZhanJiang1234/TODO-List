import * as Location from 'expo-location';
const initialState = {
    location: null,
    error: null,
  };
  
  const GET_LOCATION = 'GET_LOCATION';
  const SET_ERROR = 'SET_ERROR';
  
  export const getLocation = () => async (dispatch) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dispatch({ type: SET_ERROR, payload: 'Permission to access location was denied' });
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      dispatch({ type: GET_LOCATION, payload: location });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };
  
  export default function locationReducer(state = initialState, action) {
    switch (action.type) {
      case GET_LOCATION:
        return { ...state, location: action.payload };
      case SET_ERROR:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  }
  