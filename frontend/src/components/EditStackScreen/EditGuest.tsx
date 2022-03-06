import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Text, Modal, View } from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { useMutation } from 'react-query';
import { fetchRemoveGuest, fetchUpdateGuest } from '../../api/guest';

export function EditGuest({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [showModal, setShowModal] = useState(false);
  const [name] = useState(route.params.name);
  const [phone] = useState(route.params.phone);
  const [relationship] = useState(route.params.relationship);
  const [id] = useState(route.params.id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: JSON.stringify(name).replace(/\"/g, ''),
      phone: JSON.stringify(phone).replace(/\"/g, ''),
      relationship: JSON.stringify(relationship).replace(/\"/g, ''),
    },
  });

  const updateGuestMutation: any = useMutation(fetchUpdateGuest);
  const removeGuestMutation: any = useMutation(fetchRemoveGuest);

  const onSubmit = (data: any) => {
    data['guestId'] = id;
    updateGuestMutation.mutate(data);
  };

  const removeGuest = () => {
    removeGuestMutation.mutate(id);
  };

  return (
    <CreateAndEditTopBar pageName="編輯賓客資料">
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
                  placeholder="名字"
                  // style={editGuestStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />
            {errors.name && <Text color="danger.500">請填寫賓客名稱。</Text>}

            <Controller
              control={control}
              rules={{
                maxLength: 8,
                minLength: 8,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  marginTop={5}
                  placeholder="電話號碼"
                  // style={editGuestStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
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
              control={control}
              rules={{
                maxLength: 100,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  marginTop={5}
                  placeholder="關係"
                  // style={editGuestStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="relationship"
            />
            {errors.relationship && (
              <Text color="danger.500">請填寫關係。</Text>
            )}
          </View>

          <View>
            {updateGuestMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}

            {updateGuestMutation.isSuccess ? navigation.goBack() : null}

            {removeGuestMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}
            {removeGuestMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View style={editGuestStyles.buttonRow}>
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
                <Modal.Header>確定移除賓客資料？</Modal.Header>
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
                        removeGuest();
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

const editGuestStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
