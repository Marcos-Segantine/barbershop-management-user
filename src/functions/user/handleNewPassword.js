import { firebase, firestore } from '@react-native-firebase/auth';

export const handleNewPassword = async (
    oldPassword,
    newPassword,
    confirmNewPassword,
    setModalVisible,
    setMessageError,
    navigation,
    userData,
    setUserData,
    setSomethingWrong
) => {
    if (
        !oldPassword.trim() ||
        !newPassword.trim() ||
        !confirmNewPassword.trim()
    ) {
        setModalVisible(true);
        setMessageError('Por favor preencha todos os campos');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        setModalVisible(true);
        setMessageError('Os campos da nova senha não são iguais');
        return;
    }

    if (userData.password !== oldPassword) {
        setModalVisible(true);
        setMessageError('Senha Incorreta');
        return;
    }

    if (newPassword.length < 6) {
        setModalVisible(true);
        setMessageError('Nova senha muito pequena');
        return;
    }

    try {
        const user = firebase.auth().currentUser;
        await user.updatePassword(newPassword);
        await firestore()
            .collection('users')
            .doc(user.uid)
            .update({ password: newPassword });
        setUserData({ ...userData, password: newPassword });
        navigation.navigate('Main');
    } catch (error) {
        console.log('Erro ao atualizar a senha: ', error);
        setSomethingWrong(true)
    }
};