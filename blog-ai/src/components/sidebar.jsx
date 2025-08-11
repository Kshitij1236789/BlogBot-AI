// src/components/Sidebar.jsx
import React from 'react';
import {
    XIcon, MenuIcon, PlusIcon, ClockIcon, SparklesIcon, TrashIcon
} from './Icons';

const Sidebar = ({
    isSidebarOpen, setIsSidebarOpen, startNewChat, setView, chatHistory,
    loadChatHistory, activeChatId, deleteChatItem, clearChatHistory,
    filteredSavedBlogs, handleDeleteBlog
}) => {
    return (
        // --- MODIFIED --- Added fixed positioning and z-index for overlapping
        <div className={`fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-200 shadow-xl flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80 p-6' : 'w-20 p-4'}`}>
            <div className={`flex items-center mb-8 flex-shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                {isSidebarOpen && (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">BlogBot</h2>
                            <p className="text-xs text-gray-500">AI Content Creator</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>

            <div className="space-y-3 mb-8">
                <button
                    onClick={startNewChat}
                    title="New Chat"
                    className={`w-full flex items-center justify-center p-4 rounded-xl transition-all font-semibold ${
                        isSidebarOpen
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    <PlusIcon className={isSidebarOpen ? "mr-2" : ""} />
                    {isSidebarOpen && <span>New Chat</span>}
                </button>
                <button
                    onClick={() => setView({ name: 'schedule', data: null })}
                    title="View Schedule"
                    className="w-full flex items-center justify-center p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                    <ClockIcon className={isSidebarOpen ? "mr-2" : ""} />
                    {isSidebarOpen && <span>View Schedule</span>}
                </button>
                <button
                    onClick={() => { setView({ name: 'refine', data: null }); }}
                    title="Refine Content"
                    className="w-full flex items-center justify-center p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                    <SparklesIcon className={isSidebarOpen ? "mr-2" : ""} />
                    {isSidebarOpen && <span>Refine Content</span>}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto overflow-x-hidden w-full">
                {isSidebarOpen && <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wide">Recent Chats</h3>}
                {chatHistory.length > 0 ? (
                    <ul className="space-y-2 mb-8">
                        {chatHistory.slice(0, 10).map(chat => (
                            <li key={chat.id} className={`group ${isSidebarOpen ? '' : 'mb-3'}`}>
                                <div
                                    onClick={() => loadChatHistory(chat.id)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeChatId === chat.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'} ${isSidebarOpen ? 'justify-between' : 'justify-center h-12 w-12'}`}
                                    title={chat.title}
                                >
                                    {isSidebarOpen ? (
                                        <>
                                            <span className="truncate flex-1 text-sm font-medium text-gray-700">{chat.title}</span>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteChatItem(chat.id); }}
                                                className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1 rounded"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="font-bold text-indigo-600 text-lg">{chat.title.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : ( isSidebarOpen && <p className="text-gray-500 text-sm text-center mb-8">No chats yet.</p> )}
                {isSidebarOpen && chatHistory.length > 0 && (
                    <button onClick={clearChatHistory} className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors mb-8 py-2">
                        Clear all chats
                    </button>
                )}
                {isSidebarOpen && <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wide">Saved Blogs</h3>}
                {filteredSavedBlogs.length > 0 ? (
                    <ul className="space-y-2">
                        {filteredSavedBlogs.slice(0, 8).map(blog => (
                            <li key={blog._id} className="group">
                                <div
                                    onClick={() => setView({ name: 'editor', data: { ...blog, source: 'saved' } })}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${isSidebarOpen ? 'justify-between' : 'justify-center h-12 w-12'}`}
                                    title={blog.topic}
                                >
                                    {isSidebarOpen ? (
                                        <>
                                            <div className="flex-1">
                                                <span className="truncate block text-sm font-medium text-gray-700">{blog.topic}</span>
                                                <span className="text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDeleteBlog(blog._id); }}
                                                className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1 rounded"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="font-bold text-blue-600 text-lg">{blog.topic.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : ( isSidebarOpen && <p className="text-gray-500 text-sm text-center">No saved blogs yet.</p> )}
            </div>
        </div>
    );
};

export default Sidebar;