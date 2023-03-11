import { View, StyleSheet } from 'react-native';

import { useContext, useEffect, useState } from 'react';

import { Calendar, LocaleConfig } from 'react-native-calendars';

import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

import { ShedulesUserContext } from '../../context/ShedulesUser';

import { LoadingAnimation } from '../../components/LoadingAnimation';

import { handleRightArrow } from '../../functions/calendar/handleRightArrow';
import { handleLeftArrow } from '../../functions/calendar/handleLeftArrow';
import { getDeniedDays } from '../../functions/calendar/getDeniedDays';

import firestore from '@react-native-firebase/firestore';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'jan',
    'fev',
    'mar',
    'abr',
    'maio',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Terç', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

export const Calandar = ({ navigation }) => {
  LocaleConfig.defaultLocale = 'pt-br';

  const initialMonth =
    new Date().getMonth() + 1 > 10
      ? new Date().getMonth() + 1
      : `0${new Date().getMonth() + 1}`;

  const { shedulesUser, setShedulesUser } = useContext(ShedulesUserContext);
  const [deniedDays, setDeniedDays] = useState(null);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false)

  const deniedDaysRef = firestore().collection('denied_days').doc(`${month}_${year}`);

  // all the times that collection `denied_days` in doc selected by user (`month_year`), it will update the data
  useEffect(() => {
    const unsubscribe = deniedDaysRef.onSnapshot(async () => {
      setShowLoadingIndicator(true)

      await getDeniedDays(shedulesUser, setDeniedDays, month, year);

      setShowLoadingIndicator(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    getDeniedDays(shedulesUser, setDeniedDays, month, year);
  }, [month]);

  // configs and data to calandar
  const markedDatesCalendar = {
    ...deniedDays,
    [shedulesUser.day]: {
      selected: true,
      marked: true,
      selectedColor: 'white',
    },
  };

  const themeCalendar = {
    calendarBackground: '#E95401',
    dayTextColor: '#FFFFFF',
    selectedDayTextColor: '#E95401',
    selectedDayBackgroundColor: '#FFFFFF',
    textDisabledColor: '#FFFFFF40',
    textSectionTitleColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    monthTextColor: '#FFFFFF',
    textDayHeaderFontWeight: '700',
  };

  const styleCalendar = {
    width: 350,
    marginTop: 40,
    padding: 5,
    borderRadius: 20,
  };

  // some calandar's controllers
  const onPressArrowLeftCalendar = subtractMonth => {
    handleLeftArrow(month, setMonth, setYear);
    subtractMonth();
  };

  const onPressArrowRightCalendar = addMonth => {
    handleRightArrow(month, setMonth, setYear);
    addMonth();
  };

  if (!deniedDays || showLoadingIndicator) {
    return (
      <View style={style.container}>
        <LoadingAnimation />
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Title title="Selecione um data" />

      <Calendar
        context={{ date: '' }}
        onPressArrowLeft={onPressArrowLeftCalendar}
        onPressArrowRight={onPressArrowRightCalendar}
        minDate={String(new Date())}
        markedDates={markedDatesCalendar}
        onDayPress={day =>
          setShedulesUser({ ...shedulesUser, day: day.dateString })
        }
        style={styleCalendar}
        theme={themeCalendar}
      />

      <Button
        text="Comfirmar"
        action={() => shedulesUser.day && navigation.navigate('Schedules')}
        waitingData={!!shedulesUser.day}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
  },
});
