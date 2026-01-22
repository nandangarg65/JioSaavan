import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme as toggleThemeAction, setThemeMode as setThemeModeAction } from '../store/useThemeStore';
import { Colors } from '../constants/theme';
import { ThemeMode } from '../types';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { isDark, themeMode } = useAppSelector((state) => state.theme);

  const colors = isDark ? Colors.dark : Colors.light;

  const toggleTheme = () => dispatch(toggleThemeAction());
  const setThemeMode = (mode: ThemeMode) => dispatch(setThemeModeAction(mode));

  return {
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
    colors: {
      ...colors,
      primary: Colors.primary,
      primaryLight: Colors.primaryLight,
      primaryDark: Colors.primaryDark,
      white: Colors.white,
      black: Colors.black,
      error: Colors.error,
      success: Colors.success,
      transparent: Colors.transparent,
    },
  };
};

