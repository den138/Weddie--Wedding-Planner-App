/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styles } from './style';
import ModalScreen from './src/screens/TabScreen/ModalScreen';
import LoadingScreen from './src/screens/AuthStackScreen/LoadingScreen';
import { Provider } from 'react-redux';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { store } from './src/redux/store';
import { AddMaterialItem } from './src/components/CreateStackScreen/AddMaterialItem';
import { EditMaterialItem } from './src/components/EditStackScreen/EditMaterialItem';
import { EditBudgetItem } from './src/components/EditStackScreen/EditBudgetItem';
import { AddBudgetItem } from './src/components/CreateStackScreen/AddBudgetItem';
import { AddParti } from './src/components/CreateStackScreen/AddParti';
import { EditParti } from './src/components/EditStackScreen/EditParti';
import { AddGuest } from './src/components/CreateStackScreen/AddGuest';
import { EditGuest } from './src/components/EditStackScreen/EditGuest';
import AuthStackScreen from './src/screens/AuthStackScreen';
import TabScreen from './src/screens/TabScreen';
import { AddTodoItem } from './src/components/CreateStackScreen/AddTodoItem';
import { EditTodoItem } from './src/components/EditStackScreen/EditTodoItem';
import { SelectEvent } from './src/components/EditStackScreen/SelectEvent';
import { QueryClient, QueryClientProvider } from 'react-query';
import CreateEventStackScreen from './src/screens/CreateEventStackScreen';
import { EditRundown } from './src/components/EditStackScreen/EditRundown';
import { AddRundown } from './src/components/CreateStackScreen/AddRundown';
import { AddMessage } from './src/components/CreateStackScreen/AddMessage';

// this is for create items

const CreateStack = createStackNavigator();

function CreateStackScreen() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="AddMaterialItem" component={AddMaterialItem} />
      <CreateStack.Screen name="AddBudgetItem" component={AddBudgetItem} />
      <CreateStack.Screen name="AddParti" component={AddParti} />
      <CreateStack.Screen name="AddGuest" component={AddGuest} />
      <CreateStack.Screen name="AddTodoItem" component={AddTodoItem} />
      <CreateStack.Screen name="AddRundown" component={AddRundown} />
      <CreateStack.Screen name="AddMessage" component={AddMessage} />
    </CreateStack.Navigator>
  );
}

// this is for edit items

const EditStack = createStackNavigator();

function EditStackScreen() {
  return (
    <EditStack.Navigator screenOptions={{ headerShown: false }}>
      <EditStack.Screen
        name="ModalScreen"
        component={ModalScreen}
        options={{
          presentation: 'transparentModal',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          cardOverlayEnabled: true,
        }}
      />
      <EditStack.Screen name="EditMaterialItem" component={EditMaterialItem} />
      <EditStack.Screen name="EditBudgetItem" component={EditBudgetItem} />
      <EditStack.Screen name="EditParti" component={EditParti} />
      <EditStack.Screen name="EditGuest" component={EditGuest} />
      <EditStack.Screen name="EditTodoItem" component={EditTodoItem} />
      <EditStack.Screen name="EditRundown" component={EditRundown} />
      <EditStack.Screen name="SelectEvent" component={SelectEvent} />
    </EditStack.Navigator>
  );
}

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="TabScreen" component={TabScreen} />
      <MainStack.Screen
        name="ModalScreen"
        component={ModalScreen}
        options={{
          presentation: 'transparentModal',
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          cardOverlayEnabled: true,
          gestureResponseDistance: 1000,
        }}
      />
      <MainStack.Screen
        name="CreateStackScreen"
        component={CreateStackScreen}
      />
      <MainStack.Screen name="EditStackScreen" component={EditStackScreen} />
    </MainStack.Navigator>
  );
}

const RootStack = createStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="LoadingScreen"
    >
      <RootStack.Screen name="MainStackScreen" component={MainStackScreen} />
      <RootStack.Screen name="LoadingScreen" component={LoadingScreen} />
      <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      <RootStack.Screen
        name="CreateEventStackScreen"
        component={CreateEventStackScreen}
      />
    </RootStack.Navigator>
  );
}

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                background: '#f2f1f5',
              },
            }}
          >
            <NativeBaseProvider>
              <StatusBar barStyle="dark-content" />
              <RootStackScreen />
            </NativeBaseProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
