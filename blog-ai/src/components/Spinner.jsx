// src/components/Spinner.js
import React from 'react';

const Spinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute top-0"></div>
        </div>
    </div>
);

export default Spinner;