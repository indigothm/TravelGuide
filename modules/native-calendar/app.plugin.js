const withAndroidPermissions = (config) => {
  if (!config.android) config.android = {};
  if (!config.android.permissions) config.android.permissions = [];

  config.android.permissions.push(
    "android.permission.READ_CALENDAR",
    "android.permission.WRITE_CALENDAR"
  );

  return config;
};

const withIosPermissions = (config) => {
  if (!config.ios) config.ios = {};
  if (!config.ios.infoPlist) config.ios.infoPlist = {};

  config.ios.infoPlist.NSCalendarsUsageDescription = "This app needs access to your calendar to add travel events.";
  config.ios.infoPlist.NSCalendarsFullAccessUsageDescription = "This app needs access to your calendar to add travel events.";

  return config;
};

module.exports = (config) => {
  config = withAndroidPermissions(config);
  config = withIosPermissions(config);
  return config;
};
