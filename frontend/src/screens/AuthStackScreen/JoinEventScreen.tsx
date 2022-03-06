import { Button, Text, Center, Box, Heading, VStack, Icon } from 'native-base';
import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMsg } from '../../components/ErrorMsg';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { IRootState } from '../../redux/store';
import { config } from '../../../app.json';
import { chooseEventThunk } from '../../redux/event/thunk';

interface Event {
  wedding_date: string;
  wedding_name: string;
  id: string;
}

export default function JoinEventScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const userId = useSelector((state: IRootState) => state.auth.user?.id);

  const [eventList, setEventList] = useState([]);
  const { isLoading, error, data } = useQuery('userData', () =>
    fetch(`${config.BACKEND_URL}/api/events/list/${userId}`)
      .then((res) => res.json())
      .then((data) => setEventList(data.eventList))
  );

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  function getDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year} 年 ${month} 月 ${day} 日`;
  }

  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />
      <Box safeAreaX={3} safeAreaY={1}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={Ionicons} name="chevron-back" />
        </TouchableOpacity>
      </Box>
      <Center flex={0.9} px="3">
        <Box safeArea w="90%">
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
          >
            選擇婚禮
          </Heading>

          <VStack space={3} mt="5">
            {eventList.length === 0 ? (
              <>
                <Text fontSize="lg">你暫時未有婚禮可供選擇，</Text>
                <Text fontSize="lg">請建立你的婚禮！</Text>
              </>
            ) : (
              eventList.map((event: Event, idx: number) => {
                return (
                  <Button
                    mt="4"
                    key={idx}
                    onPress={() => dispatch(chooseEventThunk(event.id))}
                    justifyContent="flex-start"
                    colorScheme="pink"
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      {event.wedding_name}
                    </Text>
                    <Text fontSize="lg" color="white">
                      {getDate(event.wedding_date)}
                    </Text>
                  </Button>
                );
              })
            )}
          </VStack>
        </Box>
      </Center>
    </>
  );
}
