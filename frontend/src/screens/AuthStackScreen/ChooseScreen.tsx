import { Button, Text, Center, Box, Heading, VStack, View } from 'native-base';
import React from 'react';

export default function ChooseScreen({ navigation }: { navigation: any }) {
  return (
    <>
      <Box safeAreaTop backgroundColor="#f2f2f2" />
      <Box safeAreaX={3} safeAreaY={1}></Box>
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
            請選擇項目：
          </Heading>
          <VStack space={3} mt="5">
            <View>
              <Button
                colorScheme="pink"
                onPress={() => navigation.navigate('CreateEventScreen')}
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  建立我的婚禮
                </Text>
              </Button>
              <Button
                mt="4"
                colorScheme="pink"
                onPress={() => navigation.navigate('JoinEventScreen')}
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  選擇婚禮
                </Text>
              </Button>
            </View>
          </VStack>
        </Box>
      </Center>
    </>
  );
}
