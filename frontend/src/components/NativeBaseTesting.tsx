import React from 'react';
import {
  Box as NBBox,
  NativeBaseProvider,
  Center,
  Text,
  Button,
  Icon,
} from 'native-base';

const Box = (props) => {
  return <NBBox p="5" m="2" borderRadius="md" bg="primary.200" {...props} />;
};

function Component() {
  return (
    <>
      {/* raw CSS color value */}
      <Box bg="#10b981" />
      {/* picks up a nested color value using dot notation */}
      {/* => `theme.colors.lightBlue[300]` */}
      <Box bgColor="cyan.100" py="3">
        {/* using theme colors to set text color */}
        <Text color="cyan.500" fontWeight="bold">
          {' '}
          I love NativeBase
        </Text>
      </Box>
      {/* verbose prop */}
      <Box backgroundColor="#eab308" />
      <Button success>
        <Text>Success</Text>
      </Button>
      <Button success>
        <Text>Success</Text>
      </Button>
    </>
  );
}
export default function () {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Component />
      </Center>
    </NativeBaseProvider>
  );
}
