import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';

import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

import { useState } from 'react';

import { MessageError } from '../../components/MessageError';

import { createUserWithEmailAndPassword } from '../../functions/register/createUserWithEmailAndPassword';

import { SignInWithGoogle } from '../../components/modals/SignInWithGoogle';

import { EmailVerificationModal } from '../../components/modals/EmailVerificationModal';
import { PhoneVerificationModal } from '../../components/modals/PhoneVerificationModal';

export const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [messageError, setMessageError] = useState('');

  const [phoneVerificationVisible, setPhoneVerificationVisible] = useState(false);

  const [modalMessageEmailVerification, setModalMessageEmailVerification] =
    useState(false);

  const [MessageErrorEmailVerified, setMessageErrorEmailVerified] =
    useState(false);

  return (
    <ScrollView contentContainerStyle={style.container}>
      <EmailVerificationModal
        email={email}
        password={password}
        MessageErrorEmailVerified={MessageErrorEmailVerified}
        setModalMessageEmailVerification={setModalMessageEmailVerification}
        setMessageErrorEmailVerified={setMessageErrorEmailVerified}
        modalMessageEmailVerification={modalMessageEmailVerification}
      />

      <PhoneVerificationModal
        visible={phoneVerificationVisible}
        setVisible={setPhoneVerificationVisible}
        phone={phone}
      />

      <MessageError
        modalVisible={modalVisible}
        messageError={messageError}
        setModalVisible={setModalVisible}
        action={() => setModalVisible(false)}
      />

      <Title title="Preencha os campos abaixo" />

      <View style={style.form}>
        <TextInput
          onChangeText={text => setName(text)}
          placeholder="Nome completo"
          placeholderTextColor={'#FFFFFF80'}
          style={style.input}
        />
        <TextInput
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          placeholderTextColor={'#FFFFFF80'}
          style={style.input}
          keyboardType="email-address"
        />
        <TextInput
          onChangeText={text => setPhone(text)}
          placeholder="Telefone"
          placeholderTextColor={'#FFFFFF80'}
          style={style.input}
          keyboardType="numeric"
        />
        <TextInput
          onChangeText={text => setPassword(text)}
          placeholder="Crie uma senha"
          placeholderTextColor={'#FFFFFF80'}
          style={style.input}
          secureTextEntry={true}
        />
        <TextInput
          onChangeText={text => setComfirmPassword(text)}
          placeholder="Confirme sua senha"
          placeholderTextColor={'#FFFFFF80'}
          style={style.input}
          secureTextEntry={true}
        />
      </View>

      <View style={style.linksHelpUser}>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={style.linkHelp}>Login</Text>
        </Pressable>
      </View>

      <Button
        text="Cadastrar"
        action={() =>
          createUserWithEmailAndPassword(
            email,
            password,
            comfirmPassword,
            phone,
            name,
            setMessageError,
            setModalVisible,
            setModalMessageEmailVerification,
            setPhoneVerificationVisible,
          )
        }
      />

      <Text style={style.text}>Registrar usando sua conta do Google</Text>

      <SignInWithGoogle />
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  form: {
    width: '80%',
    marginTop: 15,
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

  linksHelpUser: {
    width: '80%',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 15,
  },

  linkHelp: {
    color: '#FFFFFF',
  },

  text: {
    color: '#FFFFFF',
    marginTop: 40,
    fontWeight: '700',
    fontSize: 15,
  },
});
