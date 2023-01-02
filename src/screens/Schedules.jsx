import { Text, View, StyleSheet, Pressable } from "react-native"

import { Header } from "../shared/Header"
import { Footer } from "../shared/Footer"
import { Title } from "../components/Title"
import { Button } from "../components/Button"

export const Schedules = () => {
    return(
        <View style={style.container}>
            <Header />

            <Title title="Selecione um horário" />
        
            <View style={style.schedules}>
                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>

                <Pressable style={style.schedule}>
                    <Text style={style.textSchedule}>09:00</Text>
                </Pressable>
            </View>

            <Button text="Comfirmar" />
            <Footer />  
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        alignItems: "center",
    },

    schedules: {
        width: "90%",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 50,
    },

    schedule: {
        borderWidth: 3,
        borderColor: "#E95401",
        borderRadius: 20,
        width: "48%",
        paddingHorizontal: 60,
        paddingVertical: 9,
        marginVertical: 5,
        marginHorizontal: 3,
    },

    textSchedule: {
        color: "#FFFFFF",
        fontWeight: '700',
        fontSize: 16,
    },
})