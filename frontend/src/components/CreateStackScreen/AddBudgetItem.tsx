import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Text, Select, CheckIcon, View } from 'native-base';
import { useSelector } from 'react-redux';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { useMutation } from 'react-query';
import { fetchAddExpenditureItem } from '../../api/expenditure';
import { IRootState } from '../../redux/store';
import { MutationResult } from '../MutationResult';

export function AddBudgetItem({ navigation }: { navigation: any }) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: '',
      amount: '',
      description: '',
    },
  });

  const mutation: any = useMutation(fetchAddExpenditureItem);

  const onSubmit = (data: any) => {
    data.amount = parseInt(data.amount);
    data.categoryId = parseInt(data.categoryId);
    data.wedding_event_id = eventId;
    data.updateTime = Date.parse(new Date().toString());
    console.log('submit form data:', data);
    mutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="新增支出">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View display="flex" flexDirection="column">
          <View height={height * 0.75}>
            <Controller
              name="categoryId"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange } }) => (
                <>
                  <Select
                    minWidth="200"
                    accessibilityLabel="請選擇種類"
                    placeholder="請選擇種類"
                    _selectedItem={{
                      bg: 'secondary.500',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    fontSize="md"
                    onValueChange={onChange}
                  >
                    <Select.Item label="攝影" value="1" />
                    <Select.Item label="婚前中式禮儀" value="2" />
                    <Select.Item label="派帖" value="3" />
                    <Select.Item label="美容" value="4" />
                    <Select.Item label="早上敬茶、出門入門" value="5" />
                    <Select.Item label="証婚" value="6" />
                    <Select.Item label="晚上婚宴" value="7" />
                    <Select.Item label="婚禮服飾" value="8" />
                    <Select.Item label="婚禮當日化妝" value="9" />
                    <Select.Item label="交通" value="10" />
                    <Select.Item label="回門" value="11" />
                    <Select.Item label="其他" value="12" />
                  </Select>
                </>
              )}
            />
            {errors.categoryId?.type === 'required' && (
              <Text color="danger.500" marginTop={1}>
                請選擇種類。
              </Text>
            )}

            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  marginTop={5}
                  placeholder="事項"
                  size="xl"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="description"
            />
            {errors.description && <Text color="danger.500">請填寫事項。</Text>}
            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="xl"
                  marginTop={5}
                  placeholder="金額"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="amount"
            />
            {errors.amount && <Text color="danger.500">請填寫金額。</Text>}
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
