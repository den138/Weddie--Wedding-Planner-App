import { Box, Heading, HStack, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import TopBar from '../../components/TopBar';
import { useQuery } from 'react-query';
import { config } from '../../../app.json';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { ErrorMsg } from '../../components/ErrorMsg';
import { useSelector } from 'react-redux';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';
import { IRootState } from '../../redux/store';

export default function GuestsScreen({ navigation }: { navigation: any }) {
  let eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );

  if (!eventId) {
    eventId = 0;
  }

  const [counter, setCounter] = useState(0);

  const [guestList, setGuestList] = useState([]);

  const role = useSelector((state: IRootState) => state.event.event?.role);
  let isEventViewer: boolean;
  if (role === '新郎' || role === '新娘') {
    isEventViewer = false;
  } else {
    isEventViewer = true;
  }

  const { isLoading, error, status, data } = useQuery(
    ['guestData', { eventId, counter }],
    () =>
      fetch(`${config.BACKEND_URL}/api/guest/list/${eventId}`)
        .then((res) => res.json())
        .then((data) => setGuestList(data.guestList))
  );

  useRefreshOnFocus(() => {
    setCounter((counter) => counter + 1);
  });

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  return (
    <TopBar pageName="賓客名單" show="true" navigate="AddGuest">
      <View>
        {guestList.map((guest: any) => {
          return (
            <TouchableOpacity
              disabled={isEventViewer}
              key={guest.id}
              onPress={() =>
                navigation.navigate('EditStackScreen', {
                  screen: 'EditGuest',
                  params: {
                    id: guest.id,
                    name: guest.name,
                    phone: guest.phone,
                    relationship: guest.relationship,
                  },
                })
              }
            >
              <Box
                py="3"
                alignSelf="center"
                width="100%"
                maxWidth="100%"
                borderBottomWidth="1"
                borderColor="muted.300"
              >
                <HStack>
                  <VStack>
                    <View>
                      <Heading size="md">{guest.name}</Heading>
                    </View>
                    <View>
                      <Text fontSize="md">{guest.phone}</Text>
                    </View>
                  </VStack>
                  <Box
                    flex="1"
                    flex-direction="column"
                    alignItems="flex-end"
                    justifyContent="flex-end"
                  >
                    <Box px="2" py="0.5" rounded="md" bg="secondary.500">
                      <Text fontSize="md" color="white">
                        {guest.relationship}
                      </Text>
                    </Box>
                  </Box>
                </HStack>
              </Box>
            </TouchableOpacity>
          );
        })}

        {guestList.length === 0 && !isEventViewer && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateStackScreen', {
                screen: 'AddGuest',
              })
            }
          >
            <Text fontSize={18} color="danger.600" marginTop={10}>
              尚未有賓客名單，按此新增
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TopBar>
  );
}
