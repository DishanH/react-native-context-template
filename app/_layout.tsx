import React from "react";
import Toast from 'react-native-toast-message';
import { BottomSheetProvider } from "../src/providers/BottomSheetProvider";
import { ThemeProvider, AuthProvider, SubscriptionProvider } from "../contexts";
import { toastConfig } from "../lib/toastConfig";
import { StatusBarManager } from "../src/shared/components/layout";
import { RootNavigator } from "../src/navigation/RootNavigator";

// Root layout component with providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <BottomSheetProvider>
            <StatusBarManager />
            <RootNavigator />
            <Toast config={toastConfig} />
          </BottomSheetProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
