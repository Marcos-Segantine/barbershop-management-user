import { useContext, useEffect, useRef, useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native"

import { Button } from "../components/Button"
import { ComeBack } from "../components/ComeBack"
import { Loading } from "../components/Loading"
import { DefaultModal } from "../components/modals/DefaultModal"
import { Contact } from "../components/modals/Contact"
import { GetNewPhoneNumber } from "../components/modals/GetNewPhoneNumber"

import { globalStyles } from "../assets/globalStyles"
import { GetCodePhoneValidation } from "../assets/imgs/GetCodePhoneValidation"
import { StopProcessError } from "../assets/imgs/StopProcessError"
import { ScheduleUnavailableNow } from "../assets/imgs/ScheduleUnavailableNow"
import { AccountCreated } from "../assets/imgs/AccountCreated"

import { UserContext } from "../context/UserContext"
import { SomethingWrongContext } from "../context/SomethingWrongContext"

import { handleError } from "../handlers/handleError"

import auth from '@react-native-firebase/auth';

import { userPhoneNumberValidated } from "../services/auth/userPhoneNumberValidated"
import { updateUserDataDB } from "../services/user/updateUserDataDB"

import { getWidthHeightScreen } from "../utils/getWidthHeightScreen"

import AsyncStorage from "@react-native-async-storage/async-storage"

import { verifyIfUserAlreadyMakePhoneValidationVerification } from "../validation/verifyIfUserAlreadyMakePhoneValidationVerification"

export const GetCode = ({ navigation }) => {
    const [confirm, setConfirm] = useState(null)
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [isToShowContactModal, setIsToShowContactModal] = useState(false)
    const [changePhoneNumber, setChangePhoneNumber] = useState(false)
    const [timer, setTimer] = useState(null)
    const [verificationCompleted, setVerificationCompleted] = useState(false)

    const { userData, setUserData } = useContext(UserContext)
    const { setSomethingWrong } = useContext(SomethingWrongContext)

    const inputRef = useRef()

    const verifyPhoneNumber = async () => {
        try {
            setIsLoading(true)
            const phone = userData.phone.replace(/[^0-9]/g, '')

            const confirmation = await auth().verifyPhoneNumber("+55" + phone).catch(({ code, message }) => {
                if (code === "auth/too-many-requests") {
                    setIsLoading(false)

                    AsyncStorage.setItem("@barber_app__phone_verification_time", `${new Date().getHours()}:${new Date().getMinutes()}`)

                    setModalContent({
                        image: <StopProcessError />,
                        mainMessage: "Erro de Validação",
                        message: "Observamos várias tentativas de verificação do seu número. Por razões de segurança, temporariamente bloquearemos o acesso.",
                        firstButtonText: "Página Inicial",
                        firstButtonAction: () => {
                            setModalContent(null)
                            navigation.navigate("Home")
                        },
                        secondButtonText: "Contato",
                        secondButtonAction: () => {
                            setIsLoading(false)
                            setIsToShowContactModal(true)
                        }
                    })
                }
                else if (message === "[auth/missing-client-identifier] This request is missing a valid app identifier, meaning that neither SafetyNet checks nor reCAPTCHA checks succeeded. Please try again, or check the logcat for more details.") {
                    setIsLoading(false)

                    setModalContent({
                        image: <StopProcessError />,
                        mainMessage: "Erro na Verificação",
                        message: "Encontramos um erro ao tentar fazer a verificação reCAPTCHA, por favor não feche a nova página que abrir. Caso precise de ajuda pode entrar em contato conosco",
                        firstButtonText: "Tentar Novamente",
                        firstButtonAction: () => {
                            setIsLoading(true)
                            setModalContent(null)
                            verifyPhoneNumber()
                        },
                        secondButtonText: "Contato",
                        secondButtonAction: () => {
                            setIsLoading(false)
                            setIsToShowContactModal(true)
                        }
                    })

                }
                else {
                    setSomethingWrong(true)
                    handleError("GetCode - verifyPhoneNumber", message)
                }

            })

            if (!confirmation) return

            setConfirm(confirmation);
            setIsLoading(false)
            setTimer(300)
            setVerificationCompleted(true)

        } catch ({ message }) {
            setSomethingWrong(true)
            handleError("GetCode", message)

        }
    }

    useEffect(() => {
        verifyIfUserAlreadyMakePhoneValidationVerification(setTimer, setSomethingWrong)
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            if (timer === 0) return
            setTimer(timer - 1)
            if ([1, 2, 3, 4, 5].includes(timer / 60)) {
                AsyncStorage.setItem("@barber_app__timeToWaitAfterAnotherRequisition", String(timer / 60))
            }
        }, 1000)

        return () => clearInterval(interval)

    }, [timer])

    const confirmCode = async () => {
        try {
            setIsLoading(true)

            const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
            await auth().currentUser.linkWithCredential(credential);

            userPhoneNumberValidated(userData.uid, userData.phone, setSomethingWrong)
            setUserData({ ...userData, phoneNumberValidated: true })
            await updateUserDataDB({ ...userData, phoneNumberValidated: true }, setSomethingWrong)

            setIsLoading(false)

            setModalContent({
                image: <AccountCreated />,
                mainMessage: "Nùmero validado com sucesso",
                firstButtonText: "Pagina Inicial",
                firstButtonAction: () => {
                    setModalContent(null)
                    navigation.navigate("Home")
                },
            })

        } catch ({ code, message }) {
            if (code == 'auth/invalid-verification-code') {
                setIsLoading(false)

                setModalContent({
                    image: <StopProcessError />,
                    mainMessage: "Código Incorreto",
                    message: "O código inserido está incorreto. Por favor, revise com cuidado o código que enviamos a você e tente novamente.",
                    firstButtonText: "Tentar Novamente",
                    firstButtonAction: () => {
                        setModalContent(null)
                    },
                })

            }
            else if (message === "[auth/unknown] User has already been linked to the given provider.") {

                setIsLoading(false)
                userPhoneNumberValidated(userData.uid, userData.phone, setSomethingWrong)

                setModalContent({
                    image: <ScheduleUnavailableNow width={"100%"} />,
                    mainMessage: "Houve um Engano",
                    message: "Parece que você já fez a validação do seu número de telefone, desculpe o incoveniente.",
                    firstButtonText: "Página Inicial",
                    firstButtonAction: () => {
                        setModalContent(null)
                        navigation.navigate("Home")
                    },
                })
            }
            else {
                setIsLoading(false)

                setModalContent({
                    image: <StopProcessError />,
                    mainMessage: "Erro de Validação",
                    message: "Ocorreu um erro ao validar o seu número de telefone, por favor tente novamente mais tarde. Caso queira pode entrar em contato conosco",
                    firstButtonText: "Página Inicial",
                    firstButtonAction: () => {
                        setModalContent(null)
                        navigation.navigate("Home")
                    },
                    secondButtonText: "Contato",
                    secondButtonAction: setIsToShowContactModal(true)
                })

                handleError("GetCode - confirmCode", message)
            }
        }
    }

    const secondsToMinutes = (seconds) => {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;

        // Format the output as "minutes:seconds"
        var formattedTime = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
        return formattedTime;
    }

    const contactAction = () => {
        setIsToShowContactModal(false)
        navigation.navigate("Home")
    }

    const handleCode = (codeDigited) => {
        if (codeDigited.length >= 7) {
            setCode(code)
            return
        }

        setCode(codeDigited)
    }

    const handleCannotResendVerification = () => {
        setModalContent({
            image: <StopProcessError />,
            mainMessage: "Aguarde um Momento",
            message: "Por favor, espere 5 minutos antes de tentar novamente. Agradecemos sua compreensão.",
            firstButtonText: "Entendido",
            firstButtonAction: () => setModalContent(null)
        })
    }

    const phoneHidden = userData?.phone.replace(/[^0-9]/g, '').split('').map((number, index) => index < 8 ? "*" : number).join('')

    if (isLoading) return <Loading flexSize={1} text={"Este procedimento pode levar um tempo para ser concluído."} />

    if (verificationCompleted) {
        return (

            <ScrollView contentContainerStyle={globalStyles.container}>
                <ComeBack text={"Código de Verificação"} />

                <GetCodePhoneValidation width={"100%"} height={getWidthHeightScreen("height", 50)} />
                <DefaultModal modalContent={modalContent} />
                <Contact
                    modalContact={isToShowContactModal}
                    setModalVisible={setIsToShowContactModal}
                    action={contactAction}
                />
                <GetNewPhoneNumber
                    visible={changePhoneNumber}
                    setVisible={setChangePhoneNumber}
                    setTimer={setTimer}
                    setIsLoading={setIsLoading}
                />

                <Text style={styles.description}>Enviamos um código para o número {phoneHidden}.</Text>
                <Text style={styles.description}>Ensira-o no campo abaixo</Text>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
                    <Pressable
                        style={code.length === 0 && inputRef.current?.isFocused() ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[0] || ""}</Text>
                    </Pressable>
                    <Pressable
                        style={code.length === 1 ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[1] || ""}</Text>
                    </Pressable>
                    <Pressable
                        style={code.length === 2 ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[2] || ""}</Text>
                    </Pressable>
                    <Pressable
                        style={code.length === 3 ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[3] || ""}</Text>
                    </Pressable>
                    <Pressable
                        style={code.length === 4 ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[4] || ""}</Text>
                    </Pressable>
                    <Pressable
                        style={code.length === 5 ? [styles.codeContent, { borderColor: globalStyles.orangeColor }] : styles.codeContent}
                        onPress={() => inputRef.current.focus()}
                    >
                        <Text style={styles.code}>{code.split("")[5] || ""}</Text>
                    </Pressable>
                </View>

                <TextInput
                    ref={inputRef}
                    value={code}
                    style={{ backgroundColor: "red", position: "absolute", transform: [{ scale: 0 }] }}
                    onChangeText={text => handleCode(text)}
                />

                <View style={styles.contentHelpers}>
                    <TouchableOpacity onPress={() => setChangePhoneNumber(true)}>
                        <Text style={styles.helpersText}>Trocar de número</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={timer === 0 ? () => verifyPhoneNumber() : handleCannotResendVerification}>
                        <Text style={timer === 0 ? styles.helpersText : [styles.helpersText, { color: globalStyles.orangeColorDarker }]}>Não recebi o código</Text>
                    </TouchableOpacity>
                </View>

                {
                    timer !== 0 &&
                    <Text style={styles.timer}>{secondsToMinutes(timer)}</Text>
                }

                <Button
                    text={"Confirmar"}
                    addStyles={{ marginTop: 30 }}
                    action={() => confirmCode()}
                />

            </ScrollView>
        )
    }

    return (
        <ScrollView contentContainerStyle={[globalStyles.container, { flex: 1 }]}>
            <ComeBack text={"Código de Verificação"} />

            <GetCodePhoneValidation width={"100%"} height={getWidthHeightScreen("height", 50)} />
            <DefaultModal modalContent={modalContent} />
            <Contact
                modalContact={isToShowContactModal}
                setModalVisible={setIsToShowContactModal}
                action={contactAction}
            />
            <GetNewPhoneNumber
                visible={changePhoneNumber}
                setVisible={setChangePhoneNumber}
                setTimer={setTimer}
                setIsLoading={setIsLoading}
            />

            <View style={{ marginTop: 20, width: "100%", alignItems: "center", position: "absolute", bottom: "15%" }}>
                <Text style={styles.description}>Sera aberto uma tela no navegador para que possamos fazer a verificacao de seu dispositivo</Text>
                <Text style={[styles.description, { marginTop: 15 }]}>Por favor nao feche-a</Text>

                <Button
                    text={"Iniciar Verificacao"}
                    addStyles={{ marginTop: 30 }}
                    action={() => verifyPhoneNumber()}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    codeContent: {
        backgroundColor: "white",
        width: getWidthHeightScreen("width", 20) / 6,
        height: getWidthHeightScreen("width", 20) / 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },

    code: {
        color: "#000000",
        fontSize: globalStyles.fontSizeMedium,
        fontFamily: globalStyles.fontFamilyBold,
    },

    contentHelpers: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 5
    },

    helpersText: {
        color: globalStyles.orangeColor,
        fontSize: globalStyles.fontSizeVerySmall,
        fontFamily: globalStyles.fontFamilyBold,
    },

    description: {
        fontSize: globalStyles.fontSizeSmall,
        fontFamily: globalStyles.fontFamilyRegular,
        color: "#000000",
        width: "100%"
    },

    timer: {
        color: "#000000",
        fontSize: globalStyles.fontSizeVerySmall,
        fontFamily: globalStyles.fontFamilyBold,
        width: "100%",
        marginTop: 10,
        textAlign: "right"
    }
})
