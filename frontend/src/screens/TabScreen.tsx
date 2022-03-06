import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BudgetScreen from './ModalScreen/BudgetScreen';
import CheckListScreen from './ModalScreen/CheckListScreen';
import GuestScreen from './ModalScreen/GuestScreen';
import MaterialScreen from './ModalScreen/MaterialScreen';
import RundownScreen from './ModalScreen/RundownScreen';
import SeatScreen from './ModalScreen/SeatScreen';
import HomeScreen from './TabScreen/HomeScreen';
import ModalScreen from './TabScreen/ModalScreen';
import NotificationsScreen from './TabScreen/NotificationsScreen';
import ParticipantsScreen from './TabScreen/ParticipantsScreen';
import SettingScreen from './TabScreen/SettingScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="主頁"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="主頁"
        component={HomeScreen}
        options={{
          tabBarLabel: '主頁',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'ios-home' : 'ios-home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Participants"
        component={ParticipantsScreen}
        options={{
          tabBarLabel: '人員名單',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'ios-people' : 'ios-people-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                position: 'absolute',
                bottom: '-20%',
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
              }}
            >
              <Image
                source={require('../images/App_icon_circle.png')}
                style={{ width: 70, height: 70 }}
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('ModalScreen');
          },
        })}
      />
      <Tab.Screen
        name="訊息通知"
        component={NotificationsScreen}
        options={{
          tabBarLabel: '訊息通知',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'ios-notifications' : 'ios-notifications-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          tabBarLabel: '用戶設定',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'ios-person-circle' : 'ios-person-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="BudgetScreen"
        component={BudgetScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="CheckListScreen"
        component={CheckListScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="MaterialScreen"
        component={MaterialScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="GuestScreen"
        component={GuestScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RundownScreen"
        component={RundownScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="SeatScreen"
        component={SeatScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
