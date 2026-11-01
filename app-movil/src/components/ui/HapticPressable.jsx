import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

export default function HapticPressable({ onPress, hapticStyle = 'light', ...props }) {
  const handlePress = async (event) => {
    const style =
      hapticStyle === 'success'
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.ImpactFeedbackStyle.Light;

    if (hapticStyle === 'success') {
      await Haptics.notificationAsync(style);
    } else {
      await Haptics.impactAsync(style);
    }

    onPress?.(event);
  };

  return <Pressable {...props} onPress={handlePress} />;
}
