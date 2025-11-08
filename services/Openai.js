// services/openai.js
const { Configuration, OpenAIApi } = require(‘openai’);
const logger = require(’../config/logger’);

// Initialize OpenAI configuration
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**

- Get property analysis from OpenAI
- @param {string} prompt - The prompt text for the AI
- @returns {Promise<Object>} The AI analysis
  */
  async function getPropertyAnalysis(prompt) {
  try {
  const response = await openai.createCompletion({
  model: ‘text-davinci-003’,
  prompt,
  max_tokens: 1000,
  temperature: 0.7,
  });
  
  return {
  analysis: response.data.choices[0].text.trim(),
  model: ‘text-davinci-003’,
  tokens: response.data.usage.total_tokens
  };
  } catch (error) {
  logger.error(‘OpenAI API error’, { error: error.message });
  throw new Error(`OpenAI API error: ${error.message}`);
  }
  }

/**

- Generate property description using GPT
- @param {Object} propertyData - Property data
- @returns {Promise<string>} Generated property description
  */
  async function generatePropertyDescription(propertyData) {
  const { address, bedrooms, bathrooms, square_footage, year_built, property_type } = propertyData;

const prompt = `
Write a compelling real estate listing description for the following property:

Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}
${bedrooms ? `Bedrooms: ${bedrooms}` : ‘’}
${bathrooms ? `Bathrooms: ${bathrooms}` : ‘’}
${square_footage ? `Square Footage: ${square_footage}` : ‘’}
${year_built ? `Year Built: ${year_built}` : ‘’}
${property_type ? `Property Type: ${property_type}` : ‘’}

Write in a professional, engaging style that highlights the property’s features and selling points.
`;

try {
const response = await openai.createCompletion({
model: ‘text-davinci-003’,
prompt,
max_tokens: 500,
temperature: 0.7,
});

```
return response.data.choices[0].text.trim();
```

} catch (error) {
logger.error(‘Error generating property description’, { error: error.message });
throw new Error(`Failed to generate property description: ${error.message}`);
}
}

/**

- Process chat messages with OpenAI
- @param {string} userPrompt - User message
- @returns {Promise<string>} AI response
  */
  async function processChatMessage(userPrompt) {
  try {
  const response = await openai.createCompletion({
  model: ‘text-davinci-003’,
  prompt: `Real estate professional assistant: ${userPrompt}`,
  max_tokens: 500,
  temperature: 0.7,
  });
  
  return response.data.choices[0].text.trim();
  } catch (error) {
  logger.error(‘Error processing chat message’, { error: error.message });
  throw new Error(`Failed to process chat message: ${error.message}`);
  }
  }

module.exports = {
getPropertyAnalysis,
generatePropertyDescription,
processChatMessage
};

// services/googlePlaces.js
const axios = require(‘axios’);
const logger = require(’../config/logger’);

/**

- Get place details from Google Places API
- @param {string} address - The property address
- @returns {Promise<Object>} Place details
  */
  async function getPlaceDetails(address) {
  try {
  // First, geocode the address to get place_id
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  
  const geocodeResponse = await axios.get(geocodeUrl);
  
  if (geocodeResponse.data.status !== ‘OK’ || !geocodeResponse.data.results.length) {
  logger.warn(‘Geocoding failed’, { address, status: geocodeResponse.data.status });
  throw new Error(`Geocoding failed: ${geocodeResponse.data.status}`);
  }
  
  const location = geocodeResponse.data.results[0].geometry.location;
  const placeId = geocodeResponse.data.results[0].place_id;
  
  // Then, get place details
  const placesUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress,types,location,rating,userRatingCount,priceLevel,nationalPhoneNumber,websiteUri,regularOpeningHours,businessStatus,primaryType,reviews,photos,addressComponents,viewport&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  
  const placesResponse = await axios.get(placesUrl);
  
  // Get neighborhood data
  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=neighborhood&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  
  const nearbyResponse = await axios.get(nearbyUrl);
  
  const neighborhoods = nearbyResponse.data.results.map(place => ({
  name: place.name,
  vicinity: place.vicinity,
  types: place.types
  }));
  
  // Get nearby points of interest
  const poiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=school|store|restaurant|park|transit_station&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  
  const poiResponse = await axios.get(poiUrl);
  
  const pointsOfInterest = poiResponse.data.results.slice(0, 10).map(place => ({
  name: place.name,
  type: place.types[0],
  vicinity: place.vicinity,
  rating: place.rating
  }));
  
  return {
  address: placesResponse.data.formattedAddress || address,
  location: placesResponse.data.location || location,
  placeId,
  neighborhoods,
  pointsOfInterest
  };
  } catch (error) {
  logger.error(‘Google Places API error’, { error: error.message, address });
  throw new Error(`Google Places API error: ${error.message}`);
  }
  }

