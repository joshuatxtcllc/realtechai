// routes/propertyAnalysis.js
const express = require(‘express’);
const router = express.Router();
const Ajv = require(‘ajv’);
const addFormats = require(‘ajv-formats’);
const { realEstateSchema } = require(’../config/schema’);
const googlePlacesService = require(’../services/googlePlaces’);
const openaiService = require(’../services/openai’);
const logger = require(’../config/logger’);

// Create AJV validator
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateRealEstateData = ajv.compile(realEstateSchema);

/**

- @route   POST /api/property-analysis
- @desc    Analyze property data and provide insights
- @access  Private
  */
  router.post(’/’, async (req, res, next) => {
  try {
  // Validate incoming data against schema
  const isValid = validateRealEstateData(req.body);
  if (!isValid) {
  logger.warn(‘Invalid property data received’, {
  errors: validateRealEstateData.errors,
  clientIp: req.ip
  });
  return res.status(400).json({
  errors: validateRealEstateData.errors,
  message: ‘Invalid real estate data.’
  });
  }
  
  // Log successful validation
  logger.info(‘Property data validation successful’, {
  propertyId: req.body.property.id,
  clientIp: req.ip
  });
  
  // Extract property address for Google Places lookup
  const { street, city, state, zip } = req.body.property.address;
  const formattedAddress = `${street}, ${city}, ${state} ${zip}`;
  
  // Get neighborhood data from Google Places
  let neighborhoodData;
  try {
  neighborhoodData = await googlePlacesService.getPlaceDetails(formattedAddress);
  logger.info(‘Google Places data retrieved successfully’, {
  propertyId: req.body.property.id
  });
  } catch (err) {
  logger.error(‘Google Places API error’, {
  error: err.message,
  propertyId: req.body.property.id
  });
  neighborhoodData = { error: ‘Failed to fetch neighborhood data’ };
  }
  
  // Calculate investment metrics
  const metrics = calculateInvestmentMetrics(req.body);
  
  // Get AI-powered property analysis
  let aiAnalysis;
  try {
  const promptText = generatePropertyAnalysisPrompt(req.body, neighborhoodData);
  aiAnalysis = await openaiService.getPropertyAnalysis(promptText);
  logger.info(‘AI property analysis generated successfully’, {
  propertyId: req.body.property.id
  });
  } catch (err) {
  logger.error(‘OpenAI API error’, {
  error: err.message,
  propertyId: req.body.property.id
  });
  aiAnalysis = { error: ‘Failed to generate AI analysis’ };
  }
  
  // Return complete analysis
  res.json({
  message: ‘Property analysis complete’,
  property: req.body.property,
  neighborhoodData,
  investmentMetrics: metrics,
  aiAnalysis
  });
  } catch (err) {
  logger.error(‘Property analysis error’, { error: err.message });
  next(err);
  }
  });

/**

- @route   GET /api/property-analysis/:id
- @desc    Get property analysis by ID
- @access  Private
  */
  router.get(’/:id’, async (req, res, next) => {
  try {
  const propertyId = req.params.id;
  
  // In a real implementation, you would fetch from a database
  // This is a placeholder for demonstration
  logger.info(`Fetching property analysis for ID: ${propertyId}`);
  
  // Mock response for demonstration
  res.json({
  message: `Property analysis for ID: ${propertyId}`,
  // Property data would be retrieved from database
  status: ‘success’
  });
  } catch (err) {
  logger.error(`Error fetching property analysis for ID: ${req.params.id}`, {
  error: err.message
  });
  next(err);
  }
  });

/**

- Calculate investment metrics based on property data
- @param {Object} data - Property data object
- @returns {Object} Investment metrics
  */
  function calculateInvestmentMetrics(data) {
  const { purchase_price, arv } = data.property;

// Calculate basic metrics
const potentialProfit = arv - purchase_price;
const roi = (potentialProfit / purchase_price) * 100;

// Calculate additional metrics if financials are provided
let totalInvestment = purchase_price;
let holdingCosts = 0;
let rehabCosts = 0;

if (data.financials) {
// Add closing costs if available
if (data.financials.purchase_costs && data.financials.purchase_costs.closing_costs) {
totalInvestment += data.financials.purchase_costs.closing_costs;
}

```
// Calculate rehab costs
if (data.financials.rehabilitation_costs && data.financials.rehabilitation_costs.total_rehab_budget) {
  rehabCosts = data.financials.rehabilitation_costs.total_rehab_budget;
  totalInvestment += rehabCosts;
}

// Calculate holding costs
if (data.financials.holding_costs) {
  const { 
    monthly_insurance = 0,
    monthly_taxes = 0,
    monthly_utilities = 0,
    monthly_other = 0,
    estimated_holding_period_months = 0
  } = data.financials.holding_costs;
  
  const monthlyCosts = monthly_insurance + monthly_taxes + monthly_utilities + monthly_other;
  holdingCosts = monthlyCosts * estimated_holding_period_months;
  totalInvestment += holdingCosts;
}
```

}

// Calculate adjusted metrics
const adjustedProfit = arv - totalInvestment;
const adjustedRoi = (adjustedProfit / totalInvestment) * 100;

// Calculate 70% rule (common in fix and flip)
const seventyRuleMaxOffer = 0.7 * arv - rehabCosts;

return {
purchase_price,
arv,
potential_profit: potentialProfit,
roi: roi.toFixed(2),
total_investment: totalInvestment,
rehab_costs: rehabCosts,
holding_costs: holdingCosts,
adjusted_profit: adjustedProfit,
adjusted_roi: adjustedRoi.toFixed(2),
seventy_rule_max_offer: seventyRuleMaxOffer
};
}

/**

- Generate a prompt for AI property analysis
- @param {Object} propertyData - Property data
- @param {Object} neighborhoodData - Neighborhood data from Google Places
- @returns {String} Formatted prompt text
  */
  function generatePropertyAnalysisPrompt(propertyData, neighborhoodData) {
  const { property, market_analysis } = propertyData;

return `
Please analyze this real estate investment opportunity:

Property: ${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}
Purchase Price: $${property.purchase_price}
After Repair Value: $${property.arv}
Status: ${property.market_status}
${property.bedrooms ? `Bedrooms: ${property.bedrooms}` : ‘’}
${property.bathrooms ? `Bathrooms: ${property.bathrooms}` : ‘’}
${property.square_footage ? `Square Footage: ${property.square_footage}` : ‘’}
${property.year_built ? `Year Built: ${property.year_built}` : ‘’}

${neighborhoodData && !neighborhoodData.error ? `Neighborhood Information: ${JSON.stringify(neighborhoodData, null, 2)}` : ‘’}

${market_analysis ? `Market Analysis: Average Days on Market: ${market_analysis.average_days_on_market || 'N/A'} Median Sale Price: ${market_analysis.median_sale_price || 'N/A'} Price per SqFt: ${market_analysis.price_per_sqft || 'N/A'} Year over Year Appreciation: ${market_analysis.year_over_year_appreciation || 'N/A'} Rental Demand: ${market_analysis.rental_demand || 'N/A'}` : ‘’}

Please provide:

1. An investment analysis of this property
1. Key risks and opportunities
1. Recommendations for negotiation strategy
1. Potential exit strategies
1. Suggestions for maximizing ROI
   `;
   }

module.exports = router;
