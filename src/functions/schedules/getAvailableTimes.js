import firestore from '@react-native-firebase/firestore';

import {
    getProfessional,
    getDay,
    getMonth,
    getYear,
} from '../../functions/helpers/dateHelper';

export const getAvailableTimes = async (shedulesUser, setAvailableTimes, setSomethingWrong) => {
    const year = getYear(shedulesUser);
    const month = getMonth(shedulesUser);
    const day = getDay(shedulesUser);
    const professional = getProfessional(shedulesUser);

    try {

        // collections reference
        const workingHoursRef = await firestore().collection('working_hours').get();
        const unavailableTimesRef = firestore().collection('unavailable_times').doc(`${month}_${year}`)

        // getting data to compare and see avaible times
        const workingHours = workingHoursRef.docs.map(
            doc => doc.data().times,
        );
        const unavailableTimesData = (await unavailableTimesRef.get()).data() || {};

        // get the day that client want to mark
        const dayOfWeek = new Date(shedulesUser.day).getDay() + 1;
        let availableTimes = [];

        if (dayOfWeek > 0 && dayOfWeek <= 5) availableTimes = workingHours[2];
        else if (dayOfWeek === 6) availableTimes = workingHours[0];
        else availableTimes = workingHours[1];

        // get days unavailable times (days that alredy have a schedule)
        const unavailableTimesForDayAndProfessional = unavailableTimesData[day]?.[professional] || [];

        // compare both (all times that professional works and schedules marked)
        availableTimes = availableTimes.filter(
            time => !unavailableTimesForDayAndProfessional.includes(time),
        );

        setAvailableTimes(availableTimes);
    } catch (error) {
        console.error(error);
        setSomethingWrong(true)
    }
};