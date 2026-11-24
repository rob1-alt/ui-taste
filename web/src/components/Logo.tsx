// The ui taste logo, painted in currentColor through a CSS mask so it follows the theme (see .logo in the stylesheets).
export function Logo({ className = "" }: { className?: string }) {
  return <span className={`logo ${className}`.trim()} role="img" aria-label="ui taste" />;
}
