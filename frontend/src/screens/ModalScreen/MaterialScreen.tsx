import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Heading,
  HStack,
  Text,
  VStack,
  View,
} from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import TopBar from '../../components/TopBar';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useMutation, useQuery } from 'react-query';
import { config } from '../../../app.json';
import { ErrorMsg } from '../../components/ErrorMsg';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';
import { fetchChangeIsReadyStatus } from '../../api/logistics';

interface LogisticsDatabase {
  id: number;
  wedding_event_id: number;
  logistics_item: string;
  logistics_remarks: string;
  is_ready: boolean;
}

export default function MaterialScreen({ navigation }: { navigation: any }) {
  const mutation: any = useMutation(fetchChangeIsReadyStatus);
  let eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [counter, setCounter] = useState(0);

  if (!eventId) {
    eventId = 0;
  }

  const role = useSelector((state: IRootState) => state.event.event?.role);
  // let isEventViewer: boolean;
  // if (role === '新郎' || role === '新娘') {
  //   isEventViewer = false;
  // } else {
  //   isEventViewer = true;
  // }

  const isEventViewer = !(role === '新郎' || role === '新娘');

  const [materialList, setMaterialList] = useState([]);
  const { isLoading, error, status, data } = useQuery(
    ['logisticsData', { eventId, counter }],
    () =>
      fetch(`${config.BACKEND_URL}/api/logistics/list/${eventId}`)
        .then((res) => res.json())
        .then((data) => setMaterialList(data.logisticsList))
  );

  useRefreshOnFocus(() => {
    setCounter((counter) => counter + 1);
  });

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  return (
    <TopBar pageName="物資管理" show="true" navigate="AddMaterialItem">
      {materialList &&
        materialList.map((material: LogisticsDatabase) => {
          return (
            <TouchableOpacity
              disabled={isEventViewer}
              key={material.id}
              style={materialStyles.tableRow}
              onPress={() =>
                navigation.navigate('EditStackScreen', {
                  screen: 'EditMaterialItem',
                  params: {
                    id: material.id,
                    itemName: material.logistics_item,
                    remarks: material.logistics_remarks,
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
                <HStack display="flex" justifyContent="space-between">
                  <VStack width="80%">
                    <View>
                      <Heading size="md">{material.logistics_item}</Heading>
                    </View>
                  </VStack>

                  <VStack>
                    <Box
                      flex="1"
                      flex-direction="column"
                      alignItems="flex-end"
                      justifyContent="flex-end"
                    >
                      <Checkbox
                        isDisabled={isEventViewer}
                        defaultIsChecked={material.is_ready}
                        colorScheme="pink"
                        value={String(material.id)}
                        size="lg"
                        aria-label="Attend"
                        onChange={() => {
                          const isReady = !material.is_ready;
                          // material.is_ready = !material.is_ready;
                          const itemId = material.id;
                          const data = { itemId, isReady };
                          mutation.mutate(data);
                        }}
                      />
                    </Box>
                  </VStack>
                </HStack>
              </Box>
            </TouchableOpacity>
          );
        })}

      {materialList.length === 0 && !isEventViewer && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateStackScreen', {
              screen: 'AddMaterialItem',
            })
          }
        >
          <Text fontSize={18} color="danger.600" marginTop={10}>
            尚未有物資名單，按此新增
          </Text>
        </TouchableOpacity>
      )}
    </TopBar>
  );
}

const materialStyles = StyleSheet.create({
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 5,
  },
});
