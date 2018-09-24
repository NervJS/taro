let listeners: Function[] = [];

export default () => {
  const appendListener = fn => {
    let isActive = true;
  
    const listener = (...args) => {
      if (isActive) fn(...args);
    };
  
    listeners.push(listener);
  
    return () => {
      isActive = false;
      listeners = listeners.filter(item => item !== listener);
    };
  };
  
  const notifyListeners = (...args) => {
    listeners.forEach(listener => listener(...args));
  };
  
  return {
    appendListener,
    notifyListeners
  }
}
