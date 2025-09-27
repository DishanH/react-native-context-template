# Layout Components

This directory contains various layout components for the React Native Context Template.

## Components

### 1. AnimatedHeader
A header component with blur effects and smooth animations based on scroll position.

### 2. HideableHeader (NEW)
A header component that automatically hides when scrolling up and shows when scrolling down.

**Features:**
- Smooth slide animations
- Configurable scroll thresholds
- Blur effects support
- Responsive to scroll direction
- Customizable styling

**Usage:**
```tsx
import { HideableHeader } from '../../../../src/shared/components/layout';

<HideableHeader
  title="Page Title"
  headerLeft={<BackButton />}
  headerRight={<MenuButton />}
  backgroundColor="#fff"
  titleColor="#000"
  enableBlur={true}
/>
```

### 3. PageWithHideableHeader (NEW)
A wrapper component that provides a complete page layout with a hideable header.

**Usage:**
```tsx
import { PageWithHideableHeader } from '../../../../src/shared/components/layout';

export default function MyScreen() {
  return (
    <PageWithHideableHeader title="My Page" showBackButton={true}>
      <ScrollView>
        {/* Your page content */}
      </ScrollView>
    </PageWithHideableHeader>
  );
}
```

### 4. PageWithAnimatedHeader
Similar to PageWithHideableHeader but with static positioning and blur animations.

## Configuration

### Scroll Behavior
The hideable header responds to scroll direction with the following thresholds:
- **Hide threshold**: 100px - Header hides when scrolling down past this point
- **Show immediately**: When scrolling up at any position
- **Animation duration**: 250ms for smooth transitions

### Customization
Both header components support:
- Custom background colors
- Title color customization
- Left/right header content
- Blur effects (iOS optimized)
- Platform-specific styling

## Integration with Scroll Context

These components work with the existing ScrollContext system:
1. ScrollContextProvider manages scroll state
2. useScrollVisibility hook provides scroll data
3. Header components respond to scroll changes automatically

## Example Implementation

See `app/features/legal/screens/about.tsx` for a complete implementation example of the PageWithHideableHeader component.
