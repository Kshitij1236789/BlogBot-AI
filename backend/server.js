// server.js

// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cron = require("node-cron");
require("dotenv").config(); // To load environment variables from .env file

// Initialize the express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- Import Models and Data ---
const companyData = require("./company-data.js");
const Blog = require("./models/blog.js"); // Import the Blog model

// --- Google Generative AI Setup ---
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 flash as a modern choice

// --- System Instruction Prompt ---
const systemPrompt = `
    You are "BlogBot," an expert content strategist for a company called Omnicassion. Your primary goal is to generate high-quality blog posts that perfectly match the company's established style and tone, based on the reference material provided.
    
    --- REFERENCE MATERIAL ---
    
    **Company Summary:**
    ${companyData.summary}
    
    **Examples of Our Writing Style:**
    ${
      Array.isArray(companyData.blogExamples) &&
      companyData.blogExamples.length > 0
        ? companyData.blogExamples
            .map(
              (blog) =>
                `\n\n--- Example Start ---\nTitle: ${blog.title}\nContent:\n${blog.content}\n--- Example End ---`
            )
            .join("")
        : "No blog examples available."
    } 
 
    --- CRITICAL RULES: YOU MUST FOLLOW THESE AT ALL TIMES ---
    
    1. MIMIC THE STYLE: Your most important task is to analyze the reference material. The new blog post you generate MUST perfectly mimic the professional tone and writing style of the provided examples.
    
    2. WORD COUNT IS MANDATORY:
    * The final blog post MUST be between 500 and 700 words. This is a strict requirement.
    * To achieve this, each of the 3-5 main body sections must be detailed and comprehensive.
    
    3. FORMATTING & STRUCTURE (NON-NEGOTIABLE):
    * **HEADINGS:** You MUST use Markdown for headings. Use a single '#' for the main blog title (H1) and '##' for section headings (H2). Example: ## 1. This is a Heading.
    * **SECTION STRUCTURE:** Under each section heading, you MUST write an introductory paragraph (2-4 sentences) that explains the topic of that section. Only after this paragraph can you use bullet points.
    * **LISTS:** For any lists, each item MUST start on a new line with a single asterisk ('*'). Your lists should be comprehensive and detailed, aiming for at least 3-5 points per list to provide substantial value. Example: * This is a list item.
    
    4. TEXT EMPHASIS (VERY IMPORTANT):
    * **BOLD TEXT:** Use double asterisks (**text**) to make important keywords, concepts, and subheadings within paragraphs BOLD. This should be used frequently to highlight key terms and make the content scannable. Example: **event planning** or **corporate events**
    * **UNDERLINED TEXT:** Use double underscores (__text__) to underline the most critical phrases, main points, or call-to-action elements that need maximum attention. Example: __Plan Smart. Celebrate Better.__
    * **STRATEGIC USE:** In each paragraph, identify 2-3 key terms or phrases that should be bolded, and 1 main point that should be underlined for emphasis.
    * **ATTENTION-GRABBING:** Bold important statistics, company names, service types, and technical terms. Underline transformative statements, benefits, or unique selling propositions.
    
    5. CONTENT GUIDELINES:
    * **NO EMOJIS:** Do not use any emojis in your response. The tone is professional and clean.
    * **Make the blog long and informative:** The length of the blog should be 500-700 words with rich, detailed content.
    * **Use formatting strategically:** Every paragraph should have at least 1-2 bolded terms and occasional underlined key phrases to make the content visually engaging and easy to scan.
    
    6. COMPANY SIGNATURE IS MANDATORY:
    * After the blog's conclusion, you MUST add the following "Contact Us" section, using this exact format:
    ---
    **Contact Us**
    __Plan Smart. Celebrate Better. Only with Omnicassion.__
    Website: www.omnicassion.com
    Phone: 99887 77462 / 62845 98500
    Instagram: https://www.instagram.com/omnicassion/
    
    --- CONVERSATION RULES ---
    * For simple greetings or closings, respond naturally without generating a blog.
    * Your blog post response must start immediately with the title. Do not include any preamble like "Alright, I've analyzed the reference material...".
    * REMEMBER: Use **bold** and __underline__ formatting throughout your content to make it visually appealing and attention-grabbing.
    `;

const systemInstruction = { role: "user", parts: [{ text: systemPrompt }] };
const initialModelResponse = {
  role: "model",
  parts: [
    {
      text: "Got it! I'm BlogBot, ready to help you craft amazing blog posts. What's our first topic? 📝",
    },
  ],
};

// --- Core Blog Generation Logic (as a reusable function) ---
const generateBlogFromTopic = async (topic) => {
  const chat = model.startChat({
    history: [systemInstruction, initialModelResponse],
  });
  const result = await chat.sendMessage(topic);
  const response = await result.response;
  let text = response.text();
  // Keep formatting for frontend renderer, remove final cleanup step
  // text = text.replace(/\*\*/g, ""); 
  return text;
};

