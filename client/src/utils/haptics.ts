// Triggers haptic feedback on supported devices (Android)
export const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
};
