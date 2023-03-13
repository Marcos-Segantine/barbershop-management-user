import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '@react-native-firebase/auth';

export const handleLogOut = async (setUserData, navigation, setSomethingWrong) => {
    try {
        const keys = ['@barber_app__email', '@barber_app__password'];
        await AsyncStorage.multiRemove(keys);

        await auth().signOut();
        setUserData(null);
        navigation.navigate('InitialScreen');
    } catch (error) {
        console.error('Error logging out:', error);
        setSomethingWrong(true)
    }
}
