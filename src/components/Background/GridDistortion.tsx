
import React, { useRef } from "react";
import { GridDistortionProps } from "./types";
import { useGridDistortion } from "./useGridDistortion";

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGridDistortion(containerRef, grid, mouse, strength, relaxation, imageSrc);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: '100vh' }}
    />
  );
};

export default GridDistortion;
