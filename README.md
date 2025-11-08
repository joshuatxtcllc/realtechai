# Real Estate API Server

A comprehensive API server for real estate data processing, including property analysis, web scraping, AI chat, and various third-party integrations.

## Features

- **Property Analysis**: Validate and process real estate property data
- **Web Scraping**: Extract data from external websites
- **AI Chat Integration**: Connect with OpenAI’s GPT models
- **Google PageSpeed Integration**: Analyze website performance
- **VAPI Voice Call Integration**: Initiate automated voice calls

## Tech Stack

- Node.js
- Express
- OpenAI API
- Google Places API
- ScraperAPI
- Vapi
- Docker
- Winston (logging)
- Helmet (security)
- Jest (testing)

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:
   
   ```
   git clone https://your-repo-url/real-estate-api.git
   cd real-estate-api
   ```
1. Install dependencies:
   
   ```
   npm install
   ```
1. Create a `.env` file based on the `.env.template`:
   
   ```
   cp .env.template .env
   ```
   
   Then fill in all the required API keys and configuration values.

### Running the Application

#### Development Mode

```
npm run dev
```

#### Production Mode

```
npm start
```

#### With Docker

```
docker-compose up -d
```

## API Endpoints

### Health Check

```
GET /health
```

### Property Analysis

```
POST /api/property-analysis
```

Example request body:

```json
{
  "property": {
    "id": "prop123",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "90210"
    },
    "purchase_price": 250000,
    "arv": 350000,
    "market_status": "under contract"
  },
  "buyer": {
    "id": "buy123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "lead": {
    "source": "website",
    "date_created": "2023-11-15T12:00:00Z"
  },
  "contractor": {
    "id": "cont123",
    "name": "ABC Renovations"
  }
}
```

### Web Scraping

```
GET /api/scrape?url=https://example.com
```

### AI Chat

```
POST /api/chat
```

Example request body:

```json
{
  "prompt": "What are the best neighborhoods for real estate investment in 2023?"
}
```

### Realtool Data

```
GET /api/realtool
```

### Website Performance Analysis

```
GET /api/pagespeed?site=example.com
```

### VAPI Voice Call

```
POST /api/vapi-call
```

Example request body:

```json
{
  "phoneNumber": "+1234567890",
  "message": "Hello, we have a new property listing that matches your criteria."
}
```

## Testing

Run tests:

```
npm test
```

## Deployment

See the included Deployment Guide for detailed instructions on deploying to various platforms.

## Security

This application uses Helmet for setting secure HTTP headers and includes rate limiting to prevent abuse.

## License

[Your License]

## Contact

[Your Contact Information]
