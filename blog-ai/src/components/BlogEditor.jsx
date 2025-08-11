// src/components/BlogEditor.js
import React, { useState, useEffect, useRef } from 'react';
import {
    CopyIcon, CheckIcon, DownloadIcon, UploadIcon, EditIcon, SaveIcon, BookmarkIcon, TrashIcon
} from './Icons';
import BlogRenderer from './BlogRender';
const BlogEditor = ({ blog, onBack, onSave, onSaveToDB, onDeleteBlog, isReadOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(blog.content);
    const [editedImage, setEditedImage] = useState(blog.titleImage);
    const [copied, setCopied] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editedContent) {
            const words = editedContent.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        } else {
            setWordCount(0);
        }
    }, [editedContent]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setEditedImage(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(blog, editedContent, editedImage);
        setIsEditing(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blog.content || editedContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDownload = () => {
        const content = blog.content || editedContent;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = `${blog.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={onBack} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">← Back</button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{blog.topic}</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <span>{wordCount} words</span><span>•</span><span>{Math.ceil(wordCount / 200)} min read</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={handleCopy} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center space-x-2 transition-colors">
                                {copied ? <CheckIcon /> : <CopyIcon />}<span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                            <button onClick={handleDownload} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center space-x-2 transition-colors">
                                <DownloadIcon /><span className="text-sm font-medium">Download</span>
                            </button>
                            {!isReadOnly && (
                                <>
                                    <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center space-x-2 transition-colors">
                                        <UploadIcon /><span className="text-sm font-medium">Image</span>
                                    </button>
                                    <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors font-medium ${isEditing ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}>
                                        <EditIcon /><span className="text-sm">{isEditing ? 'Cancel' : 'Edit'}</span>
                                    </button>
                                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center space-x-2 transition-colors font-medium">
                                        <SaveIcon /><span className="text-sm">Save</span>
                                    </button>
                                    {blog.source !== 'saved' && (
                                        <button onClick={() => onSaveToDB(blog._id)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center space-x-2 transition-colors font-medium">
                                            <BookmarkIcon /><span className="text-sm">Save to DB</span>
                                        </button>
                                    )}
                                    <button onClick={async () => { if (window.confirm('Are you sure you want to delete this blog?')) { await onDeleteBlog(blog._id); onBack(); } }} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center space-x-2 transition-colors font-medium">
                                        <TrashIcon /><span className="text-sm">Delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {editedImage && (<div className="w-full max-h-96 flex justify-center items-center bg-gray-100 p-4"><img src={editedImage} alt={blog.topic} className="w-auto h-auto max-w-full max-h-96 object-contain rounded-lg" /></div>)}
                    <div className="p-8 lg:p-12">
                        {isEditing && !isReadOnly ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Editing Mode</span><span>{wordCount} words</span>
                                </div>
                                <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full h-96 p-6 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm resize-none" placeholder="Write your blog content here..." />
                            </div>
                        ) : (<BlogRenderer text={blog.content || ''} />)}
                    </div>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>
    );
};

export default BlogEditor;