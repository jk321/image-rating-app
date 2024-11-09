const express = require('express');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed: npm install node-fetch
const app = express();
app.use(express.json());

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/672f186cacd3cb34a8a5719e"; // Replace with your JSONbin URL
const JSONBIN_API_KEY = "$2a$10$MdwYAZYXN9M/Jz0w9BElsuBskCOGuLZCRh84cO.ALPjTImhQ3Eu.i"; // Replace with your actual JSONbin API key

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
    return data.record; // JSONbin returns data under `record`
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
        // Fetch current data
        const data = await fetchImageData();

        // Update the ratings object with the new rating
        data.ratings[imageUrl] = rating;

        // Save the updated data back to JSONbin
        await saveImageData(data);

        res.status(200).send("Rating saved.");
    } catch (error) {
        console.error("Error saving rating to JSONbin:", error);
        res.status(500).send("Error saving rating.");
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
