
import React from 'react';


const BlogRenderer = ({ text }) => {
    const formatText = (inputText) => {
        if (!inputText) return '';
        let html = inputText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
        html = html.replace(/__(.*?)__/g, '<span class="underline font-semibold text-black decoration-2 underline-offset-2">$1</span>');
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        html = html.replace(urlRegex, (url) => {
            let href = url;
            if (!href.startsWith('http')) {
                href = 'https://' + href;
            }
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-black font-medium hover:text-black-700 hover:underline transition-colors duration-200">${url}</a>`;
        });
        const lines = html.split('\n');
        let inList = false;
        let finalHtml = '';
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('# ')) {
                if (inList) { finalHtml += '</ul>'; inList = false; }
                finalHtml += `<h1 class="text-4xl font-bold mt-8 mb-6 text-gray-900 tracking-tight leading-tight">${trimmedLine.substring(2)}</h1>`;
            } else if (trimmedLine.startsWith('## ')) {
                if (inList) { finalHtml += '</ul>'; inList = false; }
                finalHtml += `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800 tracking-tight border-l-4 border-blue-500 pl-4">${trimmedLine.substring(3)}</h2>`;
            } else if (trimmedLine.startsWith('* ')) {
                if (!inList) { finalHtml += '<ul class="list-disc list-inside space-y-3 my-6 pl-6 text-lg text-gray-700">'; inList = true; }
                finalHtml += `<li class="leading-relaxed">${trimmedLine.substring(2)}</li>`;
            } else if (trimmedLine.startsWith('---')) {
                if (inList) { finalHtml += '</ul>'; inList = false; }
                finalHtml += '<hr class="my-8 border-t-2 border-gray-200" />';
            } else {
                if (inList) { finalHtml += '</ul>'; inList = false; }
                if (trimmedLine !== '') {
                    finalHtml += `<p class="text-lg leading-relaxed my-5 text-gray-700">${line}</p>`;
                }
            }
        });
        if (inList) {
            finalHtml += '</ul>';
        }
        return finalHtml;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <article
                className="font-sans text-base leading-relaxed blog-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(text) }}
            />
        </div>
    );
};

export default BlogRenderer;