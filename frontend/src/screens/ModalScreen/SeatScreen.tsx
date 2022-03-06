import { Text } from 'native-base';
import React from 'react';
import { styles } from '../../../style';
import TopBar from '../../components/TopBar';

export default function SeatScreen() {
  return (
    <TopBar pageName="座位安排" show="true" navigate="AddTodoItem">
      <Text style={styles.baseText}>請等待 3.2 版本更新</Text>
    </TopBar>
  );
}
