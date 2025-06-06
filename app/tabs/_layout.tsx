import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import ScrollContextProvider from "../components/ScrollContextProvider";
import TabBar from "../components/TabBar";
import { useTheme } from "../../contexts";

// Custom Drawer Toggle Button with circular background
function CustomDrawerToggle(props: any) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.toggleButtonContainer, { backgroundColor: colors.surface }]}>
      <DrawerToggleButton 
        {...props}
        tintColor={colors.primary}
      />
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <ScrollContextProvider>
      <View style={styles.container}>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={({ route }) => ({
            headerShown: true,
            animation: 'fade',
            headerTitle: route.name !== 'index' ? route.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Dashboard",
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
              color: colors.text,
            },
            headerStyle: {
              backgroundColor: colors.headerBackground,
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              borderBottomWidth: 0,
              height: Platform.OS === 'ios' ? 80 : 60,
            },
            headerLeft: (props) => <CustomDrawerToggle {...props} />,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 60,
              paddingBottom: 10,
              paddingTop: 10,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.icon,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="tachometer-alt" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="add-expense"
            options={{
              title: "Create",
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="plus" size={22} color={color} solid />
              ),
            }}
          />
          <Tabs.Screen
            name="settle"
            options={{
              title: "Manage",
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="cogs" size={22} color={color} solid />
              ),
            }}
          />
          <Tabs.Screen
            name="add-member"
            options={{
              title: "Connect",
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="link" size={22} color={color} solid />
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