/**

- Get real estate market data for a location
- @param {string} location - City and state (e.g., “Austin, TX”)
- @returns {Promise<Object>} Market data
  */
  async function getLocationMarketData(location) {
  try {
  // For demonstration - in a real implementation, this would call
  // a specialized real estate data API or additional Google APIs
  
  // Mock response
  const marketData = {
  location,
  median_home_price: 350000,
  price_per_sqft: 185,
  days_on_market: 32,
  price_trends: {
  one_year: 5.2,
  five_year: 18.7
  },
  rent_trends: {
  one_bedroom: 1200,
  two_bedroom: 1500
  }
  };
  
  return marketData;
  } catch (error) {
  logger.error(‘Error getting market data’, { error: error.message, location });
  throw new Error(`Failed to get market data: ${error.message}`);
  }
  }

module.exports = {
getPlaceDetails,
getLocationMarketData
};

// services/scraperApi.js
const axios = require(‘axios’);
const logger = require(’../config/logger’);

/**

- Scrape website content using ScraperAPI
- @param {string} url - Target URL to scrape
- @returns {Promise<Object>} Scraped data
  */
  async function scrapeWebsite(url) {
  try {
  const apiKey = process.env.SCRAPER_API_KEY;
  const scraperUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
  
  logger.info(`Scraping website: ${url}`);
  const response = await axios.get(scraperUrl);
  
  return {
  url,
  statusCode: response.status,
  data: response.data
  };
  } catch (error) {
  logger.error(‘ScraperAPI error’, { error: error.message, url });
  throw new Error(`ScraperAPI error: ${error.message}`);
  }
  }

/**

- Extract property data from HTML
- @param {string} html - Raw HTML content
- @returns {Object} Extracted property data
  */
  function extractPropertyData(html) {
  // In a real implementation, you would use a library like Cheerio
  // to parse the HTML and extract structured data
  // This is a simplified example

return {
// Extracted data would go here
message: ‘Property data extraction not implemented’
};
}

/**

- Scrape real estate listings
- @param {string} location - Location to search (e.g., “Austin, TX”)
- @returns {Promise<Array>} List of properties
  */
  async function scrapeListings(location) {
  try {
  // This would be implemented with specific target sites
  // For now, just returning a mock response
  
  return [
  {
  address: ‘123 Main St’,
  price: 350000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  url: ‘https://example.com/property1’
  },
  {
  address: ‘456 Oak Ave’,
  price: 425000,
  bedrooms: 4,
  bathrooms: 2.5,
  sqft: 2200,
  url: ‘https://example.com/property2’
  }
  ];
  } catch (error) {
  logger.error(‘Error scraping listings’, { error: error.message, location });
  throw new Error(`Failed to scrape listings: ${error.message}`);
  }
  }

module.exports = {
scrapeWebsite,
extractPropertyData,
scrapeListings
};

// services/vapi.js
const axios = require(‘axios’);
const logger = require(’../config/logger’);

/**

- Initiate a voice call using Vapi
- @param {string} phoneNumber - Target phone number
- @param {string} message - Optional initial message
- @returns {Promise<Object>} Call response
  */
  async function initiateCall(phoneNumber, message = ‘’) {
  try {
  logger.info(`Initiating Vapi call to: ${phoneNumber}`);
  
  // In a real implementation, this would call the Vapi API
  // This is a placeholder
  
  const vapiToken = process.env.VAPI_PUBLIC_TOKEN;
  const assistantId = process.env.VAPI_ASSISTANT_ID;
  
  /*
  const response = await axios.post(
  ‘https://api.vapi.ai/call’,
  {
  phone_number: phoneNumber,
  assistant_id: assistantId,
  message: message || ‘Hello from the Real Estate API’,
  },
  {
  headers: {
  Authorization: `Bearer ${vapiToken}`,
  ‘Content-Type’: ‘application/json’
  }
  }
  );
  
  return {
  callId: response.data.call_id,
  status: response.data.status,
  phoneNumber
  };
  */
  
  // For demonstration purposes:
  return {
  callId: ‘vapi-demo-call-123’,
  status: ‘initiated’,
  phoneNumber,
  message: message || ‘Hello from the Real Estate API’
  };
  } catch (error) {
  logger.error(‘Vapi API error’, { error: error.message, phoneNumber });
  throw new Error(`Vapi API error: ${error.message}`);
  }
  }

/**

- Check status of a voice call
- @param {string} callId - Vapi call ID
- @returns {Promise<Object>} Call status
  */
  async function checkCallStatus(callId) {
  try {
  logger.info(`Checking Vapi call status for: ${callId}`);
  
  // In a real implementation, this would call the Vapi API
  // This is a placeholder
