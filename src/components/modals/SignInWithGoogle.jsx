import React from 'react';

import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useContext, useState, useMemo, useCallback} from 'react';

import {GoogleIcon} from '../../assets/GoogleIcon';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {UserContext} from '../../context/UserContext';
import {UserVerified} from '../../context/UserVerified';

import {signInWithGoogle} from '../../functions/login/signInWithGoogle';
import {createUserByGoogle} from '../../functions/register/createUserByGoogle';

import {AlertMessagePasswordCanChange} from './AlertMessagePasswordCanChange';

const SignInWithGoogle = React.memo(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const stateNavigation = useNavigationState(
    stateNavigation => stateNavigation,
  );

  const {setUserData} = useContext(UserContext);
  const {setUserVerified} = useContext(UserVerified);

  const indexNavigationScreen = useMemo(
    () => stateNavigation?.index,
    [stateNavigation],
  );

  const nameRouteNavigation = useMemo(
    () => stateNavigation?.routes[indexNavigationScreen]?.name,
    [stateNavigation, indexNavigationScreen],
  );

  const handleCLick = useCallback(() => {
    nameRouteNavigation === 'Login'
      ? signInWithGoogle(
          navigation,
          setUserVerified,
          setUserData,
          setModalVisible,
        )
      : createUserByGoogle(navigation, setModalVisible, setUserData);
  }, [nameRouteNavigation, navigation, setUserVerified, setUserData]);

  return (
    <>
      <AlertMessagePasswordCanChange
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <Pressable style={style.button} onPress={handleCLick}>
        <View style={style.svg}>
          <GoogleIcon />
        </View>
      </Pressable>
    </>
  );
});

export {SignInWithGoogle};
