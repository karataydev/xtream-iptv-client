export default function LoadingSpinner({ description }) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <div className="w-12 h-12 relative">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="mt-4">{description}</div>
    </div>
  );
}
