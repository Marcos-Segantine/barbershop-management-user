import firestore from '@react-native-firebase/firestore';
import {
  getMonth,
  getDay,
  getProfessional,
  getHour,
  getYear,
} from '../helpers/dateHelper';

export const addScheduleWhenDayNotUse = async (
  userData,
  navigation,
  shedulesUser,
  setSomethingWrong
) => {
  console.log('addScheduleWhenDayNotUse CALLED');

  const scheduleMonth = getMonth(shedulesUser);
  const scheduleDay = getDay(shedulesUser);
  const scheduleHour = getHour(shedulesUser);
  const scheduleYear = getYear(shedulesUser)
  const scheduleProfessional = getProfessional(shedulesUser);

  const nameDocMonth_Year = `${scheduleMonth}_${scheduleYear}`

  const batch = firestore().batch()

  try {

    // collections reference
    const deniedDaysRef = firestore().collection('denied_days').doc(nameDocMonth_Year);
    const schedulesMonthRef = firestore().collection('schedules_month').doc(nameDocMonth_Year);
    const unavailableTimesRef = firestore().collection('unavailable_times').doc(nameDocMonth_Year);
    const schedulesByUserRef = firestore().collection('schedules_by_user').doc(userData.uid);

    let unavailableTimesData = (await unavailableTimesRef.get()).data() || {}

    // if day selected have a field on doc
    if (!unavailableTimesData[scheduleDay]) {
      unavailableTimesData = {
        ...unavailableTimesData,
        [scheduleDay]: {
          [scheduleProfessional]: [`${shedulesUser.shedule}`],
        },
      };
    }

    const schedulesByUserDoc = await schedulesByUserRef.get();
    const schedulesByUserData = schedulesByUserDoc.data();

    // creating consts to update collections
    const dataToUpdateSchedulesByUser = {
      schedules: [...schedulesByUserData.schedules, { ...shedulesUser }],
    }

    const deniedDaysData = (await deniedDaysRef.get()).data();
    const schedulesMonthData = (await schedulesMonthRef.get()).data();

    const dataToUpdateDeniedDays = {
      ...deniedDaysData,
      [scheduleDay]: {
        ['Barbeiro 1']: [],
        ['Barbeiro 2']: [],
        ['Barbeiro 3']: [],
      },
    }

    const dataToUpdateSchedulesMonth = {
      ...schedulesMonthData,
      [scheduleDay]: {
        [scheduleProfessional]: {
          [scheduleHour]: { ...shedulesUser },
        },
      },
    }

    batch.set(unavailableTimesRef, unavailableTimesData);
    batch.update(deniedDaysRef, dataToUpdateDeniedDays);
    batch.update(schedulesMonthRef, dataToUpdateSchedulesMonth);
    batch.update(schedulesByUserRef, dataToUpdateSchedulesByUser);

    await batch.commit()

    navigation.navigate('FinalScreen');

  } catch (error) {
    console.error('Error adding schedule:', error);
    setSomethingWrong(true)
  }
};
