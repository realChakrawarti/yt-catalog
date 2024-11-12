"use client";

import { useEffect, useState } from "react";
import { getTimeDifference } from "../../lib/client-helper";

const TimeDifference = ({ date, ...rest }: any) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const [when, timeDiff] = getTimeDifference(date);
    if ((when as number) < 0) {
      setTime("Automatically updating, please wait...");
      setTimeout(() => {
        window?.location?.reload();
      }, 4000);
    } else {
      setTime(timeDiff as string);
    }
  }, [date]);

  return <span {...rest}>{time}</span>;
};

export default TimeDifference;
