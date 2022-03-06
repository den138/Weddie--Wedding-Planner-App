import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import TopBar from '../../components/TopBar';
import {
  View,
  Text,
  HStack,
  Box,
  Heading,
  VStack,
  Button,
  Select,
  CheckIcon,
} from 'native-base';
import { useSelector } from 'react-redux';
import { config } from '../../../app.json';
import { useQuery } from 'react-query';
import { ErrorMsg } from '../../components/ErrorMsg';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { IRootState } from '../../redux/store';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';
import { ProgressChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { budgetCategoryList } from '../../../utils/budgetCategoryList';

interface Expenditure {
  id: number;
  wedding_event_id: number;
  budget_cat_id: number;
  description: string;
  expenditure: number;
}

export default function BudgetScreen({ navigation }: { navigation: any }) {
  const { height, width } = useWindowDimensions();
  const [sorting, setSorting] = useState(false);

  let eventData: any = useSelector((state: IRootState) => state.event.event);

  if (!eventData) {
    eventData = {
      budget: '',
      wedding_event_id: '',
    };
  }

  const budget = parseInt(eventData.budget);
  const eventId = eventData.wedding_event_id;
  const [counter, setCounter] = useState(0);
  const [expenditureList, setExpenditureList]: any = useState([]);
  const [selectedExpenditureList, setSelectedExpenditureList]: any = useState(
    []
  );

  const role = useSelector((state: IRootState) => state.event.event?.role);

  let isEventViewer = !(role === '新郎' || role === '新娘');
  // if (role === '新郎' || role === '新娘') {
  //   isEventViewer = false;
  // } else {
  //   isEventViewer = true;
  // }

  const { isLoading, error, status, data } = useQuery(
    ['budgetData', { eventId, counter }],
    () => {
      if (eventId && eventId !== 0) {
        fetch(`${config.BACKEND_URL}/api/budget/list/${eventId}`)
          .then((res) => res.json())
          .then((data) => {
            setExpenditureList(data.expenditureList);
            setSelectedExpenditureList(data.expenditureList);
          });
      }
    }
  );

  useRefreshOnFocus(() => {
    setCounter((counter) => counter + 1);
  });

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  const totalExpenditure = expenditureList.reduce(
    (pre: number, cur: Expenditure) => {
      return pre + cur.expenditure;
    },
    0
  );

  const chartData = {
    labels: ['支出'],
    data: [totalExpenditure / budget],
  };

  return (
    <TopBar pageName="婚禮預算" show="true" navigate="AddBudgetItem">
      {totalExpenditure <= budget && (
        <ProgressChart
          data={chartData}
          width={width * 0.9}
          height={height * 0.2}
          strokeWidth={20}
          radius={65}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            // f2f2f2
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(233, 30, 98, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(233, 30, 98, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          hideLegend={true}
        />
      )}

      <View mb={5} mt={3} marginX={2}>
        <View display="flex" flexDirection="row" justifyContent="space-between">
          <Text fontSize={22}>總預算</Text>
          <Text fontSize={22}>{budget}</Text>
        </View>
        <View display="flex" flexDirection="row" justifyContent="space-between">
          <Text fontSize={22}>總支出</Text>
          <Text fontSize={22}>{totalExpenditure}</Text>
        </View>
        <View display="flex" flexDirection="row" justifyContent="space-between">
          <Text fontSize={22}>剩餘預算</Text>
          <Text fontSize={22}>{budget - totalExpenditure}</Text>
        </View>
      </View>
      <View borderBottomColor="black" borderBottomWidth={1} />
      <View marginTop={5}>
        <View style={budgetStyles.addRow}>
          <Text
            fontSize={24}
            fontWeight="bold"
            marginLeft={2}
            color="secondary.500"
          >
            支出
          </Text>

          <View>
            <Select
              defaultValue="all"
              minWidth="200"
              _selectedItem={{
                bg: 'secondary.500',
                endIcon: <CheckIcon size="5" />,
              }}
              fontSize="lg"
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedExpenditureList(expenditureList);
                } else {
                  const selectedList = expenditureList.filter(
                    (expenditure: any) => {
                      return expenditure.budget_cat_id === parseInt(value);
                    }
                  );
                  setSelectedExpenditureList(() => selectedList);
                }
              }}
            >
              <Select.Item label="全部" value="all" />
              {budgetCategoryList.map((budgetCat) => {
                return (
                  <Select.Item
                    key={budgetCat.id}
                    label={budgetCat.category}
                    value={String(budgetCat.id)}
                  />
                );
              })}
            </Select>
          </View>

          <Button
            backgroundColor="#f2f2f2"
            size="lg"
            marginRight={15}
            onPress={() => {
              const sortedExpenditureList = expenditureList.sort(
                (a: Expenditure, b: Expenditure) => {
                  if (sorting) {
                    return a.expenditure - b.expenditure;
                  } else {
                    return b.expenditure - a.expenditure;
                  }
                }
              );
              setSorting(!sorting);
              setExpenditureList(sortedExpenditureList);
            }}
          >
            <Ionicons name="ios-funnel-outline" color="#e91e63" size={30} />
          </Button>
        </View>

        {selectedExpenditureList.map(
          (expenditure: Expenditure, idx: number) => {
            return (
              <TouchableOpacity
                disabled={isEventViewer}
                key={expenditure.id}
                style={budgetStyles.tableRow}
                onPress={() =>
                  navigation.navigate('EditStackScreen', {
                    screen: 'EditBudgetItem',
                    params: {
                      id: expenditure.id,
                      categoryId: expenditure.budget_cat_id,
                      expenditure: expenditure.expenditure,
                      description: expenditure.description,
                    },
                  })
                }
              >
                <Box
                  py="3"
                  alignSelf="center"
                  width="100%"
                  maxWidth="100%"
                  borderBottomWidth="1"
                  borderColor="muted.300"
                >
                  <HStack>
                    <VStack>
                      <View>
                        <Heading size="md">{expenditure.description}</Heading>
                      </View>
                      <View>
                        <Text fontSize="md">
                          {
                            budgetCategoryList.find(
                              (budgetCat) =>
                                budgetCat.id === expenditure.budget_cat_id
                            )?.category
                          }
                        </Text>
                      </View>
                    </VStack>
                    <Box
                      flex="1"
                      flex-direction="column"
                      alignItems="flex-end"
                      justifyContent="flex-end"
                    >
                      <Box px="2" py="0.5" rounded="md">
                        <Text fontSize="lg" color="black" fontFamily="arial">
                          ${expenditure.expenditure}
                        </Text>
                      </Box>
                    </Box>
                  </HStack>
                </Box>
              </TouchableOpacity>
            );
          }
        )}
      </View>
    </TopBar>
  );
}

const budgetStyles = StyleSheet.create({
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 3,
  },
  touch: {
    marginBottom: 8,
  },
  button: {
    width: 90,
    borderRadius: 10,
  },
  addRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
