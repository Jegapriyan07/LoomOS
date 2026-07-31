import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

/**
 * Mic + assistant sparkle (Hotstar-style Ask mark).
 */
export function LoomAssistantMic({
  strokeWidth = 2,
  className,
  ...props
}: Props) {
  const { ["aria-hidden"]: ariaHidden, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden ?? true}
      {...rest}
    >
      {/* Mic capsule */}
      <rect x="7.5" y="3" width="7.5" height="11" rx="3.75" />
      {/* Mic cradle */}
      <path d="M5.5 12a6.25 6.25 0 0 0 12.5 0" />
      <path d="M11.75 18.25v2.75" />
      <path d="M8.75 21h6" />
      {/* Assistant sparkle — clearly visible on the mic shoulder */}
      <path
        d="M18.1 2.4 19 4.5 21.1 5.4 19 6.3 18.1 8.4 17.2 6.3 15.1 5.4 17.2 4.5 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M20.4 7.6 20.75 8.45 21.6 8.8 20.75 9.15 20.4 10 20.05 9.15 19.2 8.8 20.05 8.45 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
