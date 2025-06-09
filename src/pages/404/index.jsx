import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-gray-800">404</h1>
            <h2 className="text-4xl font-semibold mt-4 text-gray-700">Page Not Found</h2>
            <p className="mt-4 text-lg text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFound;
