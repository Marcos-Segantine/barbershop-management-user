import { getMonth, getDay, getYear } from "../helpers/dateHelper";

import { addScheduleWhenDayAlredyUse } from '../../functions/schedules/addScheduleWhenDayAlredyUse';
import { addScheduleWhenDayNotUse } from '../../functions/schedules/addScheduleWhenDayNotUse';
import { addScheduleWhenMonthIsNotUse } from '../../functions/schedules/addScheduleWhenMonthIsNotUse';

import firestore from '@react-native-firebase/firestore';

export const handleComfirmNewSchedule = async (
    schedulesUser,
    userData,
    navigation,
    setSchedulesUser,
    setSomethingWrong
) => {

    const scheduleMouth = getMonth(schedulesUser);
    const scheduleDay = getDay(schedulesUser);
    const scheduleYear = getYear(schedulesUser)

    const dateForDoc = `${scheduleMouth}_${scheduleYear}`

    const schedulesMonthRef = firestore().collection('schedules_month').doc(dateForDoc)
    const schedulesMonthData = (await schedulesMonthRef.get()).data()

    if (schedulesMonthData === undefined) {
        addScheduleWhenMonthIsNotUse(
            userData,
            navigation,
            schedulesUser,
            setSchedulesUser,
            setSomethingWrong
        );
        return;
    }

    const dayIsAlredyUse = schedulesMonthData[scheduleDay]

    dayIsAlredyUse
        ? addScheduleWhenDayAlredyUse(navigation, userData, schedulesUser, setSomethingWrong)
        : addScheduleWhenDayNotUse(
            userData,
            navigation,
            schedulesUser,
            setSchedulesUser,
            setSomethingWrong
        );
};
