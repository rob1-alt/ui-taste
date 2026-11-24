// A plain section head: a title and one sentence. No numbering, no labels, no rule.
export function Head({ title, children, className = "" }: { title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <header className={`ph ${className}`.trim()}>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </header>
  );
}
