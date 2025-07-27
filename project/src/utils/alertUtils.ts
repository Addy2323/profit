// Utility functions for showing success and error alerts
export const showSuccessAlert = (message: string) => {
  alert(`✅ Success: ${message}`);
};

export const showErrorAlert = (message: string) => {
  alert(`❌ Error: ${message}`);
};

export const showInfoAlert = (message: string) => {
  alert(`ℹ️ Info: ${message}`);
};

export const showWarningAlert = (message: string) => {
  alert(`⚠️ Warning: ${message}`);
};

// Enhanced alert with custom styling (for future implementation)
export const showCustomAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  const prefixes = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
    warning: 'Warning'
  };
  
  alert(`${icons[type]} ${prefixes[type]}: ${message}`);
};
