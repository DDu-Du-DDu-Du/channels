import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface UseDDuDuEditProps {
  setIsCreateDDuDu: Dispatch<SetStateAction<boolean>>;
}

const useDDuDuEdit = ({ setIsCreateDDuDu }: UseDDuDuEditProps) => {
  const [currentDDuDuId, setCurrentDDuDuId] = useState(-1);
  const [editDDuDuId, setEditDDuDuId] = useState(-1);

  const handleCloseDDuDuInput = () => {
    setIsCreateDDuDu(false);
    setEditDDuDuId(-1);
    setCurrentDDuDuId(-1);
    console.log("close");
  };

  const handleUpdateEditDDuDuId = (id: number) => {
    setEditDDuDuId(id);
    console.log(id);
  };

  return {
    currentDDuDuId,
    editDDuDuId,
    setCurrentDDuDuId,
    handleCloseDDuDuInput,
    handleUpdateEditDDuDuId,
  };
};

export default useDDuDuEdit;
