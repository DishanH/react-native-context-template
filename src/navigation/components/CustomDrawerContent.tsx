import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme, useAuth, useNavigationState } from '../../../contexts';
import { feedback } from '../../../lib/feedback';

export function CustomDrawerContent(props: any) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { setFromDashboard, setShowBackButton } = useNavigationState();

  // Determine current route name to highlight active drawer item
  const currentRouteName = props.state.routes[props.state.index]?.name || "";

  const handleSignOut = async () => {
    feedback.buttonPress();
    feedback.info('Signing Out', 'See you soon!');
    
    // Close the drawer first to prevent navigation conflicts
    props.navigation.closeDrawer();
    
    // Sign out and let the auth state change handle navigation
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    {
      name: "tabs",
      displayName: "Dashboard",
      icon: "tachometer-alt",
      routes: ["tabs", "index"]
    },
    {
      name: "settings",
      displayName: "Settings",
      icon: "cog",
      routes: ["settings"]
    }
  ];

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
              source={{ uri: user?.avatar_url || "https://api.dicebear.com/8.x/avataaars/png?seed=DefaultParent&accessories=prescription01&clothing=shirtCrewNeck&clothingColor=blue01&eyeType=default&eyebrowType=default&facialHairType=blank&hairColor=brown&hatColor=black&mouthType=smile&skinColor=light&topType=shortHairShortFlat" }}
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
        {menuItems.map((item) => {
          const isActive = item.routes.includes(currentRouteName);
          
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.drawerItem,
                {
                  backgroundColor: isActive
                    ? colors.drawerActiveItemBackground
                    : "transparent",
                },
              ]}
              onPress={() => {
                feedback.navigate();
                // Reset navigation state when navigating via drawer (not from dashboard)
                setFromDashboard(false);
                setShowBackButton(false);
                props.navigation.navigate(item.name);
              }}
            >
              <View style={styles.drawerIconContainer}>
                <FontAwesome5
                  name={item.icon}
                  size={18}
                  color={isActive ? colors.primary : colors.icon}
                />
              </View>
              <Text
                style={[
                  styles.drawerItemText,
                  {
                    color: isActive ? colors.primary : colors.text,
                    fontWeight: isActive ? "600" : "500",
                  },
                ]}
              >
                {item.displayName}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Secondary Menu Items */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            feedback.navigate();
            setFromDashboard(false);
            setShowBackButton(false);
            props.navigation.navigate("help-faq");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5 name="question-circle" size={18} color={colors.icon} />
          </View>
          <Text style={[styles.drawerItemText, { color: colors.text }]}>
            Help & FAQ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            feedback.navigate();
            setFromDashboard(false);
            setShowBackButton(false);
            props.navigation.navigate("about");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5 name="info-circle" size={18} color={colors.icon} />
          </View>
          <Text style={[styles.drawerItemText, { color: colors.text }]}>
            About
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
        
        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          My App v1.0.0
        </Text>
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
  versionText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
}); 