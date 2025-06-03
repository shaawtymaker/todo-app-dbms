
import GridDistortion from './GridDistortion';
import { FloatingShapes } from './FloatingShapes';

export const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <GridDistortion
        imageSrc="https://picsum.photos/1920/1080?grayscale"
        grid={10}
        mouse={0.1}
        strength={0.15}
        relaxation={0.9}
        className="absolute inset-0"
      />
      <FloatingShapes />
    </div>
  );
};

export { GridDistortion, FloatingShapes };
