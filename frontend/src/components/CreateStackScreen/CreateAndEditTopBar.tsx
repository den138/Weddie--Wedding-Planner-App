import { useNavigation } from '@react-navigation/native';
import { Box, Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ICreateandEditTopBarProps {
  children: any;
  pageName: any;
}

export default function CreateAndEditTopBar(props: ICreateandEditTopBarProps) {
  const navigation = useNavigation();
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />
      <View>
        <View
          style={{ position: 'absolute', top: '17%', left: '2%', zIndex: 10 }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon as={Ionicons} name="chevron-back" />
          </TouchableOpacity>
        </View>
        <Box
          alignItems="center"
          pb="0.2"
          borderBottomWidth="1"
          borderColor="#d4d4d4"
          height="50"
        >
          <Text fontSize="17" fontWeight="semibold" mt="3">
            {props.pageName}
          </Text>
        </Box>
      </View>
      <View>
        <Box safeAreaX={3} safeAreaY={1} marginBottom="10">
          {props.children}
        </Box>
      </View>
    </>
  );
}
