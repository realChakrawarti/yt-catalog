function checkPural(value: number, type: "minute" | "hour" | "day") {
  let stringValue: string = "";
  if (value > 1) {
    stringValue = value + ` ${type}s`;
  } else {
    stringValue = value + ` ${type}`;
  }

  return stringValue;
}

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_MONTH = MINUTES_PER_DAY * 30;

function getDayHourMinute(timeDiff: number): number[] {
  let daysHoursMinutes = "00/00/00";

  if (timeDiff < MINUTES_PER_HOUR) {
    daysHoursMinutes = `00/00/${timeDiff}`;
  } else if (timeDiff < MINUTES_PER_DAY) {
    const hours = Math.floor(timeDiff / MINUTES_PER_HOUR);
    const minutes = Math.round(timeDiff % MINUTES_PER_HOUR);
    daysHoursMinutes = `00/${hours}/${minutes}`;
  } else {
    const days = Math.floor(timeDiff / MINUTES_PER_DAY);
    const hours = Math.floor((timeDiff % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
    const minutes = Math.round(timeDiff % MINUTES_PER_HOUR);
    daysHoursMinutes = `${days}/${hours}/${minutes}`;
  }

  const [days, hours, minutes] = daysHoursMinutes.split("/");

  return [parseInt(days), parseInt(hours), parseInt(minutes)];
}

function getDifferenceString(
  deltaMinutes: number,
  prefix: "ago" | "later",
  approx: boolean = false
) {
  const [days, hours, minutes] = getDayHourMinute(deltaMinutes);
  let timeDifferenceString = "";

  if (days) {
    timeDifferenceString = checkPural(days, "day") + " ";
    if (approx) {
      return timeDifferenceString + prefix;
    }
  }
  if (hours) {
    timeDifferenceString += checkPural(hours, "hour") + " ";
    if (approx) {
      return timeDifferenceString + prefix;
    }
  }
  if (minutes) {
    timeDifferenceString += checkPural(minutes, "minute") + " ";
    if (approx) {
      return timeDifferenceString + prefix;
    }
  }
  return timeDifferenceString + prefix;
}

export function getTimeDifference(
  compareTimeWith: string,
  approx: boolean = false
) {
  const currentTime = new Date().getTime();
  const serverTime = new Date(compareTimeWith).getTime();

  const delta = currentTime - serverTime;
  const deltaMinutes = Math.abs(delta) / (60 * 1000); // In minutes

  if (deltaMinutes > MINUTES_PER_MONTH) {
    return [0, "N/A"];
  }

  // Past
  if (delta >= 0) {
    const prefix = "ago";
    const diffToString = getDifferenceString(deltaMinutes, prefix, approx);
    return [-1, diffToString];
  }
  // Future
  else {
    const prefix = "later";
    const diffToString = getDifferenceString(deltaMinutes, prefix, approx);
    return [1, diffToString];
  }
}
