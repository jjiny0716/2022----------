import { LOCAL_STORAGE_KEY } from "../constants/localStorage.js";

class Storage {
  get(key) {
    return JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}-${key}`));
  }

  set(key, value) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}-${key}`, JSON.stringify(value));
  }
}

const storage = new Storage();
export default storage;
