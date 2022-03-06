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
} from 'native-base';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../redux/auth/thunk';
import { IRootState } from '../../redux/store';

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginScreen({ navigation }: { navigation: any }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormState>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const dispatch = useDispatch();

  const userMsg = useSelector((state: IRootState) => state.auth.message)

  useEffect(() => {
    let sub = watch((data) => {
      console.log('update form data:', data);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  function onSubmit(data: LoginFormState) {
    console.log('submit form data:', data);
    const resp = dispatch(loginThunk(data.email, data.password));
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
                登入
              </Heading>
              {userMsg ? (
              <Text color="danger.500">錯誤：{userMsg}</Text>
            ) : null}

              <VStack space={3} mt="5">
                <View>
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
                    <Text color="danger.500">請填寫你的電話號碼。</Text>
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
                        placeholder="密碼"
                        fontSize="md"
                        mt="3"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{
                      required: true,
                    }}
                  />
                  {errors.password && (
                    <Text color="danger.500">請填寫你的密碼。</Text>
                  )}
                  <Button
                    mt="4"
                    colorScheme="pink"
                    // onPress={() => navigation.navigate('MainStackScreen')}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      登入
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
