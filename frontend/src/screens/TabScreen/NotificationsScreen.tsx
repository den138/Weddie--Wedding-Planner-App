import { VStack, Text, Box, Heading, HStack, View } from 'native-base';
import React, { useState } from 'react';
import TopBar from '../../components/TopBar';
import { useSelector } from 'react-redux';
import { config } from '../../../app.json';
import { IRootState } from '../../redux/store';
import { useRefreshOnFocus } from '../../../hooks/useRefreshOnFoncus';
import { useQuery } from 'react-query';
import { LoadingMsg } from '../../components/LoadingsMsg';
import { ErrorMsg } from '../../components/ErrorMsg';
import { roleList } from '../../../utils/roleList';

interface Message {
  id: number;
  wedding_event_id: number;
  content: string;
  created_at: string;
  message_id: number;
  role_id: number;
}

export default function NotificationsScreen() {
  let eventId = useSelector(
    (state: IRootState) => state.event.event?.wedding_event_id
  );
  const role = useSelector((state: IRootState) => state.event.event?.role);
  const token = useSelector((state: IRootState) => state.auth.token);
  const [messageList, setMessageList]: any[] = useState([]);
  const [counter, setCounter] = useState(0);

  if (!eventId) {
    eventId = 0;
  }

  const roleId = roleList.find((roleObj) => roleObj.role === role)?.id;

  let isMessageSender: boolean;
  if (role === '新郎' || role === '新娘') {
    isMessageSender = true;
  } else {
    isMessageSender = false;
  }
  const { isLoading, error, status, data } = useQuery(
    ['notiData', { eventId, counter }],
    async () => {
      if (eventId && eventId !== 0) {
        let resp;

        if (isMessageSender) {
          resp = await fetch(
            `${config.BACKEND_URL}/api/message/list/all/${eventId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          resp = await fetch(
            `${config.BACKEND_URL}/api/message/list/${eventId}/${roleId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        const data = await resp.json();

        setMessageList(data.messageList);
      }
    }
  );

  useRefreshOnFocus(() => {
    setCounter((counter) => counter + 1);
  });

  if (isLoading) return <LoadingMsg />;

  if (error) return <ErrorMsg />;

  const messageRoleIdMap = new Map();
  if (messageList) {
    for (const messageObj of messageList) {
      const messageId = messageObj.message_id;
      const roleId = messageObj.role_id;

      if (messageRoleIdMap.has(messageId)) {
        messageRoleIdMap.get(messageId).push(roleId);
      } else {
        messageRoleIdMap.set(messageId, [roleId]);
      }
    }
  }
  let messageIdArr: number[] = [];

  return (
    <TopBar
      pageName="訊息通知"
      show={isMessageSender ? 'true' : 'false'}
      navigate="AddMessage"
    >
      {messageList &&
        messageList.map((message: Message, idx: number) => {
          const messageId = message.message_id;

          if (messageIdArr.find((id) => id === messageId)) {
            return;
          } else {
            messageIdArr.push(message.message_id);
          }

          return (
            <Box
              key={message.id}
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
                    <Heading size="md" fontSize={25}>
                      {message.content}
                    </Heading>
                  </View>
                  <View
                    marginTop={3}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <View width="35%">
                      <Text>
                        {new Date(message.created_at)
                          .toLocaleString('zh-hk')
                          .slice(0, 16)}
                      </Text>
                    </View>
                    {(role === '新郎' || role === '新娘') && (
                      <View
                        width="65%"
                        display="flex"
                        flexDirection="row"
                        flexWrap="wrap"
                      >
                        {roleList.map((roleObj) => {
                          const roleIdArr = messageRoleIdMap.get(
                            message.message_id
                          );

                          if (
                            roleIdArr.find((ele: number) => ele == roleObj.id)
                          ) {
                            return (
                              <Box
                                marginLeft={1}
                                marginTop={2}
                                key={roleObj.id}
                                px="2"
                                py="0.5"
                                rounded="md"
                                bg="secondary.500"
                              >
                                <Text fontSize="md" color="white">
                                  {roleObj.role}
                                </Text>
                              </Box>
                            );
                          }
                        })}
                      </View>
                    )}
                  </View>
                </VStack>
              </HStack>
            </Box>
          );
        })}
    </TopBar>
  );
}
