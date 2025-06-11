import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme, useAuth } from '../../../contexts';
import { feedback } from '../../../lib/feedback';

export function CustomDrawerContent(props: any) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  // Determine current route name to highlight active drawer item
  const currentRouteName = props.state.routes[props.state.index]?.name || "";

  const handleSignOut = async () => {
    feedback.buttonPress();
    feedback.info('Signing Out', 'See you soon!');
    await signOut();
    // Navigation will be handled automatically by auth state change
  };

  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: colors.drawerBackground },
      ]}
    >
      {/* User Profile Section with background box */}
      <View
        style={[
          styles.profileBox,
          {
            backgroundColor: colors.drawerHeaderBackground,
            borderColor: colors.primary + '30',
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.userSection}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary + '50' }]}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "tabs" || currentRouteName === "index"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("tabs");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="tachometer-alt"
              size={18}
              color={currentRouteName === "tabs" || currentRouteName === "index" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "tabs" || currentRouteName === "index" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "tabs" || currentRouteName === "index" ? "600" : "500",
              },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "groups"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("groups");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="users"
              size={18}
              color={currentRouteName === "groups" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "groups" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "groups" ? "600" : "500",
              },
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "activity"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("activity");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="history"
              size={18}
              color={currentRouteName === "activity" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "activity" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "activity" ? "600" : "500",
              },
            ]}
          >
            Activity
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "subscription"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("subscription")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="crown"
              size={18}
              color={currentRouteName === "subscription" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "subscription" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "subscription" ? "600" : "500",
              },
            ]}
          >
            Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "settings"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("settings");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="cog"
              size={18}
              color={currentRouteName === "settings" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "settings" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "settings" ? "600" : "500",
              },
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Button at Bottom */}
      <View style={styles.bottomSection}>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { 
              backgroundColor: colors.error + '15',
              borderColor: colors.error + '30',
            }
          ]}
          onPress={handleSignOut}
        >
          <FontAwesome5
            name="sign-out-alt"
            size={16}
            color={colors.error}
            style={styles.signOutIcon}
          />
          <Text style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  userSection: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 8,
    position: "relative",
  },
  drawerIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemText: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "500",
  },
  signOutIcon: {
    marginRight: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    opacity: 0.5,
  },
  profileBox: {
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
}); 