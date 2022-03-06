import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Text, TextArea, Modal, View } from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { useMutation } from 'react-query';
import {
  fetchDeleteLogisticsItem,
  fetchUpdateLogisticsItem,
} from '../../api/logistics';

export function EditMaterialItem({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [remarks, setRemarks] = useState(route.params.remarks);

  let remarksInput = '';
  if (!remarks) {
    remarksInput = '';
  } else {
    remarksInput = JSON.stringify(remarks).replace(/\"/g, '');
  }

  const [showModal, setShowModal] = useState(false);
  const [itemName, setItemName] = useState(route.params.itemName);
  const [id, setId] = useState(route.params.id);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: JSON.stringify(itemName).replace(/\"/g, ''),
      remarks: remarksInput,
    },
  });

  const updateItemMutation: any = useMutation(fetchUpdateLogisticsItem);
  const deleteItemMutation: any = useMutation(fetchDeleteLogisticsItem);

  const onSubmit = (data: any) => {
    data['materialItemId'] = id;
    updateItemMutation.mutate(data);
  };

  const deleteMaterialItem = () => {
    deleteItemMutation.mutate(id);
  };

  return (
    <CreateAndEditTopBar pageName="編輯物資">
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
                  placeholder="物品"
                  // style={editMaterialStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="itemName"
            />
            {errors.itemName && <Text>請填寫物品。</Text>}

            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextArea
                  marginTop={5}
                  placeholder="備註"
                  // style={editMaterialStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="remarks"
            />
          </View>

          <View>
            {updateItemMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}

            {updateItemMutation.isSuccess ? navigation.goBack() : null}

            {deleteItemMutation.isError ? (
              <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
            ) : null}

            {deleteItemMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View style={editMaterialStyles.buttonRow}>
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
                <Modal.Header>確定移除物資？</Modal.Header>
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
                        deleteMaterialItem();
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

const editMaterialStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
