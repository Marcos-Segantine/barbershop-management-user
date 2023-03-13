import firestore from '@react-native-firebase/firestore';

import {
  getMonth,
  getDay,
  getProfessional,
  getHour,
  getYear,
} from '../helpers/dateHelper';

import { verifySchedules } from './verifySchedules';

export const addScheduleWhenDayAlredyUse = async (
  navigation,
  userData,
  schedule,
  setSomethingWrong
) => {
  console.log('addScheduleWhenDayAlredyUse CALLED');

  const scheduleMonth = getMonth(schedule);
  const scheduleDay = getDay(schedule);
  const scheduleHour = getHour(schedule);
  const scheduleYear = getYear(schedule)
  const scheduleProfessional = getProfessional(schedule);

  const nameDocMonth_Year = `${scheduleMonth}_${scheduleYear}`

  try {

    // collections reference
    const schedulesMonthRef = firestore().collection('schedules_month').doc(nameDocMonth_Year);
    const unavailableTimesRef = firestore().collection('unavailable_times').doc(nameDocMonth_Year);
    const schedulesByUserRef = firestore().collection('schedules_by_user').doc(userData.uid);

    const batch = firestore().batch();

    // getting data from collections
    const schedulesMonthData = (await schedulesMonthRef.get()).data();
    const unavailableTimesData = (await unavailableTimesRef.get()).data();
    const schedulesByUserData = (await schedulesByUserRef.get()).data();

    // if alredy have a field for the professional selected, just add the `schedule` data
    if (schedulesMonthData[scheduleDay]?.[scheduleProfessional]) {

      // creating const to store data that will be used to update the collections
      const dataToUpdateSchedulesMonth = {
        [`${scheduleDay}.${scheduleProfessional}.${scheduleHour}`]: schedule,
      }

      const dataToUpdateUnavailableTimes = {
        [`${scheduleDay}.${scheduleProfessional}`]:
          firestore.FieldValue.arrayUnion(schedule.shedule),
      }

      batch.update(schedulesMonthRef, dataToUpdateSchedulesMonth);
      batch.update(unavailableTimesRef, dataToUpdateUnavailableTimes);
    }
    // else create a new doc with the field
    else {

      // creating const to store data that will be used to update the collections
      const dataToUpdateSchedulesMonth = {
        [`${scheduleDay}.${scheduleProfessional}`]: {
          [scheduleHour]: schedule,
        },
      }

      const dataToUpdateUnavailableTimes = {
        [`${scheduleDay}.${scheduleProfessional}`]: [schedule.shedule],
      }

      batch.set(
        schedulesMonthRef,
        dataToUpdateSchedulesMonth,
        { merge: true },
      );

      batch.set(
        unavailableTimesRef,
        dataToUpdateUnavailableTimes,
        { merge: true },
      );
    }

    const updatedSchedulesByUser = {
      schedules: [...schedulesByUserData.schedules, schedule],
    };

    batch.update(schedulesByUserRef, updatedSchedulesByUser);


    await verifySchedules(schedule, 'addSchedule');
    await batch.commit();

    navigation.navigate('FinalScreen');

  } catch (error) {
    console.log(error);
    setSomethingWrong(true)
  }
};
