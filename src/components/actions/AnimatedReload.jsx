export function AnimatedReload({ size = 20, style }) {
  return (
    <div className={`flex items-center justify-center ${style}`}>
      <div className={"circleLoader"} style={{ width: size, height: size }} />
    </div>
  )
}
