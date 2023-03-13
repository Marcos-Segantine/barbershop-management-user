import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  View,
  Modal,
} from 'react-native';

import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

import { useContext, useState } from 'react';

import auth from '@react-native-firebase/auth';

import { globalStyles } from '../globalStyles';
import { SomethingWrong } from '../../context/somethingWrong';

export const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const { setSomethingWrong } = useContext(SomethingWrong)

  const handleForgotPassword = () => {
    try {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setModalVisible(true);
        })
        .catch(err => {

          console.log(err);
        });

    } catch (error) {
      console.log(error);
      setSomethingWrong(true)
    }
  };

  return (
    <>
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={style.contentModal}>
          <Text style={style.text}>
            Email enviado para
            <Text style={style.email}>{`\n ${email}\n`}</Text>
            com sucesso!
          </Text>
          <Text style={style.text}>
            Verifique sua caixa de mensagens para redefinir sua senha.
          </Text>
          <Button text="OK" action={() => navigation.navigate('Login')} />
        </View>
      </Modal>

      <SafeAreaView style={[globalStyles.container, style.container]}>
        <View style={style.content}>
          <Title
            title={
              'Enviaremos uma email para que você possa redefinir sua senha'
            }
          />

          <TextInput
            style={style.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Button
          text={'Enviar'}
          action={handleForgotPassword}
          waitingData={!!email}
        />
      </SafeAreaView>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  input: {
    borderWidth: 3,
    borderColor: '#E95401',
    borderRadius: 20,
    width: '80%',
    marginVertical: 5,
    paddingHorizontal: 13,
    paddingVertical: 17,
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF80',
    marginTop: '20%',
  },

  contentModal: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flex: 1,
    paddingHorizontal: 10,
  },

  email: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20,
  },

  text: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '600',
    color: '#E9E8E8',
    marginBottom: 20,
  },
});
