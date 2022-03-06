import { Box, Button, Checkbox, Text, TextArea, View } from 'native-base';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { fetchAddMessage } from '../../api/message';
import { IRootState } from '../../redux/store';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { MutationResult } from '../MutationResult';

const roleList = [
  { id: 3, role: '兄弟' },
  { id: 4, role: '姊妹' },
  { id: 5, role: '攝影師' },
  { id: 6, role: '司儀' },
  { id: 7, role: '表演者' },
  { id: 8, role: '大妗姐' },
  { id: 9, role: '化妝師' },
];

export function AddMessage({ navigation }: { navigation: any }) {
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const { height, width } = useWindowDimensions();
  const [roleArray, setRoleArray] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '',
      role_id_arr: '',
    },
  });

  const mutation: any = useMutation(fetchAddMessage);

  const onSubmit = (data: any) => {
    data['wedding_event_id'] = eventId;
    data['role_id_arr'] = roleArray;
    console.log('submit from data: ', data);
    mutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="新增訊息">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View display="flex" flexDirection="column">
          <View height={height * 0.75}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  marginTop={10}
                  placeholder="訊息"
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                  width={width * 0.9}
                  height={height * 0.2}
                />
              )}
              name="content"
            />
            {errors.content && (
              <Text color="danger.500" marginTop={2}>
                請填寫訊息。
              </Text>
            )}

            <Text marginTop={5} fontSize={18} mb="2">
              接收人士
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
                    }}
                  >
                    {role.role}
                  </Checkbox>
                )
              )}
            </Box>
            {roleArray.length === 0 && (
              <Text color="danger.500">請選擇接收人士。</Text>
            )}
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
