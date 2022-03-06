import { View, Text, Input, Button, Select, CheckIcon } from 'native-base';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { fetchAddParti } from '../../api/parti';
import { IRootState } from '../../redux/store';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { roleList } from '../../../utils/roleList';
import { MutationResult } from '../MutationResult';

export function AddParti({ navigation }: { navigation: any }) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const role = useSelector((state: IRootState) => state.event.event?.role);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      roleId: '',
    },
  });

  const mutation: any = useMutation(fetchAddParti);

  const onSubmit = (data: any) => {
    data['wedding_event_id'] = eventId;
    data['role_id'] = data.roleId;
    delete data['roleId'];
    String(data['phone']);
    console.log('submit form data:', data);
    mutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="新增人員">
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
                  placeholder="名稱"
                  // style={addMaterialStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />
            {errors.name && <Text color="danger.500">請填寫名稱。</Text>}

            <Controller
              control={control}
              rules={{
                maxLength: 8,
                minLength: 8,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="xl"
                  marginTop={5}
                  placeholder="電話號碼"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="phone"
            />
            {errors.phone?.type === 'required' && (
              <Text color="danger.500">請填寫人員電話號碼。</Text>
            )}
            {errors.phone?.type === 'maxLength' && (
              <Text color="danger.500">請填寫8位數字的電話號碼。</Text>
            )}
            {errors.phone?.type === 'minLength' && (
              <Text color="danger.500">請填寫8位數字的電話號碼。</Text>
            )}

            <Controller
              name="roleId"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange } }) => (
                <>
                  <Select
                    marginTop={5}
                    minWidth="200"
                    accessibilityLabel="請選擇角色"
                    placeholder="請選擇角色"
                    _selectedItem={{
                      bg: 'secondary.500',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    fontSize="md"
                    onValueChange={onChange}
                  >
                    {roleList
                      .filter((roleObject) => roleObject.role !== role)
                      .map((roleObject) => {
                        return (
                          <Select.Item
                            key={roleObject.id}
                            label={roleObject.role}
                            value={String(roleObject.id)}
                          />
                        );
                      })}
                  </Select>
                </>
              )}
            />
            {errors.roleId?.type === 'required' && (
              <Text color="danger.500" marginTop={1}>
                請選擇角色。
              </Text>
            )}
          </View>

          <MutationResult mutation={mutation} navigation={navigation} />

          <View>
            <Button onPress={handleSubmit(onSubmit)}>儲存</Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </CreateAndEditTopBar>
  );
}
