export const getStoredToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};