import React, { useState } from 'react';
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';

import { VStack, Heading, Icon, useTheme } from 'native-base';

import Logo from '../assets/logo_primary.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { Envelope, Key } from 'phosphor-react-native';

export function SignIn() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    if(!email || !password) {
      return Alert.alert('Informe seu e-mail e senha');
    }

    setIsLoading(true);

    try {
      const response = await auth().signInWithEmailAndPassword(email, password);

      console.log(response)
    } catch (error) {
      return Alert.alert('E-mail ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack
      flex={1}
      alignItems="center"
      bg="gray.600"
      px={8}
      pt={24}
    >
      <Logo />

      <Heading
        color="gray.100"
        fontSize="xl"
        mt={20}
        mb={6}
      >
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        onChangeText={setEmail}
        InputLeftElement={
          <Icon
            as={<Envelope color={colors.gray[300]}/>}
            ml={4}
          />
        }
      />

      <Input
        mb={8}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        InputLeftElement={
          <Icon
            as={<Key color={colors.gray[300]}/>}
            ml={4}
          />
        }
      />

      <Button
        title="Entrar"
        w="full"
        isLoading={isLoading}
        onPress={handleSignIn}
      />

    </VStack>
  );
}