function checkMultiple(
  value: number,
  type: "minute" | "hour" | "day",
  state: "ago" | "later"
) {
  let timeValue: string = "";
  if (value > 1) {
    timeValue = value + ` ${type}s ${state}`;
  } else {
    timeValue = value + ` ${type} ${state}`;
  }

  return timeValue;
}

export function timeDifference(compareTimeWith: string): string {
  const currentTime = new Date().getTime();
  const serverTime = new Date(compareTimeWith).getTime();

  let timeDiffActual: string | number = "";

  const deltaTime = currentTime - serverTime;
  const timeDiffMinutes = deltaTime / (60 * 1000); // In minutes

  if (deltaTime >= 0) {
    // Comparing with back time (ago)
    if (timeDiffMinutes < 60) {
      const timeElapsed = Math.floor(timeDiffMinutes);
      timeDiffActual = checkMultiple(timeElapsed, "minute", "ago");
    } else if (timeDiffMinutes > 60 && timeDiffMinutes < 60 * 24) {
      const timeElapsed = Math.floor(timeDiffMinutes / 60);
      timeDiffActual = checkMultiple(timeElapsed, "hour", "ago");
    } else {
      const timeElapsed = Math.floor(timeDiffMinutes / (60 * 24));
      timeDiffActual = checkMultiple(timeElapsed, "day", "ago");
    }
  } else {
    // Comparing with forward time (later)
    const absTimeDiff = Math.abs(timeDiffMinutes);
    if (absTimeDiff < 60) {
      const timeLeft = Math.floor(absTimeDiff);
      timeDiffActual = checkMultiple(timeLeft, "minute", "later");
    } else if (absTimeDiff > 60 && absTimeDiff < 60 * 24) {
      const timeLeft = Math.floor(absTimeDiff / 60);
      timeDiffActual = checkMultiple(timeLeft, "hour", "later");
    }
  }

  return timeDiffActual;
}

