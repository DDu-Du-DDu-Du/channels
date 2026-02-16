import { useMemo, useState } from "react";

import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";

function toTimeWithSecond(time?: string) {
  if (!time) {
    return undefined;
  }

  if (time.length === 8) {
    return time;
  }

  if (time.length === 5) {
    return `${time}:00`;
  }

  return time;
}

function useRepeatDdudu() {
  const [repeatDdudus, setRepeatDdudus] = useState<RepeatDduduRequestType[]>([]);
  const [selectedRepeatDduduIndex, setSelectedRepeatDduduIndex] = useState<number | null>(null);

  const selectedRepeatDdudu = useMemo(() => {
    if (selectedRepeatDduduIndex === null) {
      return undefined;
    }

    return repeatDdudus[selectedRepeatDduduIndex];
  }, [repeatDdudus, selectedRepeatDduduIndex]);

  const handlePrepareCreateRepeatDdudu = () => {
    setSelectedRepeatDduduIndex(null);
  };

  const handleSelectRepeatDdudu = (index: number) => {
    setSelectedRepeatDduduIndex(index);
  };

  const handleClearSelectedRepeatDdudu = () => {
    setSelectedRepeatDduduIndex(null);
  };

  const handleSaveRepeatDdudu = (repeatDdudu: RepeatDduduRequestType) => {
    const nextRepeatDdudu: RepeatDduduRequestType = {
      ...repeatDdudu,
      beginAt: toTimeWithSecond(repeatDdudu.beginAt),
      endAt: toTimeWithSecond(repeatDdudu.endAt),
    };

    setRepeatDdudus((prev) => {
      if (selectedRepeatDduduIndex === null) {
        return [...prev, nextRepeatDdudu];
      }

      return prev.map((item, index) =>
        index === selectedRepeatDduduIndex ? nextRepeatDdudu : item,
      );
    });

    setSelectedRepeatDduduIndex(null);
  };

  const handleResetRepeatDdudus = () => {
    setRepeatDdudus([]);
    setSelectedRepeatDduduIndex(null);
  };

  return {
    repeatDdudus,
    selectedRepeatDdudu,
    handlePrepareCreateRepeatDdudu,
    handleSelectRepeatDdudu,
    handleClearSelectedRepeatDdudu,
    handleSaveRepeatDdudu,
    handleResetRepeatDdudus,
  };
}

export default useRepeatDdudu;
