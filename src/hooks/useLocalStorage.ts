import { useEffect, useState } from 'react';

export function useLocalStorage(key: any, defaultValue: any) {
  // State initialization with null check
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        // Check for both null and undefined
        return JSON.parse(storedValue);
      }
      return defaultValue; // Use default value for missing key
    } catch (error) {
      return defaultValue; // Return default value if parsing fails
    }
  });

  // Update local storage on value change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  // Optional: Return null for missing key (uncomment if desired)
  // if (value === null) {
  //   return null;
  // }

  return [value, setValue]; // Return state and setter function
}
