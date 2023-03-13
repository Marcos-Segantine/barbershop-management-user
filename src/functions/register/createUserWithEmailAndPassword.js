import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createUserWithEmailAndPassword = async (
  email,
  password,
  comfirmPassword,
  phone,
  name,
  setMessageError,
  setModalVisible,
  setModalMessageEmailVerification,
  setPhoneVerificationVisible,
) => {
  const isFieldsValid =
    email &&
    password &&
    comfirmPassword &&
    phone &&
    name &&
    password === comfirmPassword;

  if (!isFieldsValid) {
    setModalVisible(true);
    setMessageError('Por favor preencha todos os campos');
    return;
  }

  try {
    const res = await auth().createUserWithEmailAndPassword(email, password);
    const uid = res.user.uid;
    const userDoc = firestore().collection('users').doc(uid);
    const scheduleDoc = firestore().collection('schedules_by_user').doc(uid);

    await Promise.all([
      userDoc.set({
        name,
        email,
        password,
        phone,
        uid,
      }),
      scheduleDoc.set({schedules: []}),
      AsyncStorage.setItem('@barber_app__email', email),
      AsyncStorage.setItem('@barber_app__password', password),
      res.user.sendEmailVerification(),
    ]);

    setPhoneVerificationVisible(true)
    setModalMessageEmailVerification(true);
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        setMessageError('Email inválido');
        break;
      case 'auth/email-already-in-use':
        setMessageError('Email já está em uso');
        break;
      default:
        setMessageError('Ocorreu um erro');
        break;
    }
    setModalVisible(true);
  }
};
