import firestore from '@react-native-firebase/firestore';

export const getServices = async(setServices, setSomethingWrong) => {
    try {
    const servicesRef = firestore().collection("services").doc("services")
    const servicesData = (await servicesRef.get()).data()
    
    setServices(servicesData)
        
    } catch (error) {
        console.log(error);
        setSomethingWrong(true)
    }
}