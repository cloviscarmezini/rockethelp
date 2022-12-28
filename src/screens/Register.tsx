import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation  = useNavigation();

  async function handleNewOrderRegister() {
    if(!patrimony || !description) {
      return Alert.alert('Preencha todos os campos');
    }

    try {
      setIsLoading(true);
  
      await firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      }).catch(error=> {
        throw error;
      });

      Alert.alert("Solicitação", "Solicitação registrada com sucesso!");
      navigation.goBack();
    } catch(error) {
      setIsLoading(false);
      Alert.alert('Erro ao adicionar solicitação');
    }
  }

  return (
    <VStack
      flex={1}
      p={6}
      bg="gray.600"
    >

      <Header title="Solicitação" />

      <Input
        placeholder="Número do Patrimônio"
        value={patrimony}
        onChangeText={setPatrimony}
        mt={4}
      />

      <Input
        placeholder='Descrição do problema'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}