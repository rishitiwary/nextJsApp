"use client";

import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { StyledBox } from "./styles";

// ==============================================================
export interface StickyProps {
  fixedOn: number;
  children?: ReactElement;
  scrollDistance?: number;
  onSticky?: (isFixed: boolean) => void;
}
// ==============================================================

export default function Sticky(props: StickyProps) {
  const { fixedOn, scrollDistance = 0, children, onSticky } = props;
  const [fixed, setFixed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

    // Detect screen size and update isMobile
    const handleResize = useCallback(() => {
      setIsMobile(window.innerWidth <= 768); // Adjust for mobile screen size threshold
    }, []);
  
  
  const scrollListener = useCallback(() => {
    if (!window) return;

    const isFixed = window.scrollY >= fixedOn + scrollDistance;
    setFixed(isFixed);
  }, [fixedOn, scrollDistance]);

  
  useEffect(() => {
    if (!window) return;
    handleResize(); // Set initial value for mobile screen detection
    window.addEventListener("scroll", scrollListener);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", scrollListener);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollListener,handleResize]);

  useEffect(() => {
    if (onSticky) onSticky(fixed);
  }, [fixed, onSticky]);

  useEffect(() => {
    if (elementRef.current) {
      setHeight(elementRef.current.offsetHeight);
      scrollListener();
    }
  }, [scrollListener]);


  return (
    <StyledBox fixedOn={fixedOn} componentHeight={height} fixed={fixed}>
      <div className={clsx({ hold: !fixed, fixed: fixed })} ref={elementRef}>
      {children && React.cloneElement(children, { fixed,isMobile })}
      </div>
    </StyledBox>
  );
}
