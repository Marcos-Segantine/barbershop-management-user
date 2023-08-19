/**
 * Component to display a modal when there is no internet connection.
 * It listens for network state changes and renders a modal with a message.
 */

import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import NetInfo from "@react-native-community/netinfo";

import { NoInternetImage } from "../../assets/imgs/NoInternetImage";
import { globalStyles } from "../../assets/globalStyles";

export const NetInformation = () => {
    const [isConnected, setIsConnected] = useState(null);

    // Subscribe to network state changes
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    // Render the modal if there is no internet connection
    return (isConnected !== null && !isConnected) && (
        <Modal
            animationType="slide"
            transparent={true}
        >
            <View style={styles.container}>
                <NoInternetImage width={"100%"} height={"55%"} />

                <Text style={styles.title}>Sem conexão com a internet</Text>
                <Text style={styles.text}>Por favor, verifique sua conexão com a internet</Text>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
    },

    title: {
        color: globalStyles.orangeColor,
        fontSize: globalStyles.fontSizeLarger,
        textAlign: "center",
        fontFamily: globalStyles.fontFamilyBold
    },

    text: {
        color: "#000000",
        textAlign: 'center',
        maxWidth: "80%",
        marginTop: 15,
        fontFamily: globalStyles.fontFamilyBold,
    }
})