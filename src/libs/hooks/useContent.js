import { useState, useEffect, useCallback } from 'react';
import { getContent } from '../../global';





export default function({ displayLayout = '', cols = 0, rows = 0, } = {}) {
  const [content, setContent] = useState(null);


  const configContent = useCallback(() => {
    const rawContent = getContent(displayLayout);

    for (let key in rawContent) {
      const { layout, onHover, str } = rawContent[key];
      const baseR = Math.round(layout.posY * rows);
      const baseC = Math.round(layout.posX * cols - str.length / 2);
      rawContent[key].startIndex = cols * baseR + baseC;

      if (!onHover) continue;

      onHover.total = onHover.data
        .map(d => d.str.split('')).flat().length;
      onHover.data.forEach((d, i) => {
        const r = baseR + (layout.deltaY * i) + layout.offsetY;
        const c =
          Math.round(baseC + (layout.deltaX * i) - d.str.length / 2) + layout.offsetX;
        d.startIndex = cols * r + c;
      });
    };

    setContent(rawContent);
  }, [displayLayout, cols, rows, content, setContent]);


  useEffect(() => {
    if (displayLayout && !content) {
      configContent();
    };
    if (!displayLayout && !!content) {
      setContent(null);
    };
  }, [displayLayout, content, setContent, configContent]);


  return content;
};
