import {
  VStack,
  Center,
  Box,
  Button,
  Heading,
  Input,
  Text,
  Icon,
  View,
  Radio,
  Select,
  CheckIcon,
} from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../../api/auth';
import { ISignupUser } from '../../redux/auth/state';
import { signUpThunk } from '../../redux/auth/thunk';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function SignupScreen() {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignupUser>({
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
      phone: '',
      gender: '',
      districtId: null,
    },
  });

  const mutation: any = useMutation(fetchRegister);

  function onSubmit(data: ISignupUser) {
    console.log('submit form data:', data);
    mutation.mutate(data);
  }

  if (mutation.status === 'success') {
    dispatch(signUpThunk());
  }

  return (
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
            註冊
          </Heading>
          <View>
            {mutation.isError ? (
              <Text color="danger.500">錯誤：{mutation.error.message}</Text>
            ) : null}
          </View>

          <VStack space={3} mt="5">
            <View>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      type="text"
                      placeholder="請輸入你的電郵地址"
                      fontSize="md"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />

                {errors.email?.type === 'required' && (
                  <Text color="danger.500">請填寫你的電郵地址。</Text>
                )}
                {errors.email?.type === 'pattern' && (
                  <Text color="danger.500">請填寫正確的電郵地址。</Text>
                )}

                <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      type="password"
                      placeholder="請輸入密碼（至少包含八個字符）"
                      fontSize="md"
                      mt="3"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                  rules={{
                    required: true,
                    minLength: 8,
                  }}
                />
                {errors.password?.type === 'required' && (
                  <Text color="danger.500">請填寫你的密碼。</Text>
                )}
                {errors.password?.type === 'minLength' && (
                  <Text color="danger.500">
                    你的密碼需要包含八個字符或以上。
                  </Text>
                )}

                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: true,
                    maxLength: 8,
                    minLength: 8,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      type="number"
                      placeholder="請輸入你的電話號碼"
                      fontSize="md"
                      mt="3"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.phone?.type === 'required' && (
                  <Text color="danger.500">請填寫你的電話號碼。</Text>
                )}
                {errors.phone?.type === 'maxLength' && (
                  <Text color="danger.500">請填寫8位數字的電話號碼。</Text>
                )}
                {errors.phone?.type === 'minLength' && (
                  <Text color="danger.500">請填寫8位數字的電話號碼。</Text>
                )}

                <Controller
                  name="nickname"
                  control={control}
                  rules={{
                    required: true,
                    maxLength: 20,
                  }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Text fontSize="lg" mb="1" mt="10">
                        請問你的名字是...
                      </Text>
                      <Input
                        placeholder={`簡單名字即可，如 "大文" 或 "Ben" 等`}
                        fontSize="md"
                        value={value}
                        onChangeText={onChange}
                      />
                    </>
                  )}
                />
                {errors.nickname?.type === 'required' && (
                  <Text color="danger.500">請填寫你的名字。</Text>
                )}
                {errors.nickname?.type === 'maxLength' && (
                  <Text color="danger.500">你的名字不可多於二十個字符。</Text>
                )}
              </TouchableWithoutFeedback>

              <Controller
                name="gender"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <Text fontSize="lg" mb="1" mt="3">
                      請問你的性別是...
                    </Text>
                    <Radio.Group
                      name="myRadioGroup"
                      accessibilityLabel="favorite number"
                      value={value}
                      onChange={onChange}
                      flexDirection="row"
                      justifyContent="flex-start"
                    >
                      <Radio value="M" mr={5}>
                        男
                      </Radio>
                      <Radio value="F">女</Radio>
                    </Radio.Group>
                  </>
                )}
              />
              {errors.nickname?.type === 'required' && (
                <Text color="danger.500">請填寫你的性別。</Text>
              )}

              <Controller
                name="districtId"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <Text fontSize="lg" mb="1" mt="4">
                      請問你居住的區域是...
                    </Text>
                    <Select
                      minWidth="200"
                      accessibilityLabel="請選擇居住區域"
                      placeholder="請選擇居住區域"
                      _selectedItem={{
                        bg: 'secondary.300',
                        endIcon: <CheckIcon size="5" />,
                      }}
                      // mt={1}
                      fontSize="md"
                      onValueChange={onChange}
                    >
                      <Select.Item label="中西區" value="1" />
                      <Select.Item label="東區" value="2" />
                      <Select.Item label="南區" value="3" />
                      <Select.Item label="灣仔區" value="4" />
                      <Select.Item label="九龍城區" value="5" />
                      <Select.Item label="觀塘區" value="6" />
                      <Select.Item label="深水埗區" value="7" />
                      <Select.Item label="黃大仙區" value="8" />
                      <Select.Item label="油尖旺區" value="9" />
                      <Select.Item label="離島區" value="10" />
                      <Select.Item label="葵青區" value="11" />
                      <Select.Item label="北區" value="12" />
                      <Select.Item label="西貢區" value="13" />
                      <Select.Item label="沙田區" value="14" />
                      <Select.Item label="大埔區" value="15" />
                      <Select.Item label="荃灣區" value="16" />
                      <Select.Item label="屯門區" value="17" />
                      <Select.Item label="元朗區" value="18" />
                    </Select>
                  </>
                )}
              />
              {errors.districtId?.type === 'required' && (
                <Text color="danger.500">請選擇你居住的區域。</Text>
              )}

              <Button
                mt="4"
                colorScheme="pink"
                // onPress={() => navigation.navigate('ChooseScreen')}
                onPress={handleSubmit(onSubmit)}
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  註冊
                </Text>
              </Button>
            </View>
          </VStack>
        </Box>
      </Center>
    </View>
  );
}
