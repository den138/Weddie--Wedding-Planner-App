import {
  Button,
  Text,
  Center,
  Box,
  Heading,
  Input,
  VStack,
  Icon,
  View,
  Radio,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ICreateEvent } from '../../redux/event/state';
import { createEventThunk } from '../../redux/event/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const [date, setDate] = useState<Date>(new Date());

  const dispatch = useDispatch();

  const userId = useSelector((state: IRootState) => state.auth.user?.id);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ICreateEvent>({
    defaultValues: {
      eventName: '',
      role: '',
      bigday: date,
      budget: '',
      user_id: userId,
    },
  });

  useEffect(() => {
    let sub = watch((data) => {
      console.log('update form data:', data);
    });
    return () => sub.unsubscribe();
  }, [watch, date]);

  function onSubmit(data: ICreateEvent) {
    data.bigday = date;
    console.log('submit form data:', data);
    dispatch(createEventThunk(data));
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View height="100%">
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
                建立我的婚禮
              </Heading>
              <VStack space={3} mt="5">
                <View>
                  <Controller
                    name="eventName"
                    control={control}
                    rules={{
                      required: true,
                      maxLength: 20,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Text fontSize="lg" mb="1">
                          請為你們的婚禮定一個名稱！
                        </Text>
                        <Input
                          placeholder={`簡單名稱即可，如 "Ben & Amy 的婚禮" 等`}
                          fontSize="md"
                          value={value}
                          onChangeText={onChange}
                        />
                      </>
                    )}
                  />
                  {errors.eventName?.type === 'required' && (
                    <Text color="danger.500">請填寫婚禮名稱。</Text>
                  )}
                  {errors.eventName?.type === 'maxLength' && (
                    <Text color="danger.500">婚禮名稱不可多於二十個字符。</Text>
                  )}
                  <Controller
                    name="role"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Text fontSize="lg" mb="1" mt="3">
                          請問你是...
                        </Text>
                        <Radio.Group
                          name="myRadioGroup"
                          accessibilityLabel="favorite number"
                          value={value}
                          onChange={onChange}
                          flexDirection="row"
                          justifyContent="flex-start"
                        >
                          <Radio value="1" mr={5}>
                            新郎
                          </Radio>
                          <Radio value="2">新娘</Radio>
                        </Radio.Group>
                      </>
                    )}
                  />
                  {errors.role?.type === 'required' && (
                    <Text color="danger.500">請選擇新郎或新娘。</Text>
                  )}
                  {errors.role?.type === 'maxLength' && (
                    <Text color="danger.500">新娘的名字不可多於八個字符。</Text>
                  )}
                  <Controller
                    name="bigday"
                    control={control}
                    rules={{
                      required: false,
                    }}
                    render={() => (
                      <>
                        <Text fontSize="lg" mb="1" mt="4">
                          請問你們的結婚日子是...
                        </Text>
                      </>
                    )}
                  />
                  <View alignItems="center" width="5%">
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      style={{ width: 230 }}
                      display="default"
                      onChange={(event: any, selectedDate?: Date) => {
                        const currentDate = selectedDate || date;
                        setDate(currentDate);
                      }}
                    />
                  </View>
                  {date < today && (
                    <Text color="danger.500">請選擇正確的日子。</Text>
                  )}
                  <Controller
                    name="budget"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Text fontSize="lg" mb="1" mt="4">
                          請問你們的結婚預算大概為...
                        </Text>
                        <Input
                          type="number"
                          placeholder={`以港元計算，如 "50000" 或 "100000" 等`}
                          fontSize="md"
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                        />
                      </>
                    )}
                  />
                  {errors.budget?.type === 'required' && (
                    <Text color="danger.500">請填寫結婚預算。</Text>
                  )}
                  <Button
                    mt="4"
                    // colorScheme="indigo"
                    // onPress={() => navigation.navigate('MainStackScreen')}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      完成！
                    </Text>
                  </Button>
                </View>
              </VStack>
            </Box>
          </Center>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
