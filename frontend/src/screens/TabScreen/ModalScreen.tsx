import { View } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { styles } from '../../../style';
import { IRootState } from '../../redux/store';

export default function ModalScreen({ navigation }: { navigation: any }) {
  let role: any = useSelector((state: IRootState) => state.event.event?.role);
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flex: 1 }}
      />
      <View
        style={{
          height: '50%',
          width: '100%',
          backgroundColor: '#fff',
          justifyContent: 'center',
          borderTopStartRadius: 25,
          borderTopEndRadius: 25,
        }}
      >
        <View
          display="flex"
          justifyContent="center"
          flexDirection="row"
          position="absolute"
          top={3}
          left={0}
          right={0}
        >
          <View
            width={width * 0.15}
            height={height * 0.006}
            backgroundColor="lightgrey"
            borderRadius={10}
          ></View>
        </View>

        <View style={styles.mainModalRow}>
          {role === '新郎' ||
          role === '新娘' ||
          role === '兄弟' ||
          role === '姊妹' ? (
            <>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', { screen: 'BudgetScreen' })
                }
              >
                <Ionicons
                  name={'pie-chart-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>婚禮預算</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', {
                    screen: 'CheckListScreen',
                  })
                }
              >
                <Ionicons
                  name={'ios-checkbox-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>待辦事項</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', { screen: 'MaterialScreen' })
                }
              >
                <Ionicons
                  name={'ios-briefcase-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>物資管理</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', { screen: 'GuestScreen' })
                }
              >
                <Ionicons
                  name={'ios-person-add-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>賓客名單</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', { screen: 'RundownScreen' })
                }
              >
                <Ionicons
                  name={'ios-alarm-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>當日流程</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainModalButton}
                onPress={() =>
                  navigation.navigate('TabScreen', { screen: 'SeatScreen' })
                }
              >
                <Ionicons
                  name={'ios-restaurant-outline'}
                  size={50}
                  color="#e91e63"
                />
                <Text style={styles.modalText}>座位安排</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ fontSize: 15 }}>抱歉，你並沒有權限查閱！</Text>
          )}
        </View>
      </View>
    </View>
  );
}
