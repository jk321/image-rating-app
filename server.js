const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

// Serve static HTML files
app.use(express.static('public'));

// Serve images.json
app.get('/images.json', (req, res) => {
    fs.readFile('images.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error loading images.");
        }
        res.send(JSON.parse(data));
    });
});

// Save rating endpoint
app.post('/save-rating', (req, res) => {
    const { imageUrl, rating } = req.body;
    fs.readFile('images.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file.");
        }
           const jsonData = JSON.parse(data);
           jsonData.ratings[imageUrl] = rating; // Save the rating for the image URL

           fs.writeFile('images.json', JSON.stringify(jsonData, null, 2), (err) => {
               if (err) {
                   return res.status(500).send("Error saving rating.");
               }
               res.status(200).send("Rating saved.");
           });
       });
   });

   // Start server
   const PORT = 3000;
   app.listen(PORT, () => {
       console.log(`Server running at http://localhost:${PORT}`);
   });
