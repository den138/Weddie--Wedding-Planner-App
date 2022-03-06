import React, { useEffect, useState } from 'react';
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
  Box,
  Checkbox,
  TextArea,
  View,
} from 'native-base';
import { useSelector } from 'react-redux';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { useMutation } from 'react-query';
import { IRootState } from '../../redux/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAddRundown } from '../../api/rundown';
import { roleList } from '../../../utils/roleList';
import { MutationResult } from '../MutationResult';

export function AddRundown({ navigation }: { navigation: any }) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [roleArray, setRoleArray] = useState<number[]>([]);
  const [time, setTime] = useState(new Date());

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itinerary: '',
      role_id_arr: '',
      job_duty: '',
    },
  });

  useEffect(() => {
    let sub = watch((data) => {
      console.log('update form data:', data);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const mutation: any = useMutation(fetchAddRundown);

  const onSubmit = (data: any) => {
    data['itinerary_time'] = `${time
      .getHours()
      .toString()
      .padStart(2, '0')}:${time.getMinutes().toString()}:00`;
    roleArray.length === 0
      ? (data['role_id_arr'] = [1, 2])
      : (data['role_id_arr'] = roleArray);
    data['wedding_event_id'] = eventId;
    console.log('submit form data:', data);
    mutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="新增當日流程">
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
                  onChangeText={onChange}
                  value={value}
                  size="xl"
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
                (role, idx) => (
                  <Checkbox
                    key={idx}
                    value={role.id.toString()}
                    accessibilityLabel="This is a checkbox"
                    width="100"
                    mb="2"
                    onChange={(event) => {
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
                      console.log(roleArray);
                    }}
                  >
                    {role.role}
                  </Checkbox>
                )
                // double mappping, but not work as i don't know how to show the others
                //     route.params.role_id_arr.map((role_id: any) =>
                //       role.id === role_id ? (
                //         <Checkbox
                //           key={idx}
                //           value={role.id.toString()}
                //           accessibilityLabel="This is a checkbox"
                //           width="100"
                //           mb="2"
                //           isChecked
                //           onChange={() => {
                //             console.log(route.params.role_id_arr);
                //           }}
                //         >
                //           {role.role}
                //         </Checkbox>
                //       ) : (null)
                //   )
              )}
            </Box>
            {roleArray.length === 0 && (
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
                  console.log(currentDate);
                }}
              />
            </View>
          </View>

          <MutationResult mutation={mutation} navigation={navigation} />

          <View>
            <Button onPress={handleSubmit(onSubmit)}>提交</Button>
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
