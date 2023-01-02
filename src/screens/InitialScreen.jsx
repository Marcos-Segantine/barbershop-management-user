import {  View, StyleSheet, SafeAreaView } from "react-native";
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

import { useEffect, useState } from "react";

import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { Button } from "../components/Button";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const InitialScreen = ({ navigation }) => {
    const [ isUserAuth, setIsUserAuth ] = useState(false)
    
    useEffect(() => {
        
        const getLocalStorage = async() => {
            const userEmail = await AsyncStorage.getItem("@barber_app__email")
            const userPassword = await AsyncStorage.getItem("@barber_app__password")

            if(JSON.parse(userEmail) === null || JSON.parse(userPassword) === null) setIsUserAuth(false)
            
            return setIsUserAuth(true)

        }

        getLocalStorage()
    }, [])

    return(
        <View style={style.container}>
            <Header />
            
            <View style={style.hero}>
                <Svg
                    width={280}
                    height={400}
                    viewBox="0 0 284 466"
                    fill="none"
                    >
                    <Path fill="url(#pattern0)" d="M0 0H284V466H0z" />
                    <Defs>
                        <Pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width={1}
                        height={1}
                        >
                        <Use
                            xlinkHref="#image0_7_1184"
                            transform="matrix(.0004 0 0 .00024 -.32 0)"
                        />
                        </Pattern>
                        <Image
                        id="image0_7_1184"
                        width={4096}
                        height={4096}
                        />
                    </Defs>
                </Svg>
            </View>

            <Button text="Agende seu horário" action={() => navigation.navigate(isUserAuth ? "Services" : "Login")}
             />
            <Footer />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        alignItems: 'center'
    },
    
    hero : {
        alignItems: "center"
    },
})