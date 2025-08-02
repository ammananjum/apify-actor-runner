const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON requests

// Test route
app.get('/', (req, res) => {
  res.send('Apify WebApp Backend is running!');
});

// ✅ NEW: Validate API Key Route
app.post('/api/validate-key', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ message: 'API key is required' });
  }

  try {
    // Try to fetch user's actors using the key
    const response = await axios.get('https://api.apify.com/v2/acts', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.data && response.data.data) {
      return res.json({ message: 'API Key is valid!' });
    } else {
      return res.status(401).json({ message: 'Invalid API Key' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error validating API key' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
// NEW: Get User's Actors
app.post('/api/get-actors', async (req, res) => {
  const { apiKey } = req.body;

  try {
    const response = await axios.get(`https://api.apify.com/v2/acts`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const actors = response.data.data.items;
    res.json({ actors });
  } catch (error) {
    console.error('Error fetching actors:', error.message);
    res.status(500).json({ error: 'Failed to fetch actors. Please check your API key or try again later.' });
  }
});
// NEW: Get Actor Input Schema
// NEW: Get Actor Input Schema
// ✅ Get Actor Input Schema
app.post('/api/get-schema', async (req, res) => {
  const { apiKey, actorId } = req.body;

  if (!apiKey || !actorId) {
    return res.status(400).json({ error: 'Missing API key or actor ID' });
  }

  const fallbackSchema = {
    title: "Scrape data from a web page",
    type: "object",
    schemaVersion: 1,
    properties: {
      url: {
        title: "URL of the page",
        type: "string",
        description: "The URL of website you want to get the data from.",
        editor: "textfield",
        prefill: "https://www.apify.com/"
      }
    },
    required: ["url"]
  };

  try {
    const schemaUrl = `https://api.apify.com/v2/acts/${actorId}/input-schema`;
    console.log('Fetching schema from:', schemaUrl);

    const response = await axios.get(schemaUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    res.json({ schema: response.data });
  } catch (error) {
    console.warn('⚠️ Failed to fetch schema from Apify. Using fallback.');
    res.json({ schema: fallbackSchema });
  }
});
// ✅ Run Actor Once
app.post('/api/run-actor', async (req, res) => {
  const { apiKey, actorId, input } = req.body;

  if (!apiKey || !actorId || !input) {
    return res.status(400).json({ error: 'Missing data for actor execution' });
  }

  try {
    const response = await axios.post(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`,
      input,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const runId = response.data.data.id;
    const resultUrl = `https://console.apify.com/run-${runId}`;

    res.json({ message: 'Actor run started!', runUrl: resultUrl });
  } catch (error) {
    console.error('Error running actor:', error.message);
    res.status(500).json({ error: 'Failed to run actor' });
  }
});


// Fetch actors list
app.post('/api/actors', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ message: 'API key is required' });
  }

  try {
    const response = await axios.get('https://api.apify.com/v2/acts', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const actors = response.data.data.items.map(actor => ({
      id: actor.id,
      name: actor.name,
      title: actor.title,
    }));

    return res.json({ actors });
  } catch (error) {
    console.error('Error fetching actors:', error.message);
    return res.status(500).json({ message: 'Failed to fetch actors' });
  }
});
// Get list of user's actors
app.post('/api/list-actors', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ message: 'API key is required' });
  }

  try {
    const response = await axios.get('https://api.apify.com/v2/acts', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const actorList = response.data.data.items.map((actor) => ({
      id: actor.id,
      title: actor.title,
      name: actor.name,
    }));

    res.json({ actors: actorList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch actors' });
  }
});
