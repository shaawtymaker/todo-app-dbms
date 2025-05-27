
import { AnimatedBackground } from './AnimatedBackground';
import { FloatingShapes } from './FloatingShapes';

export const InteractiveBackground: React.FC = () => {
  return (
    <>
      <AnimatedBackground />
      <FloatingShapes />
    </>
  );
};

export { AnimatedBackground, FloatingShapes };
