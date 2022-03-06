import {
  Modal,
  Input,
  Button,
  View,
  Text,
  HStack,
  Box,
  Heading,
  VStack,
} from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import TopBar from '../../components/TopBar';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../../redux/auth/thunk';
import { IRootState } from '../../redux/store';
import { changeEvent } from '../../redux/event/actions';

export default function SettingScreen({ navigation }: { navigation: any }) {
  const role = useSelector((state: IRootState) => state.event.event?.role);
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );

  let eventData: any = useSelector((state: IRootState) => state.event.event);

  if (!eventData) {
    eventData = {
      wedding_event_id: '',
      wedding_name: '',
      wedding_date: '',
      role: '',
    };
  }

  const dispatch = useDispatch();
  const user = useSelector((state: IRootState) => state.auth.user)!;
  const [showModal, setShowModal] = useState(false);
  const { height, width } = useWindowDimensions();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: '',
    },
  });

  function getDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (!dateString) {
      return '';
    }

    return `${year} 年 ${month} 月 ${day} 日`;
  }

  return (
    <TopBar pageName="用戶設定" show="false" navigate="">
      <View>
        <View
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height={height * 0.45}
          paddingTop={5}
        >
          <Box
            bg="secondary.600"
            pt="4"
            pb="4"
            px="3"
            mb="4"
            rounded="xl"
            width="100%"
            maxWidth="100%"
          >
            <VStack>
              <Heading size="2xl" color="white">
                {user ? user.nickname : null}
              </Heading>
              <Text fontSize={20} color="white">
                {role ? role : ''}
              </Text>
            </VStack>
          </Box>

          <Box flex="1">
            <HStack py="3" borderBottomWidth="1" borderColor="muted.300">
              <View width="30%">
                <Text fontSize={20}>電郵</Text>
              </View>

              <Text fontSize={20} fontWeight="bold">
                {user ? user.email : ''}
              </Text>
            </HStack>

            <HStack py="3" borderBottomWidth="1" borderColor="muted.300">
              <View width="30%">
                <Text fontSize={20}>電話</Text>
              </View>

              <Text fontSize={20} fontWeight="bold">
                {user ? user.phone : ''}
              </Text>
            </HStack>

            <HStack py="3" borderBottomWidth="1" borderColor="muted.300">
              <View width="30%">
                <Text fontSize={20}>參與婚禮</Text>
              </View>

              <Text fontSize={20} fontWeight="bold">
                {eventData ? eventData.wedding_name : ''}
              </Text>
            </HStack>

            <HStack py="3" borderBottomWidth="1" borderColor="muted.300">
              <View width="30%">
                <Text fontSize={20}>婚禮日期</Text>
              </View>

              <Text fontSize={20} fontWeight="bold">
                {eventData ? getDate(eventData.wedding_date) : ''}
              </Text>
            </HStack>
          </Box>
        </View>

        <View>
          <Button
            flex="1"
            colorScheme="red"
            marginTop="5"
            py="3"
            mx="20"
            onPress={() => {
              dispatch(changeEvent());
            }}
          >
            <Text fontSize={16} color="white">
              切換婚禮
            </Text>
          </Button>

          <Button
            color="#ffff1a"
            marginTop="5"
            py="3"
            mx="20"
            onPress={() => {
              dispatch(logoutThunk());
              navigation.navigate('AuthStackScreen', {
                screen: 'WelcomingScreen',
              });
            }}
          >
            <Text fontSize={16} color="white">
              登出
            </Text>
          </Button>
        </View>
      </View>
    </TopBar>
  );
}

const settingStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
});
