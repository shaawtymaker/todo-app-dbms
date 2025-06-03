
import GridDistortion from './GridDistortion';

export const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <GridDistortion
        imageSrc="https://picsum.photos/1920/1080?grayscale"
        grid={8}
        mouse={0.05}
        strength={0.08}
        relaxation={0.95}
        className="absolute inset-0 opacity-30"
      />
    </div>
  );
};

export { GridDistortion };
