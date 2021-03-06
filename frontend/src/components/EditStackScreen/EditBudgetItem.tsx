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
  Select,
  CheckIcon,
  View,
} from 'native-base';
import CreateAndEditTopBar from '../CreateAndEditTopBar';
import { useMutation } from 'react-query';
import {
  fetchDeleteBudgetItem,
  fetchUpdateBudgetItem,
} from '../../api/expenditure';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

export function EditBudgetItem({ route, navigation }: any) {
  const { height, width } = useWindowDimensions();
  const eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [categoryId, setCategoryId] = useState(route.params.categoryId);
  const [description, setDescription] = useState(route.params.description);
  const [expenditure, setExpenditure] = useState(route.params.expenditure);
  const [id, setId] = useState(route.params.id);
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: categoryId,
      expenditure: JSON.stringify(expenditure),
      description: JSON.stringify(description).replace(/\"/g, ''),
    },
  });

  const updateBudgetItemMutation: any = useMutation(fetchUpdateBudgetItem);
  const deleteBudgetItemMutation: any = useMutation(fetchDeleteBudgetItem);

  const onSubmit = (data: any) => {
    data.expenditure = parseInt(data.expenditure);
    data.categoryId = parseInt(data.categoryId);
    data.id = id;
    data.wedding_event_id = eventId;
    data.updateTime = Date.parse(new Date().toString());
    console.log('submit form data:', data);
    updateBudgetItemMutation.mutate(data);
  };

  const deleteBudgetItem = () => {
    const data = {
      itemId: id,
      deleteTime: Date.parse(new Date().toString()),
    };
    deleteBudgetItemMutation.mutate(data);
  };

  return (
    <CreateAndEditTopBar pageName="????????????">
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
                    selectedValue={String(categoryId)}
                    minWidth="200"
                    accessibilityLabel="???????????????"
                    placeholder="???????????????"
                    _selectedItem={{
                      bg: 'secondary.500',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    fontSize="md"
                    onValueChange={onChange}
                  >
                    <Select.Item label="??????" value="1" />
                    <Select.Item label="??????????????????" value="2" />
                    <Select.Item label="??????" value="3" />
                    <Select.Item label="??????" value="4" />
                    <Select.Item label="???????????????????????????" value="5" />
                    <Select.Item label="??????" value="6" />
                    <Select.Item label="????????????" value="7" />
                    <Select.Item label="????????????" value="8" />
                    <Select.Item label="??????????????????" value="9" />
                    <Select.Item label="??????" value="10" />
                    <Select.Item label="??????" value="11" />
                    <Select.Item label="??????" value="12" />
                  </Select>
                </>
              )}
            />
            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  isReadOnly
                  marginTop={5}
                  placeholder="??????"
                  size="xl"
                  // style={editBudgetStyles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="description"
            />
            {errors.description && <Text color="danger.500">??????????????????</Text>}
            <Controller
              control={control}
              rules={{
                maxLength: 100,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  marginTop={5}
                  placeholder="??????"
                  // style={editBudgetStyles.input}
                  onBlur={onBlur}
                  size="xl"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                />
              )}
              name="expenditure"
            />
            {errors.expenditure && <Text color="danger.500">??????????????????</Text>}
          </View>

          <View>
            {updateBudgetItemMutation.isError ? (
              <Text color="danger.500">??????????????????????????????</Text>
            ) : null}
            {updateBudgetItemMutation.isSuccess ? navigation.goBack() : null}
            {deleteBudgetItemMutation.isError ? (
              <Text color="danger.500">??????????????????????????????</Text>
            ) : null}
            {deleteBudgetItemMutation.isSuccess ? navigation.goBack() : null}
          </View>

          <View style={editBudgetStyles.buttonRow}>
            <Button width="48%" onPress={handleSubmit(onSubmit)}>
              ??????
            </Button>
            <Button
              width="48%"
              colorScheme="danger"
              onPress={() => setShowModal(true)}
            >
              ??????
            </Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>?????????????????????</Modal.Header>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      ??????
                    </Button>
                    <Button
                      colorScheme="danger"
                      onPress={() => {
                        deleteBudgetItem();
                        setShowModal(false);
                      }}
                    >
                      ??????
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

const editBudgetStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
