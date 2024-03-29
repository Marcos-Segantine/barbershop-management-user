/**
 * Verifies if already exists a schedule with the same schedule UID.
 * If exists, means that the schedule with the given day, hour and professional is not available, so return `false`.
 * Otherwise, return `true`.
 * 
 * @param {string} scheduleMonth - The schedule month.
 * @param {string} scheduleUid - The schedule UID to verify.
 * @returns {boolean} - True if the schedule UID is valid, false otherwise.
 */

import firestore from '@react-native-firebase/firestore';

import { handleError } from '../../handlers/handleError';

export const verifySchedulesUid = async (scheduleMonth, scheduleUid, setSomethingWrong) => {
    try {

        const schedulesUidRef = firestore().collection('schedules_uid').doc(scheduleMonth)
        const schedulesUidData = (await schedulesUidRef.get()).data()

        // If the schedules UID document does not exist
        // Just return `true` because the schedule is available
        if (schedulesUidData === undefined) return true

        const schedulesUidDataFormatted = schedulesUidData.schedules.map(scheduleUid => scheduleUid.split("-").slice(1).join("-"));

        const scheduleUidFormatted = scheduleUid.split("-").slice(1).join("-");

        // Check if the schedule UID is included in the 'schedules' from `schedulesUidData`
        // If it exist means that the schedule is not available more
        if (schedulesUidDataFormatted.includes(scheduleUidFormatted)) return false

        // If the given schedule UID is not included in the 'schedules' from `schedulesUidData`, the schedule is available
        return true
    } catch ({ message }) {
        setSomethingWrong(true)
        handleError("verifySchedulesUid", message)
    }
}
