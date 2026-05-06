export default function ContaLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="skeleton h-7 w-32 rounded-lg" />
      <div className="skeleton h-10 w-64 rounded-lg" />
      <div className="skeleton h-5 w-80 rounded" />
      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    </div>
  );
}
