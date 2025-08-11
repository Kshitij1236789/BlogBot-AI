// models/blog.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    // The custom 'id' field has been removed. 
    // Mongoose will automatically create a unique '_id' for each document.
    topic: {
        type: String,
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true,
    },
    titleImage: {
        type: String, // Assuming this is a URL or base64 string
        default: '',
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'failed'],
        default: 'scheduled',
    },
    content: {
        type: String,
        default: null,
    },
    isSaved: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
    }
}, {
    // This option adds `createdAt` and `updatedAt` fields to your documents
    timestamps: true 
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
