export const APP_NAME = "milgam-dashboard";

export const XSTATE_VERSION = "4.38.3";

export const ALLOWED_HOST_ORIGINS = Object.freeze([
  "https://mnt.ylm.co.il",
  "http://mnt.ylm.co.il",
  "https://simplylog.ylm.co.il",
  "http://simplylog.ylm.co.il",
  "https://milgam.ylm.co.il",
  "http://milgam.ylm.co.il",
  "https://localhost:5500",
  "http://localhost:5500",
  "http://localhost:5721",
  "https://localhost:5721"
]);

export const DATASETS = Object.freeze({
  periods: "MilgamDashboardByMonth",
  division: "MilgamDashboardByDivision",
  summary: "MilgamDashboardSummary",
  category: "MilgamDashboardByCategory",
  closure: "MilgamDashboardClosureByCategory"
});

export const ENDPOINTS = Object.freeze({
  periods: "/api/Entity/MilgamDashboardByMonth/Search",
  division: "/api/Entity/MilgamDashboardByDivision/Search",
  summary: "/api/Entity/MilgamDashboardSummary/Search",
  category: "/api/Entity/MilgamDashboardByCategory/Search",
  closure: "/api/Entity/MilgamDashboardClosureByCategory/Search"
});

export const SCOPE_KEYS = Object.freeze(["headquarters", "branches"]);

export const RTL_LANGUAGES = Object.freeze(["he", "ar", "fa", "ur"]);
