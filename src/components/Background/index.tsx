<<<<<<< HEAD
=======

>>>>>>> b7fcf0ff7a087704982f7f82af65c82a3312fcd1
import GridDistortion from './GridDistortion';

export const InteractiveBackground: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-0">
      <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
        <GridDistortion
          imageSrc="https://picsum.photos/1920/1080?grayscale"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="opacity-30"
        />
      </div>
    </div>
  );
};
=======
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

>>>>>>> b7fcf0ff7a087704982f7f82af65c82a3312fcd1
export { GridDistortion };
