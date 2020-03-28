import { useState, useEffect } from 'react';





export default function() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)) {
      setIsMobile(true);
    };
  }, []);

  return isMobile;
};
