function formatTimeWithSeconds(timeStr) {
  if (!timeStr) {
    return "00:00:00";
  }
  
  const cleaned = timeStr.trim();
  const parts = cleaned.split(":");
  
  if (parts.length === 0 || parts[0] === "") {
    return "00:00:00";
  }
  
  const hours = parts[0].padStart(2, "0");
  const minutes = (parts[1] || "00").padStart(2, "0");
  const seconds = (parts[2] || "00").padStart(2, "0");
  
  return `${hours}:${minutes}:${seconds}`;
}

const bDate = new Date(2026, 4, 9, 13, 45, 39); // Sábado May 9, 2026, 13:45:39
const schedules = {"Sábado":{"close":"14:00","active":true}};
const businessId = "test";
const currentStatus = true;

const hours = String(bDate.getHours()).padStart(2, '0');
const minutes = String(bDate.getMinutes()).padStart(2, '0');
const seconds = String(bDate.getSeconds()).padStart(2, '0');
const timeStr = `${hours}:${minutes}:${seconds}`;

let openTime = "09:00:00";
let closeTime = "22:00:00";
let isDayActive = true;

if (schedules && Object.keys(schedules).length > 0) {
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDay = daysOfWeek[bDate.getDay()];
  const daySchedule = schedules[currentDay];

  if (daySchedule) {
    isDayActive = daySchedule.active !== false;
    openTime = formatTimeWithSeconds(daySchedule.open || "09:00");
    closeTime = formatTimeWithSeconds(daySchedule.close || "22:00");
  } else {
    isDayActive = false; // Sin horario activo hoy
  }
}

let shouldBeOpen = false;
if (isDayActive) {
  if (closeTime > openTime) {
    shouldBeOpen = timeStr >= openTime && timeStr <= closeTime;
  } else {
    shouldBeOpen = timeStr >= openTime || timeStr <= closeTime;
  }
}

console.log({
  currentDay: 'Sábado',
  isDayActive,
  openTime,
  closeTime,
  timeStr,
  shouldBeOpen,
  mismatch: shouldBeOpen !== currentStatus
});
