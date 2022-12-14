import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "https://ice-delivery.fly.dev",
  },
  staging: {
    apiUrl: "https://ice-delivery.fly.dev",
  },
  prod: {
    apiUrl: "https://ice-delivery.fly.dev",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
