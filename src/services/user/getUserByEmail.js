/**
 * Retrieve user data by email.
 * 
 * @param {string} email - The email of the user.
 * @returns {Object|null} - The user data or null if not found.
 */

import firestore from '@react-native-firebase/firestore';

export const getUserByEmail = async (email) => {
    const usersRef = firestore().collection("users");
    const userData = (await usersRef.get()).docs

    // If no user data is found, return null
    if (userData.length === 0) return null
    else return userData[0].data()
}