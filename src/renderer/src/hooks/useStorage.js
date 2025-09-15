import { useState, useEffect, useRef } from 'react';
import electronAPI from '../services/electronAPI';

const useStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const defaultValueRef = useRef(defaultValue);
  
  if (JSON.stringify(defaultValueRef.current) !== JSON.stringify(defaultValue)) {
    defaultValueRef.current = defaultValue;
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await electronAPI.loadData(key);
        if (result.success) {
          setValue(result.data);
        } else {
          setValue(defaultValueRef.current);
        }
      } catch (err) {
        setError(err.message);
        setValue(defaultValueRef.current);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key]); 

  const setStoredValue = async (newValue) => {
    try {
      setValue(newValue);
      const result = await electronAPI.saveData(key, newValue);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return [value, setStoredValue, { loading, error }];
};

export default useStorage;
