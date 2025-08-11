// src/components/SearchAndFilter.js
import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from './Icons';

const SearchAndFilter = ({ onSearch, onFilter, totalBlogs, activeFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value) => {
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <FilterIcon className="text-gray-400" />
                    <select
                        value={activeFilter}
                        onChange={(e) => onFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                        {totalBlogs} {totalBlogs === 1 ? 'blog' : 'blogs'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchAndFilter;