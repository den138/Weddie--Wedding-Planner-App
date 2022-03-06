import { Text, View } from 'native-base';
import React from 'react';

export function MutationResult(props: any) {
  return (
    <View>
      {props.mutation.isError ? (
        <Text color="danger.500">抱歉：伺服器發生錯誤</Text>
      ) : null}

      {props.mutation.isSuccess ? props.navigation.goBack() : null}
    </View>
  );
}
