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
  View,
  Select,
  CheckIcon,
} from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { roleList } from '../../../utils/roleList';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { useMutation } from 'react-query';
import { fetchRemoveParti, fetchUpdateParti } from '../../api/parti';

export function EditParti({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [id] = useState(route.params.id);
  const [name] = useState(route.params.name);
  const [phone] = useState(route.params.phone);
  const [roleId] = useState(route.params.roleId);
  const [showModal, setShowModal] = useState(false);
  const role = useSelector((state: IRootState) => state.event.event?.role);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name,
      phone: JSON.stringify(phone).replace(/\"/g, ''),
      roleId: '',
    },
  });

  const updatePartiMutation: any = useMutation(fetchUpdateParti);
  const removePartiMutation: any = useMutation(fetchRemoveParti);

  const onSubmit = (data: any) => {
    data['role_id'] = data.roleId || String(roleId);
    data['partiId'] = id;
    delete data['roleId'];
    String(data['phone']);
    console.log('submit form data: ', data);
    updatePartiMutation.mutate(data);
  };

  const removeParti = () => {
    removePartiMutation.mutate(id);
  };

  return (
    <CreateAndEditTopBar pageName="人員資料">
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
                  isReadOnly
                  marginTop={5}
                  placeholder="名稱"
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
                  isReadOnly
                  marginTop={5}
                  placeholder="電話號碼"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  size="xl"
                />
              )}
              name="phone"
            />
            {errors.phone?.type === 'required' && (
              <Text color="danger.500">請填寫賓客電話號碼。</Text>
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
              render={({ field: { value, onChange } }) => (
                <>
                  <Select
                    selectedValue={String(roleId)}
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
                      .map((roleObject, idx) => {
                        return (
                          <Select.Item
                            key={idx}
                            label={roleObject.role}
                            value={String(roleObject.id)}
                          />
                        );
                      })}
                  </Select>
                </>
              )}
            />
          </View>

          <View>
            {updatePartiMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}

            {updatePartiMutation.isSuccess ? navigation.goBack() : null}

            {removePartiMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}
            {removePartiMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View>
            <Button colorScheme="danger" onPress={() => setShowModal(true)}>
              移除
            </Button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>確定移除人員資料？</Modal.Header>
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
                        removeParti();
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
const editPartiStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
