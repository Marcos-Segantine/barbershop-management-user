import { View, StyleSheet, Pressable, Text } from 'react-native'

import { Header } from '../../shared/Header'
import { Footer } from '../../shared/Footer'

import { Title } from '../../components/Title'

import auth from '@react-native-firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage"

export const Main = ({ navigation }) => {

    const handleLogOut = async() => {
        if(
            JSON.parse(await AsyncStorage.getItem('@barber_app__email')) &&
            JSON.parse(await AsyncStorage.getItem('@barber_app__password'))) 
            {
                const keys = ['@barber_app__email', '@barber_app__password']
                try {
                    await AsyncStorage.multiRemove(keys)
                } catch(e) {

                }
                    
                auth().signOut()
                    .then(() => {
                        navigation.navigate("InitialScreen")
                    })
                }
    };


    return(
        <View style={style.container}>
            <Header />

            <Title title={"Olá, Marcos"} />

            <View style={style.contentLinks}>
                <Pressable style={style.link}>
                    <Text style={style.text} onPress={() => navigation.navigate("YourSchedules")}>
                        Seus agendamentos
                    </Text>
                </Pressable>

                <Pressable style={style.link}>
                    <Text style={style.text}>
                        Suas informações
                    </Text>
                </Pressable>

                <Pressable style={style.link}>
                    <Text style={style.text}>
                        Redefinir senha
                    </Text>
                </Pressable>

                <Pressable style={style.link}>
                    <Text style={style.text}>
                        Enviar um feedback
                    </Text>
                </Pressable>

                <Pressable style={style.link} onPress={handleLogOut}>
                    <Text style={style.text}>
                        Sair
                    </Text>
                </Pressable>


            </View>

            <Footer />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        flex: 1,
        alignItems: 'center',
    },

    contentLinks: {
        width: "100%",
        alignItems: "center",
        marginTop: 50,
    },

    link: {
        width: "80%",
        paddingVertical: 17,
        borderWidth: 3,
        borderColor: "#E95401",
        marginVertical: 5,
        borderRadius: 20,
    },

    text: {
        color: "#FFFFFF",
        fontWeight: '700',
        textAlign: "center"
    }
})