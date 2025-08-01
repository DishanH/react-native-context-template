import React from "react";
import Toast from 'react-native-toast-message';
import { BottomSheetProvider } from "../src/providers/BottomSheetProvider";
import { ModalProvider } from "../src/providers/ModalProvider";
import { ThemeProvider, AuthProvider, SubscriptionProvider, SettingsProvider } from "../contexts";
import { toastConfig } from "../lib/toastConfig";
import { StatusBarManager } from "../src/shared/components/layout";
import { RootNavigator } from "../src/navigation/RootNavigator";

// Root layout component with providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SubscriptionProvider>
            <BottomSheetProvider>
              <ModalProvider>
                <StatusBarManager />
                <RootNavigator />
                <Toast config={toastConfig} />
              </ModalProvider>
            </BottomSheetProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
