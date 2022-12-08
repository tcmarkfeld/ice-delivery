import { useState } from "react";

export const useToggleCheck = () => {
  const [check, setCheck] = useState(false);
  const [rightIcon, setRightIcon] = useState("checkbox-blank-outline");

  // This changes the icon for the password visibility when clicked
  const handleCheck = () => {
    if (rightIcon === "checkbox-marked-outline") {
      setRightIcon("checkbox-blank-outline");
      setCheck(!check);
    } else if (rightIcon === "checkbox-blank-outline") {
      setRightIcon("checkbox-marked-outline");
      setCheck(!check);
    }
  };

  return {
    check,
    rightIcon,
    handleCheck,
  };
};
