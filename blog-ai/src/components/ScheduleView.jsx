// src/components/ScheduleView.js
import React from 'react';
import SearchAndFilter from './SearchAndFilter';
import { PlusIcon, TrashIcon, ClockIcon, BookmarkIcon, CheckIcon } from './Icons';

const ScheduleView = ({
    filteredScheduledBlogs, setSearchTerm, setFilterStatus, filterStatus,
    setIsModalOpen, handleClearScheduled, setView, handleSaveToDB, handleDeleteBlog, setSchedulingMode
}) => {
    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Schedule</h1>
                        <p className="text-gray-600">Manage your scheduled and completed blog posts</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                        <button onClick={() => { setSchedulingMode('generate'); setIsModalOpen(true); }} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold">
                            <PlusIcon />
                            <span>Schedule New</span>
                        </button>
                        {filteredScheduledBlogs.length > 0 && (
                            <button onClick={handleClearScheduled} className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl flex items-center space-x-2 transition-colors border border-red-200">
                                <TrashIcon />
                                <span className="font-medium">Clear All</span>
                            </button>
                        )}
                    </div>
                </div>

                <SearchAndFilter onSearch={setSearchTerm} onFilter={setFilterStatus} totalBlogs={filteredScheduledBlogs.length} activeFilter={filterStatus} />

                <div className="space-y-6">
                    {filteredScheduledBlogs.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <ClockIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Scheduled Blogs Found</h3>
                            <p className="text-gray-500">Try adjusting your filters or schedule a new post.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredScheduledBlogs.map(blog => (
                                <div key={blog._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                                   <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            <div
                                                className={`flex-1 ${blog.status === 'completed' ? 'cursor-pointer' : ''}`}
                                                onClick={() => blog.status === 'completed' && setView({ name: 'editor', data: { ...blog, source: 'schedule' } })}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {blog.titleImage && <img src={blog.titleImage} alt={blog.topic} className="w-20 h-20 rounded-xl object-cover border border-gray-200" />}
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.topic}</h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                                            <span className="flex items-center space-x-1"><ClockIcon /><span>Scheduled: {new Date(blog.scheduledTime).toLocaleString()}</span></span>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                                blog.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200'
                                                                : blog.status === 'failed' ? 'bg-red-100 text-red-800 border border-red-200'
                                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                    blog.status === 'completed' ? 'bg-green-600'
                                                                    : blog.status === 'failed' ? 'bg-red-600'
                                                                    : 'bg-yellow-600'}`}></div>
                                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        {blog.status === 'failed' && blog.error && (
                                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                                <p className="text-sm text-red-700 font-medium">Error: <span className="text-xs text-red-600 mt-1">{blog.error}</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                {blog.status === 'completed' && !blog.isSaved && (
                                                    <button onClick={() => handleSaveToDB(blog._id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center space-x-2 transition-colors shadow-sm">
                                                        <BookmarkIcon /> <span>Save to Library</span>
                                                    </button>
                                                )}
                                                {blog.status === 'completed' && blog.isSaved && (
                                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center space-x-2"><CheckIcon /> <span>Saved</span></span>
                                                )}
                                                <button onClick={() => handleDeleteBlog(blog._id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors border border-red-200">
                                                    <TrashIcon /> <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleView;