import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuIcon?: boolean;
  onMenuPress?: () => void;
}

export default function Header({ 
  title, 
  showBackButton = false, 
  showMenuIcon = true,
  onMenuPress
}: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        {showMenuIcon && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress || (() => router.push("/settings"))}
          >
            <FontAwesome5 name="bars" size={20} color="#333" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: "white",
    ...(Platform.OS === 'ios' ? {
      boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)'
    } : {
      elevation: 2,
    }),
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
}); 