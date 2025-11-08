{
“name”: “real-estate-api-server”,
“version”: “1.0.0”,
“description”: “API server for real estate data processing”,
“main”: “app.js”,
“scripts”: {
“start”: “node app.js”,
“dev”: “nodemon app.js”,
“test”: “jest”,
“lint”: “eslint .”,
“build”: “echo "No build step required for backend" && exit 0”
},
“engines”: {
“node”: “>=14.0.0”
},
“dependencies”: {
“ajv”: “^8.12.0”,
“ajv-formats”: “^2.1.1”,
“axios”: “^1.6.2”,
“dotenv”: “^16.3.1”,
“express”: “^4.18.2”,
“express-rate-limit”: “^7.1.4”,
“helmet”: “^7.1.0”,
“openai”: “^3.3.0”,
“winston”: “^3.11.0”
},
“devDependencies”: {
“eslint”: “^8.54.0”,
“jest”: “^29.7.0”,
“nodemon”: “^3.0.1”,
“supertest”: “^6.3.3”
}
}
