export const getAuthHeader = () => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};
