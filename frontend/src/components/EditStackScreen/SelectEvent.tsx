import React, { useState } from 'react';
import { Button, Text, View } from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useQuery } from 'react-query';
import { ErrorMsg } from '../ErrorMsg';
import { LoadingMsg } from '../LoadingsMsg';
import { config } from '../../../app.json';

interface Event {
  wedding_date: string;
  wedding_name: string;
}

export function SelectEvent({ navigation }: { navigation: any }) {
  const userId = useSelector((state: IRootState) => state.auth.user?.id);

  const [eventList, setEventList] = useState([]);
  const { isLoading, error, data } = useQuery('userData', () =>
    fetch(`${config.BACKEND_URL}/api/events/list/${userId}`)
      .then((res) => res.json())
      .then((data) => setEventList(data.eventList))
  );

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  return (
    <CreateAndEditTopBar pageName="選擇婚禮">
      <Button
        marginTop={5}
        marginBottom={5}
        colorScheme="pink"
        onPress={() =>
          navigation.navigate('CreateEventStackScreen', {
            screen: 'ChooseScreen',
          })
        }
      >
        新增婚禮
      </Button>
      <View style={styles.boxContainer}>
        {eventList.map((event: Event, idx: number) => {
          return (
            <TouchableOpacity style={styles.eventBox} key={idx}>
              <Text>{event.wedding_name}</Text>
              <Text>{event.wedding_date.slice(0, 10)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </CreateAndEditTopBar>
  );
}

const styles = StyleSheet.create({
  eventBox: {
    height: 160,
    width: '45%',
    backgroundColor: 'pink',
    marginLeft: 10,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
