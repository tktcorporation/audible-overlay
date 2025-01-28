interface OverlayWindowProps {
  isActive: boolean;
}

export const OverlayWindow: React.FC<OverlayWindowProps> = ({ isActive }) => {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none bg-transparent flex justify-center items-center overflow-hidden">
      <div className={`absolute inset-0 w-full h-full transition-all duration-300 box-border bg-transparent ${
        isActive
          ? 'shadow-[0_-10px_10px_rgba(0,255,0,0.4),0_10px_10px_rgba(0,255,0,0.4),-10px_0_10px_rgba(0,255,0,0.4),10px_0_10px_rgba(0,255,0,0.4),inset_0_0_30px_rgba(0,255,0,0.2),inset_0_0_30px_rgba(0,255,0,0.1)]'
          : ''
      }`}>
      </div>
    </div>
  );
}; 