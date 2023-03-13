import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { UserContext } from '../../context/UserContext';

import { globalStyles } from '../globalStyles';

import { Title } from '../../components/Title';
import { Button } from '../../components/Button';
import { LoadingAnimation } from '../../components/LoadingAnimation';

import { ChangeInformations } from '../../components/modals/ChangeInformations';

import { hadleNewInfomation } from '../../functions/user/hadleNewInfomation';
import { formatPhoneNumber } from '../../functions/helpers/formatPhoneNumber';
import { SomethingWrong } from '../../context/somethingWrong';

export const ChangeInformation = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [confirm, setConfirm] = useState(null);
  const [phoneChange, setPhoneChange] = useState(false);
  const [emailChange, setEmailChange] = useState(false);
  const [nameChange, setNameChange] = useState(false);

  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [isToShowLoading, setIsToShowLoading] = useState(false);

  const { userData, setUserData } = useContext(UserContext);
  const { setSomethingWrong } = useContext(SomethingWrong)

  const handleInformations = () => [
    hadleNewInfomation(
      phone,
      name,
      email,
      setPhone,
      setName,
      setEmail,
      setPhoneChange,
      setNameChange,
      setEmailChange,
      setError,
      setMessageError,
      setIsToShowLoading,
      userData,
      setUserData,
      setConfirm,
      setSomethingWrong
    ),
  ];

  return (
    <View style={globalStyles.container}>
      <ChangeInformations
        confirm={confirm}
        phone={phoneChange}
        name={nameChange}
        email={emailChange}
        setPhoneChange={setPhoneChange}
        setNameChange={setNameChange}
        setEmailChange={setEmailChange}
      />

      {isToShowLoading ? (
        <LoadingAnimation isToShow={isToShowLoading} />
      ) : (
        <View style={styles.wrapper}>
          <Title title="Mudar informações" />
          <TextInput
            value={name}
            style={styles.input}
            placeholder="Nome"
            onChangeText={text => setName(text)}
          />
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={phone}
            placeholder="Número"
            onChangeText={text => setPhone(formatPhoneNumber(text))}
            keyboardType="numeric"
          />
          {error && <Text style={styles.errorMessage}>{messageError}.</Text>}
          <Button text="Salvar" action={handleInformations} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },

  input: {
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#E95401',
    width: '80%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  errorMessage: {
    color: 'red',
  },
});
