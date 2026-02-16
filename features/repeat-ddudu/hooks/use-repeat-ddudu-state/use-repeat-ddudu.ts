import { useMemo, useState } from "react";

import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";

import type { RepeatDduduItemType } from "../../repeat-ddudu.types";

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

function createTempId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isSameRepeatDdudu(
  repeatDdudu: RepeatDduduItemType,
  target: { id?: number; tempId?: string },
) {
  if (target.id && repeatDdudu.id) {
    return repeatDdudu.id === target.id;
  }

  if (target.tempId && repeatDdudu.tempId) {
    return repeatDdudu.tempId === target.tempId;
  }

  return false;
}

function useRepeatDduduState() {
  const [repeatDdudus, setRepeatDdudus] = useState<RepeatDduduItemType[]>([]);
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
        return [...prev, { ...nextRepeatDdudu, tempId: createTempId() }];
      }

      return prev.map((item, index) =>
        index === selectedRepeatDduduIndex ? { ...item, ...nextRepeatDdudu } : item,
      );
    });

    setSelectedRepeatDduduIndex(null);
  };

  const handleDeleteRepeatDdudu = (target: { id?: number; tempId?: string }) => {
    setRepeatDdudus((prev) => {
      const deleteIndex = prev.findIndex((repeatDdudu) => isSameRepeatDdudu(repeatDdudu, target));

      if (deleteIndex < 0) {
        return prev;
      }

      setSelectedRepeatDduduIndex((currentIndex) => {
        if (currentIndex === null) {
          return null;
        }

        if (currentIndex === deleteIndex) {
          return null;
        }

        if (currentIndex > deleteIndex) {
          return currentIndex - 1;
        }

        return currentIndex;
      });

      return prev.filter((_, index) => index !== deleteIndex);
    });
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
    handleDeleteRepeatDdudu,
    handleResetRepeatDdudus,
  };
}

export default useRepeatDduduState;