// --- FIXED Cron Job Scheduler (Uses MongoDB Only) ---
cron.schedule("* * * * *", async () => {
  console.log("Running a check for scheduled blogs...");
  try {
    const now = new Date();
    // Only finds blogs that are marked as 'scheduled' and due
    const dueBlogs = await Blog.find({
      status: "scheduled",
      scheduledTime: { $lte: now },
    });

    if (!dueBlogs.length) {
      // console.log("No scheduled blogs due at this time."); // Reduce log noise
      return;
    }

    for (const blog of dueBlogs) {
      // Check if the blog has pre-written content, if so, just mark as completed
      if (blog.content) {
          console.log(`Finalizing pre-written scheduled blog: ${blog.topic}`);
          await Blog.findByIdAndUpdate(blog._id, { status: "completed" });
      } else {
          // If no content, generate it
          console.log(`Generating scheduled blog for topic: ${blog.topic}`);
          try {
            const content = await generateBlogFromTopic(blog.topic);
            await Blog.findByIdAndUpdate(blog._id, {
              content,
              status: "completed",
            });
            console.log(`Blog generated successfully for topic: ${blog.topic}`);
          } catch (error) {
            console.error(
              `Failed to generate blog for topic: ${blog.topic}`,
              error
            );
            await Blog.findByIdAndUpdate(blog._id, {
              status: "failed",
              error: error.message || "Unknown error during generation.",
            });
          }
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// --- API Routes ---

// Endpoint for immediate, continuous chat/blog generation
app.post("/generate-blog", async (req, res) => {
  const { history } = req.body;
  if (!history || history.length === 0) {
    return res.status(400).json({ error: "Chat history is required." });
  }
  const chatHistory = history.map((msg) => ({
    role: msg.author === "ai" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));
  try {
    const contents = [systemInstruction, initialModelResponse, ...chatHistory];
    const chat = model.startChat({ history: contents.slice(0, -1) });
    const lastMessage = contents[contents.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    let text = response.text();
    // Keep formatting for the frontend renderer
    // text = text.replace(/\*\*/g, ""); 
    res.json({ blog: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- MODIFIED --- Endpoint to schedule a blog post
// Now handles both generating a blog from a topic AND scheduling a pre-written blog.
app.post("/schedule-blog", async (req, res) => {
  // Destructure 'content' as well
  const { topic, scheduledTime, titleImage, category, priority, content } = req.body;

  if (!topic || !scheduledTime) {
    return res
      .status(400)
      .json({ error: "Topic and scheduledTime are required." });
  }

  try {
    let newScheduledBlog;

    if (content) {
      // --- If content is provided (from Refine view) ---
      // The blog is already complete, so it's scheduled to be 'completed'.
      // The cron job will not generate it again.
      newScheduledBlog = new Blog({
        topic,
        scheduledTime: new Date(scheduledTime),
        titleImage,
        category,
        priority,
        content, // Use the provided content
        status: "completed", // Set status to completed immediately
        isSaved: false,
      });
      console.log(`Pre-written blog scheduled for topic: "${topic}" at ${scheduledTime}`);
    } else {
      // --- Original behavior (from Schedule Modal without pre-written content) ---
      // The blog needs to be generated by the cron job at the scheduled time.
      newScheduledBlog = new Blog({
        topic,
        scheduledTime: new Date(scheduledTime),
        titleImage,
        category,
        priority,
        content: null, // No content yet
        status: "scheduled", // Let the cron job pick it up
        isSaved: false,
      });
      console.log(`Blog generation scheduled for topic: "${topic}" at ${scheduledTime}`);
    }

    const savedBlog = await newScheduledBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error scheduling blog:", error);
    res.status(500).json({ error: "Failed to schedule blog." });
  }
});

// Endpoint to get all scheduled blogs
app.get("/scheduled-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ isSaved: false }).sort({
      scheduledTime: 1,
    });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching scheduled blogs:", err);
    res.status(500).json({ error: "Failed to fetch scheduled blogs." });
  }
});

// Endpoint to get all saved blogs
app.get("/saved-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ isSaved: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching saved blogs:", err);
    res.status(500).json({ error: "Failed to fetch saved blogs." });
  }
});

// --- NEW --- Endpoint to create a new blog directly in the saved library.
// This is used by the "Save to Library" button in the Refine view.
app.post("/saved-blogs", async (req, res) => {
  const { topic, content, titleImage } = req.body;

  if (!topic || !content) {
    return res
      .status(400)
      .json({ error: "Topic and content are required to save a blog." });
  }

  try {
    const newSavedBlog = new Blog({
      topic,
      content,
      titleImage: titleImage || null,
      isSaved: true,
      status: "completed",
      // --- FIX --- Provide the current time to satisfy the required schema path.
      scheduledTime: new Date(), 
    });

    const savedBlog = await newSavedBlog.save();
    console.log(`New blog saved directly to library: "${topic}"`);
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating saved blog:", error);
    res.status(500).json({ error: "Failed to save blog to library." });
  }
});


// Endpoint to save a blog (move from scheduled to saved)
app.post("/save-blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { isSaved: true },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    res.status(200).json({ message: "Blog saved successfully.", blog });
  } catch (err) {
    console.error("Error saving blog:", err);
    res.status(500).json({ error: "Failed to save blog." });
  }
});

// Endpoint to delete a specific blog
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Blog.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json({ message: "Blog deleted successfully." });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Failed to delete blog." });
  }
});

// Endpoint to update a blog post
app.put("/update-blog/:id", async (req, res) => {
  const { id } = req.params;
  const { content, titleImage, topic } = req.body;

  try {
    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (titleImage !== undefined) updateData.titleImage = titleImage;
    if (topic !== undefined) updateData.topic = topic;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    console.log(`Blog with id ${id} was updated.`);
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog." });
  }
});

// --- Connect to DB and Start Server ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });