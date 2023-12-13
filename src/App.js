import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import ScheduleMatch from './screens/ScheduleMatch';
import {Provider} from 'react-redux';
import {store} from './redux/store';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="App"
            component={Home}
            options={{
              title: 'Match Scheduling',
              headerTintColor: '#000',
              headerStyle: {backgroundColor: '#f5edfb'},
            }}
          />
          <Stack.Screen
            name="ScheduleMatch"
            component={ScheduleMatch}
            options={{
              title: 'Schedule New Match',
              headerTintColor: '#000',
              headerStyle: {backgroundColor: '#f5edfb'},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
