import firestore from '@react-native-firebase/firestore';
import {getProfessional} from '../helpers/dateHelper';

export const getDeniedDays = async (
  shedulesUser,
  setDeniedDays,
  month,
  year,
) => {
  const scheduleProfessional = getProfessional(shedulesUser);

  const deniedDaysArrayToObejct = data => {
    const dataTemp = data.reduce((obj, item) => {
      return {
        ...obj,
        ...item,
      };
    }, {});
    setDeniedDays(dataTemp);
  };

  const deniedDaysRef = firestore()
    .collection('denied_days')
    .doc(`${month}_${year}`);
  const deniedDaysData = (await deniedDaysRef.get()).data();

  const dataTemp = [];

  for (const day in deniedDaysData) {
    if (deniedDaysData[day][scheduleProfessional].length > 0) {
      for (const deniedDay in deniedDaysData[day][scheduleProfessional]) {
        dataTemp.push(deniedDaysData[day][scheduleProfessional][deniedDay]);
      }
    }
  }
  deniedDaysArrayToObejct(dataTemp);
};
