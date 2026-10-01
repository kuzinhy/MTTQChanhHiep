const SOCIAL_WELFARE_KEY = 'chanh_hiep_module_social_welfare_enabled';

/**
 * Checks if the Digital Social Welfare & Great Solidarity Portal is enabled.
 * Defaults to false (LOCKED/HIDDEN on public portal).
 */
export const isSocialWelfareModuleEnabled = (): boolean => {
  try {
    const item = localStorage.getItem(SOCIAL_WELFARE_KEY);
    if (item === null) return false; // Default: HIDDEN as requested
    return item === 'true';
  } catch (e) {
    return false;
  }
};

/**
 * Updates the Social Welfare module status in localStorage and dispatches a sync event.
 */
export const setSocialWelfareModuleEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(SOCIAL_WELFARE_KEY, String(enabled));
    window.dispatchEvent(new Event('app_module_settings_updated'));
  } catch (e) {
    console.error('[ModuleSettings] Error saving module state:', e);
  }
};
