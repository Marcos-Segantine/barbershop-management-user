import firestore from '@react-native-firebase/firestore';

import {getYear} from '../getYear';
import {getMonth} from '../getMonth';
import {getDay} from '../getDay';
import {getProfessional} from '../getProfessional';

export const verifySchedules = shedulesUser => {
  const year = getYear(shedulesUser);
  const month = getMonth(shedulesUser);
  const day = getDay(shedulesUser);

  const professional = getProfessional(shedulesUser);

  firestore()
    .collection('working_hours')
    .get()
    .then(({_docs}) => {
      console.log(
        'FIX THIS LATER, THE SYSTEM MUST TO KNOW WHEN THE SCHEDULE IS FROM MONDAY TO FRIDAY OR ENDWEEK!!',
      );
      const workingHour = _docs[0]._data.times;

      firestore()
        .collection('unavailable_times')
        .doc(`${month}_${year}`)
        .get()
        .then(({_data}) => {
          const unavailableTimes = _data;

          if (
            !!unavailableTimes[day][professional] &&
            unavailableTimes[day][professional].length === workingHour.length
          ) {
            firestore()
              .collection('denied_days')
              .doc(`${month}_${year}`)
              .get()
              .then(({_data}) => {
                firestore()
                  .collection('denied_days')
                  .doc(`${month}_${year}`)
                  .update({
                    ..._data,
                    [`2023-${month}-${day}`]: {
                      disableTouchEvent: true,
                      disabled: true,
                    },
                  });
              });
          } else if (
            unavailableTimes[day][professional].length ===
            workingHour.length - 1
          ) {
            firestore()
              .collection('denied_days')
              .doc(`${month}_${year}`)
              .get()
              .then(({_data}) => {
                const deniedDays = _data;

                delete deniedDays[shedulesUser.day].disableTouchEvent;
                delete deniedDays[shedulesUser.day].disabled;

                firestore()
                  .collection('denied_days')
                  .doc(`${month}_${year}`)
                  .update(deniedDays)
                  .then(() => {});
              });
          }
        });
    });
};