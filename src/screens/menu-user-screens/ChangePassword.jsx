import React, { useState, useContext } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { globalStyles } from '../globalStyles';
import { Title } from '../../components/Title';
import { Button } from '../../components/Button';
import { MessageError } from '../../components/MessageError';

import { UserContext } from '../../context/UserContext';

import { handleNewPassword } from '../../functions/user/handleNewPassword';
import { SomethingWrong } from '../../context/somethingWrong';

export const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [messageError, setMessageError] = useState('');
  
  const { userData, setUserData } = useContext(UserContext);
  const {setSomethingWrong} = useContext(SomethingWrong)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container}>
      <MessageError
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        messageError={messageError}
        action={() => setModalVisible(false)}
      />
      <Title title={'Redefinir senha'} />

      <View style={style.content}>
        <View style={style.inputContainer}>
          <Text style={style.textOrientation}>Digite sua senha atual.</Text>
          <TextInput
            placeholder="Senha atual"
            value={oldPassword}
            onChangeText={setOldPassword}
            style={style.input}
            secureTextEntry
          />
        </View>

        <View style={style.inputContainer}>
          <Text style={style.textOrientation}>Informe sua nova senha.</Text>
          <TextInput
            placeholder="Senha nova"
            value={newPassword}
            onChangeText={setNewPassword}
            style={style.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirme sua nova senha"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={style.input}
            secureTextEntry
          />
        </View>
      </View>

      <Button text="Comfirmar" action={() =>
        handleNewPassword(
          oldPassword,
          newPassword,
          confirmNewPassword,
          setModalVisible,
          setMessageError,
          navigation,
          userData,
          setUserData,
          setSomethingWrong
        )} />
    </KeyboardAvoidingView>
  );
};
const style = StyleSheet.create({
  content: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },

  textOrientation: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
  },

  input: {
    borderWidth: 3,
    borderColor: '#E95401',
    borderRadius: 20,
    width: '100%',
    marginVertical: 5,
    paddingHorizontal: 13,
    paddingVertical: 17,
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF80',
  },
});
