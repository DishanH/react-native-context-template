import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import * as React from "react";
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import ScrollContextProvider from "../components/ScrollContextProvider";
import TabBar from "../components/TabBar";
import { useTheme } from "../../contexts";
import { feedback } from "../../lib/feedback";

// Custom Drawer Toggle Button with circular background
function CustomDrawerToggle(
  props: React.ComponentProps<typeof DrawerToggleButton>
) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Create a custom onPress handler that includes haptic feedback
  const handlePress = () => {
    feedback.navigate(); // Add haptic feedback
    (navigation as any).openDrawer(); // Open the drawer
  };

  return (
    <TouchableOpacity
      style={[
        styles.toggleButtonContainer,
        { 
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
    >
      <FontAwesome5 name="bars" size={18} color={colors.primary} />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <ScrollContextProvider>
      <View style={styles.container}>
        <Tabs
          tabBar={(props: any) => <TabBar {...props} />}
          screenOptions={({ route }: { route: any }) => ({
            headerShown: true,
            animation: "fade",
            headerTitle:
              route.name !== "index"
                ? route.name
                    .split("-")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
                : "Dashboard",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "600",
              fontSize: 18,
              color: colors.text,
            },
            headerStyle: {
              backgroundColor: colors.headerBackground,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              borderBottomWidth: 0,
              height: Platform.OS === "ios" ? 115 : 70,
              // paddingBottom: 10,
            },
            headerLeft: (props: any) => <CustomDrawerToggle {...props} />,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: Platform.OS === "ios" ? 85 : 65,
              paddingBottom: Platform.OS === "ios" ? 25 : 10,
              paddingTop: 10,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.icon,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5
                  name="tachometer-alt"
                  size={size || 20}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="add-member"
            options={{
              title: "Create",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5
                  name="users"
                  size={size || 20}
                  color={color}
                  solid
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settle"
            options={{
              title: "Manage",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5
                  name="cogs"
                  size={size || 20}
                  color={color}
                  solid
                />
              ),
            }}
          />
          <Tabs.Screen
            name="add-expense"
            options={{
              title: "Connect",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="plus" size={size || 20} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </ScrollContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleButtonContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
