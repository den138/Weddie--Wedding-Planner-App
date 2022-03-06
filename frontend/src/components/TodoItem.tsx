import { StyleSheet } from 'react-native';
import { Box, Heading, HStack, View, VStack } from 'native-base';
import React from 'react';

interface ITodoItemProp {
  itemName: string;
  dueDate: string;
  isFinished: boolean;
}

export function TodoItem(props: ITodoItemProp) {
  const dueDate = new Date(props.dueDate);
  const todayDate = new Date();
  let backgroundColor = '';

  if (!props.isFinished) {
    if (dueDate < todayDate) {
      backgroundColor = 'pink.200';
    } else if (dueDate > todayDate) {
      backgroundColor = 'white';
    }
  } else {
    backgroundColor = 'white';
  }

  return (
    <Box
      bg="white"
      py="4"
      px="3"
      mb="3"
      rounded="xl"
      alignSelf="center"
      width="100%"
      maxWidth="100%"
      shadow={3}
      backgroundColor={backgroundColor}
    >
      <HStack>
        <View width="60%">
          <Heading size="sm" textAlign="left">
            {props.itemName}
          </Heading>
        </View>
        <VStack width="40%">
          <Heading size="xs" textAlign="center">
            {!props.isFinished && dueDate.toString().slice(4, 15)}
          </Heading>
        </VStack>
      </HStack>
    </Box>
  );
}

const todoStyles = StyleSheet.create({
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 10,
    // borderWidth: 1,
    // borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    // backgroundColor: '#D3D3D3',
    backgroundColor: '#ffffff',
  },
  itemName: {
    width: '67%',
    marginRight: 5,
  },
  date: {
    width: '33%',
    marginRight: -15,
  },
});
