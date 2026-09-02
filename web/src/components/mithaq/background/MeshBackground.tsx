const MeshBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-mithaq-cream">
      <div
        className="mesh-orb"
        style={{
          width: 600,
          height: 600,
          top: -150,
          left: -100,
          background: "radial-gradient(circle, hsl(var(--pink-blush)), transparent 65%)",
          animation: "drift 16s ease-in-out infinite alternate",
        }}
      />
      <div
        className="mesh-orb"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          right: -80,
          background: "radial-gradient(circle, hsl(var(--pink-bubble)), transparent 65%)",
          animation: "drift2 20s ease-in-out infinite alternate",
        }}
      />
      <div
        className="mesh-orb"
        style={{
          width: 400,
          height: 400,
          top: "30%",
          left: "40%",
          opacity: 0.4,
          background: "radial-gradient(circle, hsl(var(--pink-soft)), transparent 65%)",
          animation: "drift3 24s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
};

export default MeshBackground;
