/**
 * Profile service — centralized state and data operations.
 * Single responsibility: manage profile state and persistence simulation.
 */

import { profileData as initialData } from "../data/profileData.js";

function cloneProfile(data) {
  return {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    emailNotifications: data.emailNotifications,
  };
}

export function createProfileService() {
  let state = cloneProfile(initialData);
  let savedSnapshot = cloneProfile(initialData);
  const listeners = new Set();

  function notify() {
    listeners.forEach((listener) => listener(getState()));
  }

  function getState() {
    return cloneProfile(state);
  }

  function getSavedSnapshot() {
    return cloneProfile(savedSnapshot);
  }

  function updateField(name, value) {
    state = { ...state, [name]: value };
    notify();
  }

  function updateFromFormData(formData) {
    state = {
      fullName: formData.get("fullName") ?? state.fullName,
      email: formData.get("email") ?? state.email,
      password: formData.get("password") ?? state.password,
      emailNotifications: formData.get("emailNotifications") === "on",
    };
    notify();
  }

  function save() {
    savedSnapshot = cloneProfile(state);
    notify();
    return getState();
  }

  function reset() {
    state = cloneProfile(savedSnapshot);
    notify();
    return getState();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    getState,
    getSavedSnapshot,
    updateField,
    updateFromFormData,
    save,
    reset,
    subscribe,
  };
}
