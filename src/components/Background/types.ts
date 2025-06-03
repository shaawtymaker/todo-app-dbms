
export interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
}

export interface MouseState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vX: number;
  vY: number;
}
