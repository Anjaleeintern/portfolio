export const isAdminLoggedIn = () => {
    const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined";
};
