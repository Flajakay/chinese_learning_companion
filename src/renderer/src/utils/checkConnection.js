const checkInternetConnection = async () => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default checkInternetConnection;
