// src/components/RefineView.js
import React from 'react';
import Spinner from './Spinner';
import BlogRenderer from './BlogRender';
import { SparklesIcon, BookmarkIcon, ClockIcon } from './Icons';

const RefineView = ({
    rawInput, setRawInput, refinedTopic, setRefinedTopic, refinedContent,
    isRefining, handleRefineSubmit, handleSaveRefinedBlog, setError,
    setSchedulingMode, setIsModalOpen
}) => {
    return (
        <div className="flex flex-col h-full p-6">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Refine Your Content</h1>
                    <p className="text-gray-600">Paste your raw text, add a title, and let our AI polish it for you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Column */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Raw Content</h2>
                        <div className="space-y-4 flex-grow flex flex-col">
                            <input
                                type="text"
                                value={refinedTopic}
                                onChange={(e) => setRefinedTopic(e.target.value)}
                                placeholder="Enter your blog title here..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <textarea
                                value={rawInput}
                                onChange={(e) => setRawInput(e.target.value)}
                                placeholder="Paste your raw blog text here..."
                                className="w-full flex-grow p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm resize-none"
                            />
                            <button
                                onClick={handleRefineSubmit}
                                disabled={isRefining || !rawInput.trim()}
                                className="w-full mt-4 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 transition-all shadow-lg font-semibold flex items-center justify-center space-x-2"
                            >
                                {isRefining ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Refining...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon />
                                        <span>Refine with AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Polished Result</h2>
                        <div className="h-[60vh] overflow-y-auto p-2 border-dashed border-2 border-gray-200 rounded-xl">
                            {isRefining ? (
                                <Spinner />
                            ) : refinedContent ? (
                                <BlogRenderer text={refinedContent} />
                            ) : (
                                <div className="text-center text-gray-500 flex flex-col justify-center items-center h-full">
                                    <SparklesIcon className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="font-medium">Your refined blog will appear here.</p>
                                </div>
                            )}
                        </div>
                        {refinedContent && (
                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleSaveRefinedBlog}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors font-medium"
                                >
                                    <BookmarkIcon />
                                    <span>Save to Library</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (!refinedTopic.trim()) {
                                            setError("Please enter a title before scheduling.");
                                            return;
                                        }
                                        setSchedulingMode('pre-written');
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center space-x-2 transition-colors font-medium"
                                >
                                    <ClockIcon />
                                    <span>Schedule Post</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefineView;