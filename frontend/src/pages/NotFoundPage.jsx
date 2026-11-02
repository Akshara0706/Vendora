import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary px-8 py-3">Go Back Home</Link>
    </div>
  );
}
