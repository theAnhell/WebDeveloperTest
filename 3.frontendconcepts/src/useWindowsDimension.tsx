import { useState, useEffect } from "react";

const getWindowDimensions = () => {
  const { innerWidth: width } = window;
  return width <= 600;
};

export const useWindowDimensions = () => {
  const [mobile, setMobile] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setMobile(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return mobile;
};
