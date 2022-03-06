import { Box, Text } from 'native-base';
import React from 'react';

export function ErrorMsg() {
  return (
    <Box flex="1" justifyContent="center" alignItems="center">
      <Text>
        抱歉，發生未預期的錯誤。
      </Text>
    </Box>
  );
}
