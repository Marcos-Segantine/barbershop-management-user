import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { generateNewUid } from '../../utils/generateNewUid';

import { AccountCreated } from '../../assets/imgs/AccountCreated';

export const createUserWithEmailAndPassword = async (
  informationNewUser,
  password,
  navigation,
  setIsLoading,
  setModalInfo,
  setSomethingWrong
) => {

  try {

    setIsLoading(true)

    try {

      await auth().createUserWithEmailAndPassword(informationNewUser.email, password).then((res) => {
        res.user.sendEmailVerification()
      })

    } catch (error) {
      console.log(error.message);

      // IF THIS ERROR OCCURRED IS BECAUSE THE USER IS CREATING NEW ACCOUNT BY GOOGLE
      if (error.message === "[auth/email-already-in-use] The email address is already in use by another account.") {
        auth().currentUser.updatePassword(password)

      } else {
        setIsLoading(false)
        setSomethingWrong(true)
      }
    }

    const uid = generateNewUid()

    if (informationNewUser.profilePicture) {
      const reference = storage().ref("clients/profilePictures/" + uid);
      await reference.putString(informationNewUser.profilePicture, 'base64')

    }

    const url = informationNewUser.profilePicture ? await storage().ref("clients/profilePictures/" + uid).getDownloadURL() : null

    const scheduleDoc = firestore().collection('schedules_by_user').doc(uid);
    scheduleDoc.set({ schedules: [] })

    const userDoc = firestore().collection('users').doc(uid);

    userDoc.set({
      name: informationNewUser.name,
      nickname: informationNewUser.nickname,
      email: informationNewUser.email,
      password: password,
      phone: informationNewUser.phone,
      gender: informationNewUser.gender,
      profilePicture: url,
      uid: uid,
    })

    AsyncStorage.setItem('@barber_app__email', informationNewUser.email)

    setIsLoading(false)

    setModalInfo({
      image: <AccountCreated />,
      mainMessage: "Parabéns",
      message: "Sua conta foi criada com sucesso, agora é só ir para a tela de autenticação e realizar o login",
      firstButtonText: "Ir agora",
      firstButtonAction: () => {
        navigation.navigate("Login", { emailNewUser: informationNewUser.email, passwordNewUser: password })
        setModalInfo(null)
      },
    })

  } catch (error) {

    console.error(error);
    setIsLoading(false)
    setSomethingWrong(true)
  }
}