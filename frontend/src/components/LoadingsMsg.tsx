import { Box, Text } from 'native-base';
import React from 'react';

export function LoadingMsg() {
  return (
    <Box flex="1" justifyContent="center" alignItems="center">
      <Text>載入中...</Text>
    </Box>
  );
}
