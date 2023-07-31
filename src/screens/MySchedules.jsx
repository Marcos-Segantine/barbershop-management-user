import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useContext, useEffect, useState } from "react"

import { UserContext } from "../context/UserContext"
import { SomethingWrongContext } from "../context/SomethingWrongContext"

import { globalStyles } from "../assets/globalStyles"

import { HeaderScreensMenu } from "../components/HeaderScreensMenu"
import { Menu } from "../components/Menu"
import { Schedule } from "../components/Schedule"
import { Button } from "../components/Button"
import { NoSchedule } from "../components/NoSchedule"
import { Loading } from "../components/Loading"

import { listenerUserSchedules } from "../services/user/listenerUserSchedules"


export const MySchedules = ({ navigation }) => {
    const [schedulesUser, setSchedulesUser] = useState(null)
    const { userData } = useContext(UserContext)
    const { setSomethingWrong } = useContext(SomethingWrongContext)

    useEffect(() => {
        listenerUserSchedules(userData, setSchedulesUser, setSomethingWrong)

    }, []);

    if (schedulesUser == null) return <Loading flexSize={1} />

    return (
        <>
            <ScrollView contentContainerStyle={globalStyles.container}>
                <HeaderScreensMenu screenName={"Meus Horários"} />

                {
                    !schedulesUser.length && <NoSchedule width={300} height={300} />
                }

                <View style={{ marginBottom: 50, width: "100%" }}>
                    {
                        schedulesUser && (
                            schedulesUser.map((schedule, index) => (
                                <Schedule
                                    schedule={schedule}
                                    key={index}
                                />
                            ))
                        )
                    }
                </View>

                {
                    schedulesUser?.length < 2 &&
                    <Button
                        text={"Agendar um horário"}
                        action={() => navigation.navigate("NewSchedule", { headerText: "Agendar Horário", scheduleToUpdate: null, isToUpdateSchedule: null })}
                        addStyles={{ alignSelf: "center", marginBottom: 30, width: "75%" }}
                    />
                }
            </ScrollView>
            <Menu />
        </>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#000000",
        fontFamily: globalStyles.fontFamilyMedium,
        width: "100%",
        fontSize: globalStyles.fontSizeSmall,
        textAlign: "center",
        marginTop: 30,
    },
})