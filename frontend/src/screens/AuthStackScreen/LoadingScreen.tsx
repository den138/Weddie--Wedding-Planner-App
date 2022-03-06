import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { restoreLoginThunk } from '../../redux/auth/thunk';

export default function LoadingScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: IRootState) => state.auth.isAuthenticated
  );
  const isCreated = useSelector((state: IRootState) => state.event.isCreated);

  useEffect(() => {
    dispatch(restoreLoginThunk());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isCreated) {
      navigation.navigate('MainStackScreen', { screen: 'HomeScreen' });
    } else if (isAuthenticated && isCreated == false) {
      navigation.navigate('CreateEventStackScreen', { screen: 'ChooseScreen' });
    } else if (isAuthenticated == false) {
      navigation.navigate('AuthStackScreen');
    } else {
      return;
    }
  }, [isAuthenticated, isCreated]);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 30 }}>載入中...</Text>
    </View>
  );
}
