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
  suffix: "ago" | "later",
  suffixEnabled: boolean = false
) {
  const [days, hours, minutes] = getDayHourMinute(deltaMinutes);
  let timeDifferenceString = "";

  if (days) {
    timeDifferenceString = checkPural(days, "day") + " ";
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  if (hours) {
    timeDifferenceString += checkPural(hours, "hour") + " ";
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  if (minutes) {
    timeDifferenceString += checkPural(minutes, "minute") + " ";
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  return timeDifferenceString + suffix;
}

/**
 *
 * @param {string} compareWithCurrent - Compare with current time
 * @param {boolean} [suffixEnabled=false] - Approximate time difference with `ago` and `later` appended
 * @param {boolean} [limitMonth=true] - Show N/A when time difference exceeds 30 days
 * @returns {(string | number)[]}
 */
export function getTimeDifference(
  compareWithCurrent: string,
  suffixEnabled: boolean = false,
  limitMonth: boolean = true
): (string | number)[] {
  const currentTime = new Date().getTime();
  const serverTime = new Date(compareWithCurrent).getTime();

  const delta = currentTime - serverTime;
  const deltaMinutes = Math.abs(delta) / (60 * 1000); // In minutes

  if (deltaMinutes > MINUTES_PER_MONTH && limitMonth) {
    return [0, "N/A"];
  }

  // now
  if (deltaMinutes < 1) {
    return [0, "Just now"];
  }
  // Past
  else if (delta > 0) {
    const suffix = "ago";
    const diffToString = getDifferenceString(
      deltaMinutes,
      suffix,
      suffixEnabled
    );
    return [-1, diffToString];
  }
  // Future
  else {
    const suffix = "later";
    const diffToString = getDifferenceString(
      deltaMinutes,
      suffix,
      suffixEnabled
    );
    return [1, diffToString];
  }
}
