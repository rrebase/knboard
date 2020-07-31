export const getSaveShortcutLabel = () => {
  if (navigator.platform.indexOf('Mac') > -1) {
    return '(⌘+⏎)';
  }
  return '';
};
