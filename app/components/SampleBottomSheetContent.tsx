import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts";

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "transparent",
  },
  itemContainer: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default function SampleBottomSheetContent() {
  const { colors } = useTheme();

  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `Item ${index + 1}`),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.itemText, { color: colors.text }]}>{item}</Text>
      </View>
    ),
    [colors]
  );

  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
} 