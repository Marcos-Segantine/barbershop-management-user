import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { Routes } from "./routes";

import { MenuItemProvider } from "../context/MenuItemSelected";
import { ScheduleProvider } from "../context/ScheduleContext";
import { UserProvider } from "../context/UserContext";
import { SomethingWrongProvider } from "../context/SomethingWrongContext";
import { AppSettingsProvider } from "../context/AppSettings";

import { NetInformation } from "../components/modals/NetInformation";

export const IndexApp = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <MenuItemProvider>
          <ScheduleProvider>
            <SomethingWrongProvider>
              <NetInformation />
              <AppSettingsProvider>
                <Routes />

              </AppSettingsProvider>
            </SomethingWrongProvider>
          </ScheduleProvider>
        </MenuItemProvider>
      </UserProvider>
    </NavigationContainer>
  );
};
