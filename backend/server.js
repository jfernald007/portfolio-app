const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Make sure cors is imported

const app = express();
const port = 5001;

// Middleware
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/portfolio-app', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define a simple collection schema and model
const slideSchema = new mongoose.Schema({
    title: String,
    content: String, // This will hold the rich text HTML content
});

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    slides: [slideSchema], // Array of slides
});

const Collection = mongoose.model('Collection', collectionSchema);

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// POST route to create a collection
app.post('/collections', async (req, res) => {
    const { title, description, slides } = req.body; // Include slides in the request
    try {
        const newCollection = new Collection({ title, description, slides });
        await newCollection.save();
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ error: 'Error creating collection' });
    }
});

// GET route to fetch collections
app.get('/collections', async (req, res) => {
    try {
        const collections = await Collection.find(); // Assuming 'Collection' is your MongoDB model
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching collections' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
