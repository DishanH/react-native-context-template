import React from "react";
import Toast from 'react-native-toast-message';
import { BottomSheetProvider } from "../src/providers/BottomSheetProvider";
import { ModalProvider } from "../src/providers/ModalProvider";
import { ThemeProvider, AuthProvider, SubscriptionProvider, SettingsProvider, NavigationProvider } from "../contexts";
import { toastConfig } from "../lib/toastConfig";
import { StatusBarManager } from "../src/shared/components/layout";
import { RootNavigator } from "../src/navigation/RootNavigator";
import FullScreenProvider from "@/src/providers/FullScreenProvider";

// Root layout component with providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SubscriptionProvider>
              <NavigationProvider>
                <BottomSheetProvider>
                  <ModalProvider>
                    <FullScreenProvider>
                      <StatusBarManager />
                      <RootNavigator />
                      <Toast config={toastConfig} />
                    </FullScreenProvider>
                  </ModalProvider>
                </BottomSheetProvider>
              </NavigationProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
