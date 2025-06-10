# Feedback System

This directory contains the feedback utilities for the SimpleAI app, including haptic feedback and toast notifications.

## Features

- **Haptic Feedback**: Provides tactile feedback for user interactions
- **Toast Notifications**: Shows non-intrusive messages to users
- **Centralized API**: Consistent feedback across the entire app
- **Theme Integration**: Toasts match the app's design system

## Usage

### Basic Import

```typescript
import { feedback } from '../lib/feedback';
```

### Quick Methods

```typescript
// Success feedback with haptic + toast
feedback.success('Profile Saved', 'Your changes have been saved successfully');

// Error feedback with haptic + toast
feedback.error('Error', 'Something went wrong');

// Info feedback with haptic + toast
feedback.info('Info', 'This is an informational message');

// Warning feedback with haptic + toast
feedback.warning('Warning', 'Please check your input');
```

### Haptic-Only Feedback

```typescript
// Button press haptic
feedback.buttonPress();

// Success haptic
feedback.buttonSuccess();

// Error haptic
feedback.buttonError();

// Navigation haptic
feedback.navigate();
feedback.back();

// Form haptic
feedback.formSuccess();
feedback.formError();
feedback.inputFocus();
```

### Custom Toast + Haptic

```typescript
import { showToast, triggerHaptic } from '../lib/feedback';

// Custom combination
showToast('success', 'Title', 'Message', 'heavy');

// Haptic only
triggerHaptic('medium');
```

## Toast Types

- `success`: Green toast with success icon
- `error`: Red toast with error icon
- `info`: Blue toast with info icon
- `warning`: Orange toast with warning icon

## Haptic Types

- `light`: Light impact feedback
- `medium`: Medium impact feedback  
- `heavy`: Heavy impact feedback
- `success`: Success notification feedback
- `warning`: Warning notification feedback
- `error`: Error notification feedback

## Best Practices

1. **Use appropriate feedback types**: Match the feedback to the user action
2. **Don't overuse haptics**: Too much haptic feedback can be annoying
3. **Provide meaningful messages**: Make toast messages clear and actionable
4. **Consistent usage**: Use the same feedback patterns throughout the app

## Examples

### Form Submission
```typescript
const handleSubmit = async () => {
  feedback.buttonPress(); // Immediate haptic feedback
  
  try {
    await submitForm();
    feedback.success('Success!', 'Form submitted successfully');
  } catch (error) {
    feedback.error('Error', 'Failed to submit form');
  }
};
```

### Navigation
```typescript
const handleNavigate = () => {
  feedback.navigate(); // Light haptic for navigation
  router.push('/settings');
};
```

### Button Interactions
```typescript
<TouchableOpacity 
  onPress={() => {
    feedback.buttonPress(); // Always provide haptic feedback for buttons
    handleAction();
  }}
>
  <Text>Action Button</Text>
</TouchableOpacity>
``` 