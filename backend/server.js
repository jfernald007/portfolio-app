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

// Define a simple Portfolio schema and model
const portfolioSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// POST route to create a portfolio
app.post('/portfolios', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newPortfolio = new Portfolio({ title, description });
        await newPortfolio.save();
        res.status(201).json(newPortfolio);
    } catch (error) {
        res.status(500).json({ error: 'Error creating portfolio' });
    }
});

// GET route to fetch portfolios
app.get('/portfolios', async (req, res) => {
    try {
        const portfolios = await Portfolio.find();
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching portfolios' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
