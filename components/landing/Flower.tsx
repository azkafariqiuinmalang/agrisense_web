/** Locally drawn decorative rosette. */
export function Flower({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {Array.from({ length: 12 }, (_, index) => (
          <ellipse
            key={index}
            cx="100"
            cy="48"
            rx="22"
            ry="47"
            transform={"rotate(" + index * 30 + " 100 100)"}
          />
        ))}
        <circle cx="100" cy="100" r="48" />
      </g>
    </svg>
  );
}
