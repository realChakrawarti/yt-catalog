"use client";

import { useEffect, useState } from "react";
import { timeDifference } from "../../lib/client-helper";

const TimeDifference = ({ date, ...rest }: any) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const timeDiff = timeDifference(date);
    setTime(timeDiff);
  }, [date]);

  return <span {...rest}>{time}</span>;
};

export default TimeDifference;
