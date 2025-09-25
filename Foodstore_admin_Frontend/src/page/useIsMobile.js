import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // เริ่มต้นด้วย window.innerWidth ทุกครั้ง
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    
    window.addEventListener("resize", handleResize);

    // เรียกทันทีตอน mount เพื่อให้ responsive ถูกต้อง
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
