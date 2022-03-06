import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChooseScreen from './AuthStackScreen/ChooseScreen';
import CreateEventScreen from './AuthStackScreen/CreateEventScreen';
import JoinEventScreen from './AuthStackScreen/JoinEventScreen';

const CreateEventStack = createStackNavigator();

export default function CreateEventStackScreen({
  navigation,
}: {
  navigation: any;
}) {
  return (
    <CreateEventStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ChooseScreen"
    >
      <CreateEventStack.Screen name="ChooseScreen" component={ChooseScreen} />
      <CreateEventStack.Screen
        name="CreateEventScreen"
        component={CreateEventScreen}
      />
      <CreateEventStack.Screen
        name="JoinEventScreen"
        component={JoinEventScreen}
      />
    </CreateEventStack.Navigator>
  );
}
