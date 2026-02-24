import { useState } from "react";

const useToggle = (initialValue = false) => {
  const [isToggle, setIsToggle] = useState(initialValue);

  const handleToggleOn = () => {
    setIsToggle(true);
  };

  const handleToggleOff = () => {
    setIsToggle(false);
  };

  const handleToggle = () => {
    setIsToggle((prevState) => !prevState);
  };

  return {
    isToggle,
    handleToggleOn,
    handleToggleOff,
    handleToggle,
  };
};

export default useToggle;
