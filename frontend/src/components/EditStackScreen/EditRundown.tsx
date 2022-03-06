import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import {
  Input,
  Button,
  Text,
  Modal,
  TextArea,
  Checkbox,
  Box,
  View,
} from 'native-base';
import { useSelector } from 'react-redux';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { IRootState } from '../../redux/store';
import { useMutation } from 'react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchRemoveRundown, fetchUpdateRundown } from '../../api/rundown';

const roleList = [
  { id: 1, role: '新郎' },
  { id: 2, role: '新娘' },
  { id: 3, role: '兄弟' },
  { id: 4, role: '姊妹' },
  { id: 5, role: '攝影師' },
  { id: 6, role: '司儀' },
  { id: 7, role: '表演者' },
  { id: 8, role: '大妗姐' },
  { id: 9, role: '化妝師' },
];

export function EditRundown({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [showModal, setShowModal] = useState(false);

  const [time, setTime] = useState(getTime(route.params.itinerary_time));
  const [roleArray, setRoleArray] = useState<number[]>(route.params.role_id_arr);
  const [isChosenRole, setIsChosenRole] = useState(false);

  function getTime(itinerary_time: string) {
    const time = new Date();
    time.setHours(parseInt(itinerary_time.substring(0, 2)));
    time.setMinutes(parseInt(itinerary_time.substring(3, 5)));
    return time;
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: route.params.id,
      itinerary: JSON.stringify(route.params.itinerary).replace(/\"/g, ''),
      role_id_arr: route.params.role_id_arr,
      job_duty: JSON.stringify(route.params.job_duty)
        .replace(/"/g, '')
        .replace(/\\n/g, '\n'),
    },
  });

  const updateRundownMutation: any = useMutation(fetchUpdateRundown);
  const removeRundownMutation: any = useMutation(fetchRemoveRundown);

  const onSubmit = (data: any) => {
    data['itinerary_time'] = `${time
      .getHours()
      .toString()
      .padStart(2, '0')}:${time.getMinutes().toString()}:00`;

    data['role_id_arr'] = roleArray;
    data['wedding_event_id'] = eventId;
    updateRundownMutation.mutate(data);
  };

  const removeRundown = () => {
    removeRundownMutation.mutate(route.params.id);
  };

  return (
    <CreateAndEditTopBar pageName="編輯當日流程">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View display="flex" flexDirection="column">
          <View height={height * 0.75}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  marginTop={5}
                  placeholder="事項"
                  style={editGuestStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="itinerary"
            />
            {errors.itinerary && (
              <Text color="danger.500" marginTop={2} marginLeft={1}>
                請填寫事項。
              </Text>
            )}

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  h={150}
                  marginTop={5}
                  placeholder="詳情"
                  style={editGuestStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="job_duty"
            />

            <Text marginTop={5} fontSize={18} mb="2">
              負責人士
            </Text>
            <Box flexDirection="row" flexWrap="wrap">
              {roleList.map(
                (role, idx) => {

                  let isChecked;
                  if (
                    route.params.role_id_arr.find(
                      (roleId: any) => roleId === role.id
                    )
                  ) {
                    isChecked = true;
                  } else {
                    isChecked = false;
                  }

                  return (
                    <Checkbox
                      defaultIsChecked={isChecked}
                      key={idx}
                      value={role.id.toString()}
                      accessibilityLabel="This is a checkbox"
                      width="100"
                      mb="2"
                      onChange={(event) => {
                        setIsChosenRole(true)
                        if (event) {
                          const newRoleArray = roleArray.slice();
                          newRoleArray.push(role.id);
                          setRoleArray(newRoleArray);
                        } else {
                          const newRoleArray = roleArray.slice();
                          const index = newRoleArray.indexOf(role.id);
                          if (index > -1) {
                            newRoleArray.splice(index, 1);
                          }
                          setRoleArray(newRoleArray);
                        }
                      }}
                    >
                      {role.role}
                    </Checkbox>
                  );
                }
              )}
            </Box>
            {roleArray.length === 0 && isChosenRole && (
              <Text color="danger.500">請選擇負責人士。</Text>
            )}

            <Text marginLeft={1} marginTop={5} fontSize={18}>
              時間
            </Text>
            <View style={editGuestStyles.dateTimePicker}>
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode="time"
                style={{ width: 100, marginLeft: -10 }}
                is24Hour={true}
                display="default"
                onChange={(event: any, selectedDate?: Date) => {
                  const currentDate = selectedDate || time;
                  setTime(currentDate);
                }}
              />
            </View>
          </View>

          <View>
            {updateRundownMutation.isError ? (
              <Text color="danger.500">
                錯誤：{updateRundownMutation.error.message}
              </Text>
            ) : null}

            {updateRundownMutation.isSuccess ? navigation.goBack() : null}

            {removeRundownMutation.isError ? (
              <Text color="danger.500">
                錯誤：{removeRundownMutation.error.message}
              </Text>
            ) : null}
            {removeRundownMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View style={editGuestStyles.buttonRow}>
            <Button width="48%" onPress={handleSubmit(onSubmit)}>
              儲存
            </Button>

            <Button
              width="48%"
              colorScheme="danger"
              onPress={() => setShowModal(true)}
            >
              移除
            </Button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>確定移除流程事項？</Modal.Header>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      colorScheme="danger"
                      onPress={() => {
                        removeRundown();
                        setShowModal(false);
                      }}
                    >
                      確定
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </CreateAndEditTopBar>
  );
}

const editGuestStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dateTimePicker: {
    marginTop: 3,
  },
});
