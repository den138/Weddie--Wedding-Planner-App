import { Text, View } from 'native-base';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { TodoItem } from '../../components/TodoItem';
import TopBar from '../../components/TopBar';
import { IRootState } from '../../redux/store';
import { config } from '../../../app.json';
import { useQuery } from 'react-query';
import { ErrorMsg } from '../../components/ErrorMsg';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';

interface TodoItem {
  id: number;
  wedding_event_id: number;
  to_do_date: string;
  to_do_item: string;
  to_do_remarks: string;
  is_finished: boolean;
}

export default function CheckListScreen({ navigation }: { navigation: any }) {
  const [todoList, setTodoList] = useState([]);
  let eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const [counter, setCounter] = useState(0);

  if (!eventId) {
    eventId = 0;
  }

  const role = useSelector((state: IRootState) => state.event.event?.role);
  let isEventViewer: boolean;
  if (role === '新郎' || role === '新娘') {
    isEventViewer = false;
  } else {
    isEventViewer = true;
  }

  const { isLoading, error, status, data } = useQuery(
    ['todoData', { eventId, counter }],
    () => {
      if (eventId && eventId !== 0) {
        fetch(`${config.BACKEND_URL}/api/todo/list/${eventId}`)
          .then((res) => res.json())
          .then((data) => setTodoList(data.todoList));
      }
    }
  );

  const completedTodoItems = useMemo(() => {
    console.log('filtered');
    return todoList.filter((todoItem: TodoItem) => todoItem.is_finished);
  }, [todoList]);

  const pendingTodoItems = useMemo(() => {
    console.log('filtered');
    return todoList.filter((todoItem: TodoItem) => !todoItem.is_finished);
  }, [todoList]);

  useRefreshOnFocus(() => {
    setCounter((counter) => counter + 1);
  });

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  // const completedTodoItems = todoList.filter(
  //   (todoItem: TodoItem) => todoItem.is_finished
  // );

  // const pendingTodoItems = todoList.filter(
  //   (todoItem: TodoItem) => !todoItem.is_finished
  // );

  return (
    <TopBar pageName="待辦事項" show="true" navigate="AddTodoItem">
      <View marginTop={15}>
        {pendingTodoItems.length > 0 && (
          <Text fontSize={25} marginLeft={1} fontWeight="bold" marginBottom={5}>
            未完成
          </Text>
        )}

        {pendingTodoItems.map((todoItem: TodoItem) => {
          return (
            <TouchableOpacity
              disabled={isEventViewer}
              style={todoItemStyles.itemRow}
              key={todoItem.id}
              onPress={() =>
                navigation.push('EditStackScreen', {
                  screen: 'EditTodoItem',
                  params: {
                    id: todoItem.id,
                    itemName: todoItem.to_do_item,
                    dueDate: todoItem.to_do_date,
                    remarks: todoItem.to_do_remarks,
                    isCompleted: todoItem.is_finished,
                  },
                })
              }
            >
              <TodoItem
                isFinished={todoItem.is_finished}
                itemName={todoItem.to_do_item}
                dueDate={todoItem.to_do_date}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {completedTodoItems.length > 0 && (
        <View marginTop={20}>
          <Text fontSize={25} marginLeft={1} fontWeight="bold" marginBottom={5}>
            已完成
          </Text>
        </View>
      )}

      {completedTodoItems.map((todoItem: TodoItem) => {
        return (
          <TouchableOpacity
            disabled={isEventViewer}
            style={todoItemStyles.itemRow}
            key={todoItem.id}
            onPress={() =>
              navigation.push('EditStackScreen', {
                screen: 'EditTodoItem',
                params: {
                  id: todoItem.id,
                  itemName: todoItem.to_do_item,
                  dueDate: todoItem.to_do_date,
                  remarks: todoItem.to_do_remarks,
                  isCompleted: todoItem.is_finished,
                },
              })
            }
          >
            <TodoItem
              isFinished={todoItem.is_finished}
              itemName={todoItem.to_do_item}
              dueDate={todoItem.to_do_date}
            />
          </TouchableOpacity>
        );
      })}

      {todoList.length === 0 && !isEventViewer && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateStackScreen', {
              screen: 'AddTodoItem',
            })
          }
        >
          <Text fontSize={18} color="danger.600" marginTop={7}>
            尚未有待辦事項，按此新增
          </Text>
        </TouchableOpacity>
      )}
    </TopBar>
  );
}

const todoItemStyles = StyleSheet.create({
  itemRow: {
    marginBottom: 10,
  },
});
