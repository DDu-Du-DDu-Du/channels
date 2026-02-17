import { useState } from "react";

import type { DDuDuTimeType } from "@/features/feed/feed.types";

interface UseDDuDuTimeProps {
  handleDDuDuTimeSheetToggleOn: () => void;
  handleDDuDuSheetToggleOff: () => void;
}

const useDDuDuTime = ({
  handleDDuDuTimeSheetToggleOn,
  handleDDuDuSheetToggleOff,
}: UseDDuDuTimeProps) => {
  const [currentDDuDuTime, setCurrentDDuDuTime] = useState<DDuDuTimeType>({
    beginAt: null,
    endAt: null,
  });

  const handleDDuDuTimeSetting = (beginAt: string | null = null, endAt: string | null = null) => {
    setCurrentDDuDuTime({ beginAt, endAt });
    handleDDuDuTimeSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  const handleUpdateDDuDuTime = (updateTime: DDuDuTimeType) => {
    setCurrentDDuDuTime(updateTime);
  };

  return { currentDDuDuTime, handleDDuDuTimeSetting, handleUpdateDDuDuTime };
};

export default useDDuDuTime;
