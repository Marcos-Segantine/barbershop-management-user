import { Modal, View, StyleSheet } from "react-native"

import { useNavigation } from "@react-navigation/native"

import { Title } from "../Title"
import { Button } from "../Button"
import { useContext } from "react"
import { SomethingWrong } from "../../context/somethingWrong"

export const SomethingWentWrong = () => {

    const navigation = useNavigation()

    const { somethingWrong, setSomethingWrong } = useContext(SomethingWrong)

    return (
        <Modal
            visible={somethingWrong}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.container}>
                <Title title={"Algo deu errado!!"} />

                <Button text={"Voltar a pagina inicial"} action={() => {
                    setSomethingWrong(false)
                    navigation.navigate("InitialScreen")
                }
                } />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E1E1E',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})