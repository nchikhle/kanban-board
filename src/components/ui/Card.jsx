export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`mt-2 space-y-2 ${className}`}>
      {children}
    </div>
  );
}