export const APP_NAME = "milgam-dashboard";

export const XSTATE_VERSION = "4.38.3";

export const ALLOWED_HOST_ORIGINS = Object.freeze([
  "https://mnt.ylm.co.il",
  "https://simplylog.ylm.co.il",
  "https://milgam.ylm.co.il",
  "https://localhost:5500",
  "https://localhost:5721"
]);

export const ALLOWED_API_ORIGINS_BY_HOST = Object.freeze({
  "https://mnt.ylm.co.il": Object.freeze(["https://mntapi.ylm.co.il", "https://api.ylm.co.il"]),
  "https://simplylog.ylm.co.il": Object.freeze(["https://api.ylm.co.il"]),
  "https://milgam.ylm.co.il": Object.freeze(["https://api.ylm.co.il"]),
  "https://localhost:5500": Object.freeze(["https://localhost:5721"]),
  "https://localhost:5721": Object.freeze(["https://localhost:5721"])
});

export const CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED = false;

export const DATASETS = Object.freeze({
  periods: "MilgamDashboardByMonth",
  division: "MilgamDashboardByDivision",
  summary: "MilgamDashboardSummary",
  category: "MilgamDashboardByCategory",
  closure: "MilgamDashboardClosureByCategory"
  ,currentEvents: "MilgamDashboardCurrentEvents"
  ,currentPermits: "MilgamDashboardCurrentPermits"
  ,currentEquipment: "MilgamDashboardCurrentEquipment"
});

export const ENDPOINTS = Object.freeze({
  periods: "/api/Entity/MilgamDashboardByMonth/Search",
  division: "/api/Entity/MilgamDashboardByDivision/Search",
  summary: "/api/Entity/MilgamDashboardSummary/Search",
  category: "/api/Entity/MilgamDashboardByCategory/Search",
  closure: "/api/Entity/MilgamDashboardClosureByCategory/Search"
  ,currentEvents: "/api/Entity/MilgamDashboardCurrentEvents/Search"
  ,currentPermits: "/api/Entity/MilgamDashboardCurrentPermits/Search"
  ,currentEquipment: "/api/Entity/MilgamDashboardCurrentEquipment/Search"
});

export const CURRENT_DATASET_KEYS = Object.freeze(["currentEvents", "currentPermits", "currentEquipment"]);

export const SCOPE_KEYS = Object.freeze(["headquarters", "branches"]);

export const RTL_LANGUAGES = Object.freeze(["he", "ar", "fa", "ur"]);
