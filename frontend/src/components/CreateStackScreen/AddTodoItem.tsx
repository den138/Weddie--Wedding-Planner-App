import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, TextArea, Text, View } from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useMutation } from 'react-query';
import { fetchAddTodoItem } from '../../api/todo';
import { MutationResult } from '../MutationResult';

export function AddTodoItem({ navigation }: { navigation: any }) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [date, setDate] = useState<Date>(new Date());

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: '',
      dueDate: date,
      remarks: '',
      status: false,
    },
  });

  const mutation: any = useMutation(fetchAddTodoItem);

  const onSubmit = (data: any) => {
    data.status = false;
    data['wedding_event_id'] = eventId;
    data['dueDate'] = date;
    console.log('submit form data:', data);
    mutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="新增待辦事項">
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
                  style={addTodoItemStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="itemName"
            />
            {errors.itemName && (
              <Text color="danger.500" marginTop={2} marginLeft={1}>
                請填寫待辦事項。
              </Text>
            )}

            <Text marginLeft={1} marginTop={5} fontSize={18}>
              到期日
            </Text>

            <View marginTop={2} alignItems="center" width="5%">
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                style={{ width: 230, marginLeft: -10 }}
                display="default"
                onChange={(event: any, selectedDate?: Date) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              />
            </View>

            {date < today && (
              <Text color="danger.500" marginTop={2} marginLeft={1}>
                請選擇正確的日子。
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  marginTop={5}
                  placeholder="備註"
                  size="xl"
                  style={addTodoItemStyles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="remarks"
            />
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

const addTodoItemStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
});
