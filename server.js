const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// JSONbin settings
const JSONBIN_URL = "https://api.jsonbin.io/v3/b/672f1fdbad19ca34f8c6fb48";
const JSONBIN_API_KEY = "$2a$10$WWJZAd9FY4XjoOVyMtIRauSZjVfF/T2jRCL/QHY0QOIO8zm/VU.y2";

// Fetch data from JSONbin (GET request)
async function fetchImageData() {
    const response = await fetch(JSONBIN_URL, {
        method: 'GET',
        headers: {
            'X-Master-Key': JSONBIN_API_KEY,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.record;
}

// Save updated data to JSONbin (PUT request)
async function saveImageData(updatedData) {
    await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
            'X-Master-Key': JSONBIN_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    });
}

// Endpoint to serve images and ratings data to the client
app.get('/images.json', async (req, res) => {
    try {
        const data = await fetchImageData();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from JSONbin:", error);
        res.status(500).send("Error loading images.");
    }
});

// Endpoint to save a rating
app.post('/save-rating', async (req, res) => {
    const { imageUrl, rating } = req.body;

    try {
        const data = await fetchImageData();
        data.ratings[imageUrl] = rating;

        await saveImageData(data);

        res.status(200).send("Rating saved.");
    } catch (error) {
        console.error("Error saving rating to JSONbin:", error);
        res.status(500).send("Error saving rating.");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
