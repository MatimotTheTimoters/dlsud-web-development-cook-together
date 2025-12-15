// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

// Import MUI ThemeProvider and createTheme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create your custom CookTogether theme
const cookTogetherTheme = createTheme({
  palette: {
    primary: {
      main: '#457B9D', // Queen Blue
      light: '#A8DADC', // Powder Blue
      dark: '#1D3557', // Prussian Blue
    },
    secondary: {
      main: '#E63946', // Imperial Red
    },
    background: {
      default: '#F1FAEE', // Honeydew
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#1D3557', // Prussian Blue
      secondary: '#457B9D', // Queen Blue
    },
    success: {
      main: '#4CAF50', // Green for ready/saved states
    },
    warning: {
      main: '#FF9800', // Orange for warnings
    },
    error: {
      main: '#E63946', // Imperial Red for errors
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1D3557',
    },
    h2: {
      fontWeight: 600,
      color: '#1D3557',
    },
    h3: {
      fontWeight: 600,
      color: '#457B9D',
    },
    h4: {
      fontWeight: 600,
      color: '#457B9D',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Keep button text normal case
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1D3557', // Prussian Blue on hover
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#C62828', // Darker red on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(29, 53, 87, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#A8DADC', // Powder Blue
            },
            '&:hover fieldset': {
              borderColor: '#457B9D', // Queen Blue on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#457B9D', // Queen Blue when focused
            },
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={cookTogetherTheme}>
      <CssBaseline /> {/* Normalizes CSS and applies background */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();