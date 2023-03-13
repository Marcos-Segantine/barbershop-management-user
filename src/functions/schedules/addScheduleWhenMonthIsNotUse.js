import firestore from '@react-native-firebase/firestore';

import {
  getMonth,
  getDay,
  getProfessional,
  getHour,
  getYear,
} from '../helpers/dateHelper';

import { clearSchedule } from './clearSchedule';

export const addScheduleWhenMonthIsNotUse = async (
  userData,
  navigation,
  schedulesUser,
  setSchedulesUser,
  setSomethingWrong
) => {
  console.log('addScheduleWhenMonthIsNotUse CALLED');

  const scheduleMonth = getMonth(schedulesUser);
  const scheduleHour = getHour(schedulesUser);
  const scheduleDay = getDay(schedulesUser);
  const scheduleYear = getYear(schedulesUser);
  const scheduleProfessional = getProfessional(schedulesUser);

  const nameDocMonth_Year = `${scheduleMonth}_${scheduleYear}`
  
  const batch = firestore().batch();

  try {

    // collections reference
    const schedulesByUserRef = firestore().collection('schedules_by_user').doc(userData.uid);
    const schedulesMonthRef = firestore().collection('schedules_month').doc(nameDocMonth_Year);
    const unavailableTimesRef = firestore().collection('unavailable_times').doc(nameDocMonth_Year);
    const deniedDaysRef = firestore().collection('denied_days').doc(nameDocMonth_Year)

    // defining a new doc on `schedules_by_user` collection
    const scheduleMonthData = {
      [scheduleDay]: {
        [scheduleProfessional]: {
          [scheduleHour]: { ...schedulesUser },
        },
      },
    };

    // defining a new doc on `unavailable_times` collection
    const unavailableTimesData = {
      [scheduleDay]: {
        [scheduleProfessional]: [schedulesUser.shedule],
      },
    };

    // defining a new field' doc in `denied_days` collection
    const deniedDaysData = {
      [scheduleDay]: {
        ['Barbeiro 1']: [],
        ['Barbeiro 2']: [],
        ['Barbeiro 3']: [],
      },
    }

    batch.set(schedulesMonthRef, scheduleMonthData);
    batch.set(unavailableTimesRef, unavailableTimesData);
    batch.update(schedulesByUserRef, {
      schedules: firestore.FieldValue.arrayUnion({ ...schedulesUser }),
    });
    batch.set(deniedDaysRef, deniedDaysData);

    await batch.commit()

    clearSchedule(schedulesUser, setSchedulesUser);

    navigation.navige("InitialScreen")

  } catch (error) {
    console.log(error);
    setSomethingWrong(true)
  }

};
