import { Text, View, StyleSheet } from 'react-native';

import { Title } from '../../components/Title';
import { Button } from '../../components/Button';

import { useContext, useEffect } from 'react';
import { ShedulesUserContext } from '../../context/ShedulesUser';

import { globalStyles } from '../globalStyles';

import { dateFormated } from '../../functions/helpers/dateHelper';

import { UserContext } from '../../context/UserContext';
import { useIsFocused } from '@react-navigation/native';

import { handleComfirmNewSchedule } from '../../functions/schedules/handleComfirmNewSchedule';
import { SomethingWrong } from '../../context/somethingWrong';

export const ConfirmSchedule = ({ navigation }) => {
  const { shedulesUser, setShedulesUser } = useContext(ShedulesUserContext);

  const { userData } = useContext(UserContext);
  const { setSomethingWrong } = useContext(SomethingWrong);

  const date = dateFormated(shedulesUser);

  const isFocused = useIsFocused();

  useEffect(() => {
    shedulesUser.scheduleUid = `${userData.uid}-${shedulesUser.day}-${shedulesUser.professional}-${shedulesUser.shedule}-${shedulesUser.service}`;
  }, [isFocused]);

  return (
    <View style={globalStyles.container}>
      <Title title="O seu agendamento:" />

      <Text style={style.subTitle}>Confira todos os dados</Text>

      <View style={style.contentData}>
        <View style={style.data}>
          <Text style={style.textData}>Dia: {date}</Text>
        </View>

        <View style={style.data}>
          <Text style={style.textData}>Serviço: {shedulesUser.service}</Text>
        </View>

        <View style={style.data}>
          <Text style={style.textData}>
            Profissional: {shedulesUser.professional}
          </Text>
        </View>

        <View style={style.data}>
          <Text style={style.textData}>Horário: {shedulesUser.shedule}</Text>
        </View>
      </View>

      <Button text="Confirmar" action={() => handleComfirmNewSchedule(
        shedulesUser,
        userData,
        navigation,
        setShedulesUser,
        setSomethingWrong
      )} />
    </View>
  );
};

const style = StyleSheet.create({
  subTitle: {
    fontSize: 12,
    color: '#FFFFFF60',
  },

  contentData: {
    width: '85%',
    marginTop: 30,
  },

  data: {
    borderColor: '#E95401',
    borderRadius: 20,
    borderWidth: 2,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 5,
  },

  textData: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
