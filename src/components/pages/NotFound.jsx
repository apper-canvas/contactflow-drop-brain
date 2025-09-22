import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/contacts" className="inline-block px-6 py-3 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors">
          Go to Contacts
        </Link>
      </div>
    </div>
  );
};

export default NotFound;