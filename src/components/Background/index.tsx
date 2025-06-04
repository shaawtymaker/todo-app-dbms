
import GridDistortion from './GridDistortion';

export const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
        <GridDistortion
          imageSrc="https://picsum.photos/1920/1080?grayscale"
          grid={15}
          mouse={0.15}
          strength={0.2}
          relaxation={0.85}
          className="opacity-40"
        />
      </div>
    </div>
  );
};
export { GridDistortion };
