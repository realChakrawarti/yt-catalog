"use client";

// Needed because react-scan must be imported first
// eslint-disable-next-line simple-import-sort/imports
import { scan } from "react-scan";
import { JSX, useEffect } from "react";

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
}
