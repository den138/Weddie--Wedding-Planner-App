import { VStack, Center, Box, Button, Heading, Text } from 'native-base';
import React from 'react';
import { ImageBackground, View } from 'react-native';

export default function WelcomingScreen({ navigation }: { navigation: any }) {
  return (
    <ImageBackground
      source={require('../../images/template_1.jpeg')}
      style={{ height: '100%', left: 0, top: 0 }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />
      <Center flex={1} px="3">
        <Box safeArea w="90%">
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
          >
            歡迎！
          </Heading>

          <VStack space={3} mt="5">
            <Button
              mt="2"
              colorScheme="pink"
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                登入
              </Text>
            </Button>
            <Button
              mt="2"
              colorScheme="pink"
              onPress={() => navigation.navigate('SignupScreen')}
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                註冊
              </Text>
            </Button>
          </VStack>
        </Box>
      </Center>
    </ImageBackground>
  );
}
