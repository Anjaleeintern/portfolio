export const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
