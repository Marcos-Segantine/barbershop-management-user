import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { UserProvider } from './src/context/UserContext';
import { ShedulesUserProvider } from './src/context/ShedulesUser';
import { UserVerifiedProvider } from './src/context/UserVerified';
import { SomethingWrongProvider } from './src/context/somethingWrong';


import { UserScreens } from './src/screens/routes';
import { Header } from './src/shared/Header';

const App = () => {
  return (
    <NavigationContainer>
      <UserVerifiedProvider>
        <UserProvider>
          <ShedulesUserProvider>
            <SomethingWrongProvider>
              <Header />
              <UserScreens />
            </SomethingWrongProvider>
          </ShedulesUserProvider>
        </UserProvider>
      </UserVerifiedProvider>
    </NavigationContainer>
  );
};

export default App;
