// src/components/ChatView.js
import React from 'react';
import Spinner from './Spinner';
import BlogRenderer from './BlogRender';
import { SendIcon } from './Icons';

const ChatView = ({
    isLoading, chatLog, question, setQuestion,
    handleKeyDown, askQuestion, chatEndRef
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className='flex-1 overflow-y-auto p-6'>
                <div className='container mx-auto max-w-4xl'>
                    {chatLog.length === 0 && !isLoading && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">B</span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BlogBot</h1>
                            <p className="text-xl text-gray-600">Your AI-powered content creation assistant.</p>
                        </div>
                    )}

                    {chatLog.map(m => (
                        <div key={m.id} className={`flex my-6 ${m.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-4xl p-6 rounded-2xl shadow-sm ${m.author === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'}`}>
                                <BlogRenderer text={m.text} />
                            </div>
                        </div>
                    ))}
                    {isLoading && <Spinner />}
                    <div ref={chatEndRef} />
                </div>
            </div>

            <div className='border-t border-gray-200 bg-white p-6'>
                <div className='w-full max-w-4xl mx-auto'>
                    <div className='bg-gray-50 border-2 border-gray-200 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-lg'>
                        <div className="flex items-end space-x-3">
                            <textarea
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className='flex-1 bg-transparent placeholder-gray-500 focus:outline-none px-4 py-3 resize-none max-h-32'
                                placeholder='Ask a follow-up or start a new topic...'
                                disabled={isLoading}
                                rows={1} />
                            <button
                                onClick={askQuestion}
                                disabled={isLoading || !question.trim()}
                                className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl p-4 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none'
                            >
                                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <SendIcon />}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">Press Enter to send, Shift+Enter for new line</p>
                </div>
            </div>
        </div>
    );
};

export default ChatView;