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
  TextArea,
  Modal,
  Select,
  View,
} from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from 'react-query';
import { fetchDeleteTodoItem, fetchUpdateTodoItem } from '../../api/todo';

export function EditTodoItem({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [date, setDate] = useState<Date>(new Date(route.params.dueDate));

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [showModal, setShowModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(route.params.isCompleted);
  const [itemId] = useState(route.params.id);
  const [itemName] = useState(
    JSON.stringify(route.params.itemName).replace(/\"/g, '')
  );
  const [remarks] = useState(
    JSON.stringify(route.params.remarks).replace(/\"/g, '')
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: itemName,
      dueDate: date,
      remarks: remarks,
      isCompleted: route.params.isCompleted,
    },
  });

  const updateTodoItemMutation: any = useMutation(fetchUpdateTodoItem);
  const deleteTodoItemMutation: any = useMutation(fetchDeleteTodoItem);

  const onSubmit = (data: any) => {
    data['dueDate'] = date;
    data.isCompleted = isCompleted;
    data['itemId'] = itemId;
    console.log('submit form data:', data);
    updateTodoItemMutation.mutate(data);
  };

  const deleteTodoItem = () => {
    deleteTodoItemMutation.mutate(itemId);
  };

  return (
    <CreateAndEditTopBar pageName="編輯待辦事項">
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
                  // style={editTodoItemStyles.input}
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

            <View style={editTodoItemStyles.dateTimePicker}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                style={{ width: 230, marginLeft: -10 }}
                display="default"
                onChange={(event: any, selectedDate?: Date) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                  console.log("cur", currentDate)
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
                  // style={editTodoItemStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="remarks"
            />

            <Select
              defaultValue={isCompleted ? 'completed' : 'pending'}
              minWidth="200"
              marginTop={5}
              accessibilityLabel="狀態"
              placeholderTextColor="gray.700"
              _selectedItem={{
                bg: 'secondary.500',
              }}
              mt={1}
              onValueChange={(itemValue) => {
                if (itemValue === 'pending') {
                  setIsCompleted(false);
                } else {
                  setIsCompleted(true);
                }
              }}
            >
              <Select.Item label="未完成" value="pending" />
              <Select.Item label="已完成" value="completed" />
            </Select>
          </View>

          <View>
            {updateTodoItemMutation.isError ? (
              <Text color="danger.500">
                錯誤：{updateTodoItemMutation.error.message}
              </Text>
            ) : null}

            {updateTodoItemMutation.isSuccess ? navigation.goBack() : null}

            {deleteTodoItemMutation.isError ? (
              <Text color="danger.500">
                錯誤：{deleteTodoItemMutation.error.message}
              </Text>
            ) : null}

            {deleteTodoItemMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View style={editTodoItemStyles.buttonRow}>
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
                <Modal.Header>確定移除待辦事項？</Modal.Header>
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
                        deleteTodoItem();
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

const editTodoItemStyles = StyleSheet.create({
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
    alignItems: 'center',
    width: '5%',
  },
});
