export function BlockchainGrid() {
  return (
    <div
      className="absolute inset-0 z-[1]"
      style={{
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px)',
        backgroundSize: '60px 60px',
        animation: 'gridMove 30s linear infinite'
      }}
    />
  )
}

export function GlowOrbs() {
  return (
    <>
      <div
        className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] z-[1]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
          animation: 'float1 20s infinite'
        }}
      />
      <div
        className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] z-[1]"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
          animation: 'float2 25s infinite'
        }}
      />
    </>
  )
}
