import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useScrollVisibility } from '../../../navigation/components/TabBar';

/**
 * A hook to connect any scrollable component to the tab bar visibility system
 * Just add onScroll={handleScroll} to any ScrollView, FlatList, etc.
 */
export default function useScrollHider() {
  const { setScrollY } = useScrollVisibility();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return {
    handleScroll,
  };
} 