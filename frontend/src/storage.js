import { STORAGE_KEYS } from "./constants";
import { safeJSONParse } from "./utils";

export const storage = {
  set(key, value) {
    localStorage.setItem(key, value);
  },

  get(key, fallback = null) {
    const value = localStorage.getItem(key);
    return value ?? fallback;
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },

  setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getJSON(key, fallback = null) {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return safeJSONParse(value, fallback);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );
    }
  },

  getUser() {
    return this.getJSON(STORAGE_KEYS.USER);
  },

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
  },
};

export default storage;