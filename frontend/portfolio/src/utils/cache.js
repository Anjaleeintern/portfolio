export const getCache = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const setCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
