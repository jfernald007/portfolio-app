import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

// Define the theme type
interface Theme {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderColor: string;
    borderRadius: string;
}

// Define the context type
interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

// Create a theme context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use the theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Function to update the CSS custom properties
const updateCSSVariables = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--border-radius', theme.borderRadius);
};

// Props type for ThemeProvider
interface ThemeProviderProps {
    children: ReactNode;
}

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>({
        primaryColor: 'red',
        secondaryColor: '#2ecc71',
        fontFamily: 'Quicksand, sans-serif',
        borderColor: 'rgb(238, 238, 238)',
        borderRadius: '4px',
    });

    useEffect(() => {
        updateCSSVariables(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
