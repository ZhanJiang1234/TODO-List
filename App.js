import React from 'react';
import { Provider } from 'react-redux';
import makeStore from './store/configureStore';
import WeatherComponent from './components/WeatherComponent';
import { StyleSheet, View } from 'react-native';
import MapComponent from './components/MapComponent';
import TodosComponent from './components/TodosComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
const store = makeStore();
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={WeatherComponent} />
          <Tab.Screen name="TODO List" component={TodosComponent} />
          <Tab.Screen name="Location" component={MapComponent} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 44, 
  },
});
