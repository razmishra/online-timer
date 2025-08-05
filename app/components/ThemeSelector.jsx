import { useState, useRef, useEffect } from 'react';
import { Settings, Palette } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, theme, themes, changeTheme } = useTheme();
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  const getThemePreview = (themeName) => {
    const themeData = themes[themeName];
    return (
      <div className="flex items-center space-x-3 w-full">
        <div className="flex space-x-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: themeData.customStyles['--blob-color-1'].replace('rgba', 'rgb').replace(', 0.', ', 1.').replace(', 0.', ', 1.') }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: themeData.customStyles['--blob-color-2'].replace('rgba', 'rgb').replace(', 0.', ', 1.').replace(', 0.', ', 1.') }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: themeData.customStyles['--blob-color-3'].replace('rgba', 'rgb').replace(', 0.', ', 1.').replace(', 0.', ', 1.') }}
          />
        </div>
        <span className={`${themeData.font} ${themeData.fontSize} font-medium`}>
          {themeData.name}
        </span>
        {currentTheme === themeName && (
          <div className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse" />
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${theme.buttonBg} ${theme.buttonText} ${theme.borderRadius}
          px-3 py-2 font-semibold text-sm flex items-center gap-2
          transition-all duration-300 hover:scale-105 ${theme.shadow}
          border border-white/20 backdrop-blur-sm
        `}
        aria-label="Theme Settings"
      >
        <Settings className="w-5 h-5" />
        <span className="hidden md:inline">Theme</span>
      </button>

      {/* Theme Selector Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`
            absolute top-full right-0 mt-2 w-64 z-50
            ${theme.cardBg} ${theme.borderRadius} ${theme.shadow}
            border border-white/20 backdrop-blur-lg
            transform transition-all duration-300 ease-out
            animate-in slide-in-from-top-2
          `}
        >
          <div className="p-4">
            <div className={`flex items-center gap-2 mb-4 ${theme.textPrimary}`}>
              <Palette className="w-5 h-5" />
              <h3 className={`${theme.font} font-semibold`}>Choose Theme</h3>
            </div>
            
            <div className="space-y-2">
              {Object.entries(themes).map(([themeName, themeData]) => (
                <button
                  key={themeName}
                  onClick={() => handleThemeSelect(themeName)}
                  className={`
                    w-full p-3 text-left ${theme.borderRadius}
                    transition-all duration-200 hover:scale-[1.02]
                    ${currentTheme === themeName 
                      ? `${theme.buttonBg} ${theme.textPrimary} ${theme.shadow}` 
                      : `hover:${theme.buttonBg} ${theme.textSecondary} hover:${theme.textPrimary}`
                    }
                    border border-transparent hover:border-white/20
                  `}
                >
                  {getThemePreview(themeName)}
                </button>
              ))}
            </div>
            
            <div className={`mt-4 pt-3 border-t border-white/20 ${theme.textSecondary} text-xs text-center`}>
              Current: <span className={`${theme.textAccent} font-medium`}>{theme.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}