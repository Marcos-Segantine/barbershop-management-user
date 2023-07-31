import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native"
import { useContext, useEffect, useState } from "react"

import { ComeBack } from "../components/ComeBack"
import { Service } from "../components/Service"
import { Button } from "../components/Button"
import { Loading } from "../components/Loading"

import { globalStyles } from "../assets/globalStyles"
import { CloseIcon } from "../assets/icons/CloseIcon"

import { ScheduleContext } from "../context/ScheduleContext"
import { SomethingWrongContext } from "../context/SomethingWrongContext"

import { formatServicePrice } from "../utils/formatServicePrice"

import { getServicesOfProfessional } from "../services/schedules/getServicesOfProfessional"

export const OurServices = ({ navigation, route }) => {
    const [services, setServices] = useState(null)
    const [servicesSelected, setServicesSelected] = useState([])

    const { schedule, setSchedule } = useContext(ScheduleContext)
    const { setSomethingWrong } = useContext(SomethingWrongContext)

    const { scheduleToUpdate, isToUpdateSchedule } = route.params ? route.params : {}

    useEffect(() => {
        (async () => {

            schedule.professionalUid && setServices(await getServicesOfProfessional(schedule.professionalUid, setSomethingWrong))

        })();
    }, [schedule])

    const removeServiceSelected = (serviceToRemove) => {
        const dataTemp = servicesSelected.filter(service => service.name !== serviceToRemove)

        setServicesSelected([...dataTemp])
    }

    const handleConfirm = () => {
        setSchedule({ ...schedule, services: servicesSelected })
        navigation.navigate("ConfirmSchedule", { scheduleToUpdate, isToUpdateSchedule })
    }

    const scrollServicesHeight = 60 - servicesSelected.length * 5
    const totalPriceServicesSelected = formatServicePrice(servicesSelected.reduce((acc, service) => acc + Number(service.price), 0))

    if(services === null) return <Loading flexSize={1} />

    return (
        <View style={globalStyles.container}>
            <ComeBack text={"Selecione Serviço(s)"} />

            <View style={styles.contentServicesSelected}>
                <Text style={{ color: "#000000", fontSize: globalStyles.fontSizeSmall, fontFamily: globalStyles.fontFamilyBold }}>Serviço(s) selecionado(s):</Text>
                {
                    servicesSelected.map((service, index) => {
                        const servicePrice = formatServicePrice(service.price)

                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }} key={index}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Pressable onPress={() => removeServiceSelected(service.name)}>
                                        <CloseIcon />
                                    </Pressable>
                                    <Text style={styles.describe}>{service.name}</Text>
                                </View>
                                <Text style={styles.info}>{servicePrice}</Text>
                            </View>
                        )
                    })
                }

                <View style={styles.content}>
                    <View style={styles.fieldTotal}>
                        <Text style={[styles.describe, { color: "#000000", fontSize: globalStyles.fontSizeSmall }]}>Total</Text>
                        <Text style={styles.info}>{totalPriceServicesSelected}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.contentScroll, { height: `${scrollServicesHeight}%` }]}>
                <ScrollView >
                    {
                        services &&
                        (
                            services.map((service, index) => {
                                return <Service
                                    service={service}
                                    servicesSelected={servicesSelected}
                                    setServicesSelected={setServicesSelected}
                                    removeServiceSelected={removeServiceSelected}
                                    key={index}
                                />
                            })
                        )
                    }
                </ScrollView>
            </View>
            <Button
                text={"Continuar"}
                action={handleConfirm}
                isToBlockButton={servicesSelected.length ? false : true}
                addStyles={servicesSelected.length > 0 ?
                    { marginBottom: -(servicesSelected.length * 75) } :
                    { marginBottom: "-20%" }
                }
            />

        </View >
    )
}
    
const styles = StyleSheet.create({
    contentServicesSelected: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        width: "100%",
        padding: 15,
        marginVertical: 20,
    },

    describe: {
        color: "#00000070",
        fontSize: globalStyles.fontSizeSmall,
        fontFamily: globalStyles.fontFamilyBold,
        marginLeft: 10,
    },

    info: {
        fontSize: globalStyles.fontSizeSmall,
        color: "#000000",
        fontFamily: globalStyles.fontFamilyBold,
        maxWidth: "75%",
    },

    fieldTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: .8,
        borderTopColor: "#000000",
        paddingTop: 10,
    },

    contentScroll: {
        width: "100%",
        marginBottom: 30,
    },

    serviceSelected: {
        flexDirection: 'row',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: globalStyles.orangeColor,
        alignSelf: 'flex-start',
        margin: 5,
    },
})