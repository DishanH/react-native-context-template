import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface LoadMoreButtonProps {
  colors: any;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  currentCount: number;
  totalCount: number;
  itemType?: string;
  variant?: 'default' | 'playbooks';
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  colors,
  hasMore,
  isLoading,
  onLoadMore,
  currentCount,
  totalCount,
  itemType = 'items',
  variant = 'default'
}) => {
  if (!hasMore && currentCount > 0) {
    return (
      <View style={styles.endIndicator}>
        <Text style={[styles.endText, { color: colors.textSecondary }]}>
          {variant === 'playbooks' 
            ? `Showing all ${totalCount} ${itemType}`
            : `You've reached the end of the ${itemType}`
          }
        </Text>
      </View>
    );
  }

  if (!hasMore) {
    return null;
  }

  if (variant === 'playbooks') {
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={[
            styles.loadMoreButton,
            styles.playbooksButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            }
          ]}
          onPress={onLoadMore}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <FontAwesome5 name="spinner" size={16} color={colors.primary} />
          ) : (
            <FontAwesome5 name="plus" size={16} color={colors.primary} />
          )}
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>
            {isLoading ? 'Loading...' : `Load More (${currentCount}/${totalCount})`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.loadMoreContainer}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading more {itemType}...
          </Text>
        </View>
      ) : (
        <TouchableOpacity 
          onPress={onLoadMore} 
          style={[styles.loadMoreButton, { borderColor: colors.primary }]}
        >
          <FontAwesome5 name="chevron-down" size={16} color={colors.primary} />
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>
            Load More {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadMoreContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  playbooksButton: {
    backgroundColor: 'transparent',
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 13,
    marginLeft: 8,
  },
  endIndicator: {
    alignItems: 'center',
    padding: 16,
  },
  endText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});