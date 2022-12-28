import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';

import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface RouteParams  {
  orderId: string;
}

type OrderDetailsProps = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const route = useRoute();
  const navigation = useNavigation();

  const { colors } = useTheme();

  const { orderId } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [order, setOrder] = useState<OrderDetailsProps>({} as OrderDetailsProps);

  const [solution, setSolution] = useState('');

  async function handleOrderClose() {
    if(!solution) {
      return Alert.alert('Solicitação', 'Preencha a solução');
    }

    setIsSubmiting(true);

    await firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      solution,
      status: 'closed',
      closed_at: firestore.FieldValue.serverTimestamp()
    }).catch(error=> {
      Alert.alert('Erro ao fechar solicitação');
      setIsSubmiting(false);
    });

    Alert.alert('Solicitação', 'Solicitação encerrada com sucesso!');
    navigation.goBack();
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then(doc => {
      const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    })
  }, []);

  return (
    <VStack
        flex={1}
        bg="gray.700"
    >
      <Box px={6} bg="gray.600">
        <Header title="Solicitação"/>
      </Box>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <HStack
              bg="gray.500"
              justifyContent="center"
              p={4}
            >
              { order.status === 'closed'
                ? <CircleWavyCheck size={22} color={colors.green[300]} />
                : <Hourglass size={22} color={colors.secondary[700]} />
              }

              <Text
                fontSize="sm"
                color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                ml={2}
                textTransform="uppercase"
              >
                {order.status === 'closed' ? 'Finalizado' : 'Em andamento'}
              </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
              <CardDetails
                title="Equipamento"
                description={`Patrimônio ${order.patrimony}`}
                icon={DesktopTower}
              />

              <CardDetails
                title="Descrição do problema"
                description={order.description}
                icon={ClipboardText}
                footer={`Registrado em ${order.when}`}
              />

              <CardDetails
                title="Solução"
                icon={CircleWavyCheck}
                description={order.solution}
                footer={order.closed && `Encerrado em ${order.closed}`}
              >
                { order.status === 'open' && (
                  <Input
                    placeholder='Descrição da solução'
                    onChangeText={setSolution}
                    h={24}
                    textAlignVertical='top'
                    multiline
                  />
                )}
              </CardDetails>
            </ScrollView>

            { order.status === 'open' && 
              <Button
                title="Encerrar solicitação"
                m={5}
                isLoading={isSubmiting}
                onPress={handleOrderClose}
              />
            }
          </>
        )}
    </VStack>
  );
}