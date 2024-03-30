// components/WeatherComponent.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherByLocation } from '../store/weatherSlice';
import { getLocation } from '../store/locationReducer';

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const weather = useSelector(state => state.weather.data);
  const status = useSelector(state => state.weather.status);
  const error = useSelector(state => state.weather.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWeatherByLocation());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (error) {
    const errorMessage = typeof error === 'object' ? error.message : error;
    return <Text>Error: {errorMessage}</Text>;
  }

  return (
    <ImageBackground
      source={require('../assets/1.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >

      <View style={styles.weatherContainer}>
        {weather && (
          <View>
            <Text style={styles.tempText}>{`${weather.main.temp}°`}</Text>
            <Text style={styles.cityText}>{weather.name}</Text>
            <Text style={styles.descriptionText}>{weather.weather[0].description}</Text>
          </View>
        )}
      </View>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Planning makes life more rhythmic!</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.0)', 
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
  weatherContainer: {
    padding: 120,
    backgroundColor: 'transparent', 
    alignItems: 'center',
    marginBottom: 2, 
  },
  tempText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  cityText: {
    fontSize: 24,
    fontWeight: '300',
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: '400',
  },
});
