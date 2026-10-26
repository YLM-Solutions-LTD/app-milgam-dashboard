import { DATASETS, ENDPOINTS } from "./constants.js";

const LABELS = {
  currentEvents: "האירועים", currentPermits: "האישורים", currentEquipment: "הציוד"
};

export function snapshotErrorCopy(error = {}) {
  const key = Object.keys(LABELS).find((candidate) => DATASETS[candidate] === error?.dataset);
  const subject = key ? `נתוני ${LABELS[key]}` : "תמונת המצב";
  const status = Number.isInteger(error?.status) && error.status >= 400 && error.status <= 599 ? error.status : null;
  let message = `לא ניתן לטעון את ${subject}. נסו לרענן את הנתונים.`;
  let retry = true;
  if (status === 403) {
    message = `אין הרשאה להצגת ${subject}. יש לפנות למנהל ההרשאות ולפתוח מחדש את הדשבורד לאחר הטיפול.`;
    retry = false;
  } else if (status === 401 || error?.kind === "authorization-revoked") {
    message = "החיבור המאומת אינו זמין. יש לפתוח מחדש את הדשבורד מתוך SimplyLog.";
    retry = false;
  } else if (status === 400 || status === 404) {
    message = `דוח ${subject} אינו זמין או שהגדרתו אינה תקינה. יש לפנות לתמיכה עם פרטי התקלה.`;
  } else if (status >= 500) {
    message = `השרת לא הצליח להפיק את ${subject}. אפשר לנסות שוב או להעביר לתמיכה את פרטי התקלה.`;
  } else if (error?.kind === "invalid-response") {
    message = `דוח ${subject} החזיר מבנה נתונים לא תקין. יש להעביר לתמיכה את פרטי התקלה.`;
  } else if (error?.kind === "network") {
    message = `לא ניתן להתחבר לשרת לקבלת ${subject}. בדקו את החיבור ונסו שוב.`;
  }
  // Only fixed report paths and bounded classifications are exposed, never API bodies.
  const kind = ["http", "invalid-response", "network", "authorization-revoked", "aborted"].includes(error?.kind) ? error.kind : "unknown";
  return { message, retry, diagnostic: [key ? ENDPOINTS[key] : "currentSnapshot", status ? `HTTP ${status}` : kind].join(" · ") };
}
