import { Box, Heading, HStack, Text } from 'native-base';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { config } from '../../../app.json';
import TopBar from '../../components/TopBar';
import { ErrorMsg } from '../../components/ErrorMsg';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';
import { TouchableOpacity } from 'react-native';

export default function RundownScreen({ navigation }: { navigation: any }) {
  let eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );

  if (!eventId) {
    eventId = 0;
  }

  const token = useSelector((state: IRootState) => state.auth.token);

  const [counter, setCounter] = useState(0);
  const [itinList, setItinList] = useState([]);

  const role = useSelector((state: IRootState) => state.event.event?.role);
  let isEventViewer: boolean;
  if (role === '新郎' || role === '新娘') {
    isEventViewer = false;
  } else {
    isEventViewer = true;
  }

  const { isLoading, error, status, data } = useQuery(
    ['initData', { eventId, counter }],
    async () => {
      if (eventId && eventId !== 0) {
        const resp = await fetch(
          `${config.BACKEND_URL}/api/itin/list/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await resp.json();
  
        data.sort((a: any, b: any) => {
          const keyA = getTime(a.itinerary_time);
          const keyB = getTime(b.itinerary_time);
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
    
        setItinList(data);
      }
    }
  );

  console.log(itinList)


  useRefreshOnFocus( () => {
    setCounter((counter) => counter + 1);
  });

  function getTimeString(time: string) {
    return time.substring(0, 5);
  }

  function getTime(itinerary_time: string) {
    const time = new Date();
    time.setHours(parseInt(itinerary_time.substring(0, 2)));
    time.setMinutes(parseInt(itinerary_time.substring(3, 5)));
    return time;
  }

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  return (
    <TopBar pageName="當日流程" show="true" navigate="AddRundown">
      {itinList.map((item: any) => {
        return (
          <TouchableOpacity
            disabled={isEventViewer}
            key={item.id}
            onPress={() =>
              navigation.navigate('EditStackScreen', {
                screen: 'EditRundown',
                params: {
                  id: item.id,
                  itinerary_time: item.itinerary_time,
                  itinerary: item.itinerary,
                  job_duty: item.job_duty,
                  role_id_arr: item.role_id_arr,
                },
              })
            }
          >
            <Box py="1" flex="1">
              <HStack
                borderBottomWidth="1"
                py="3"
                alignItems="center"
                borderColor="muted.300"
              >
                <Box mr="3" width="20%">
                  <Heading size="lg">
                    {getTimeString(item.itinerary_time)}
                  </Heading>
                </Box>
                <Box width="75%">
                  <Heading size="md">{item.itinerary}</Heading>
                  {item.job_duty ? (
                    <Text fontSize="md">{item.job_duty}</Text>
                  ) : null}
                  <HStack mt="2">
                    {item.role_id_arr.map((role: any, idx: number) => {
                      return (
                        <Box
                          px="2"
                          py="0.5"
                          mr="3"
                          rounded="md"
                          bg="secondary.500"
                          key={idx}
                        >
                          <Text fontSize="md" color="white">
                            {role === 1 && '新郎'}
                            {role === 2 && '新娘'}
                            {role === 3 && '兄弟'}
                            {role === 4 && '姊妹'}
                            {role === 5 && '攝影師'}
                            {role === 6 && '司儀'}
                            {role === 7 && '表演者'}
                            {role === 8 && '大妗姐'}
                            {role === 9 && '化妝師'}
                          </Text>
                        </Box>
                      );
                    })}
                  </HStack>
                </Box>
              </HStack>
            </Box>
          </TouchableOpacity>
        );
      })}
    </TopBar>
  );
}
