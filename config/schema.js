// config/schema.js
const realEstateSchema = {
$schema: ‘http://json-schema.org/draft-07/schema#’,
title: ‘Real Estate Schema’,
type: ‘object’,
properties: {
property: {
type: ‘object’,
properties: {
id: { type: ‘string’ },
address: {
type: ‘object’,
properties: {
street: { type: ‘string’ },
city: { type: ‘string’ },
state: { type: ‘string’ },
zip: { type: ‘string’ }
},
required: [‘street’, ‘city’, ‘state’, ‘zip’]
},
purchase_price: { type: ‘number’ },
arv: { type: ‘number’ },
market_status: {
type: ‘string’,
enum: [‘lead’, ‘under contract’, ‘pending’, ‘sold’, ‘archived’]
},
property_type: {
type: ‘string’,
enum: [‘single_family’, ‘multi_family’, ‘commercial’, ‘land’, ‘other’]
},
bedrooms: { type: ‘number’ },
bathrooms: { type: ‘number’ },
square_footage: { type: ‘number’ },
year_built: { type: ‘number’ },
lot_size: { type: ‘number’ },
renovation_budget: { type: ‘number’ },
estimated_rehab_time_days: { type: ‘number’ },
comparable_properties: {
type: ‘array’,
items: {
type: ‘object’,
properties: {
address: { type: ‘string’ },
sale_price: { type: ‘number’ },
sale_date: { type: ‘string’, format: ‘date’ },
bedrooms: { type: ‘number’ },
bathrooms: { type: ‘number’ },
square_footage: { type: ‘number’ },
distance_miles: { type: ‘number’ }
},
required: [‘address’, ‘sale_price’]
}
}
},
required: [‘id’, ‘address’, ‘purchase_price’, ‘arv’, ‘market_status’]
},
buyer: {
type: ‘object’,
properties: {
id: { type: ‘string’ },
name: { type: ‘string’ },
email: { type: ‘string’, format: ‘email’ },
phone: { type: ‘string’ },
investment_criteria: {
type: ‘object’,
properties: {
property_types: {
type: ‘array’,
items: {
type: ‘string’,
enum: [‘single_family’, ‘multi_family’, ‘commercial’, ‘land’, ‘other’]
}
},
min_beds: { type: ‘number’ },
min_baths: { type: ‘number’ },
min_square_footage: { type: ‘number’ },
preferred_locations: {
type: ‘array’,
items: { type: ‘string’ }
},
max_budget: { type: ‘number’ },
min_cap_rate: { type: ‘number’ },
cash_buyer: { type: ‘boolean’ }
}
},
past_purchases: {
type: ‘array’,
items: {
type: ‘object’,
properties: {
property_id: { type: ‘string’ },
purchase_date: { type: ‘string’, format: ‘date’ }
},
required: [‘property_id’]
}
}
},
required: [‘id’, ‘name’, ‘email’]
},
lead: {
type: ‘object’,
properties: {
source: { type: ‘string’ },
date_created: { type: ‘string’, format: ‘date-time’ },
status: { type: ‘string’ },
followup_date: { type: ‘string’, format: ‘date’ },
notes: { type: ‘string’ },
initial_contact_method: {
type: ‘string’,
enum: [‘phone’, ‘email’, ‘website’, ‘social_media’, ‘referral’, ‘other’]
},
lead_score: {
type: ‘number’,
minimum: 0,
maximum: 100
},
lead_owner: { type: ‘string’ },
last_activity_date: { type: ‘string’, format: ‘date-time’ },
conversion_probability: {
type: ‘number’,
minimum: 0,
maximum: 100
}
},
required: [‘source’, ‘date_created’]
},
contractor: {
type: ‘object’,
properties: {
id: { type: ‘string’ },
name: { type: ‘string’ },
company_name: { type: ‘string’ },
email: { type: ‘string’, format: ‘email’ },
phone: { type: ‘string’ },
license_number: { type: ‘string’ },
insurance_verified: { type: ‘boolean’ },
specialties: {
type: ‘array’,
items: { type: ‘string’ }
},
hourly_rate: { type: ‘number’ },
project_history: {
type: ‘array’,
items: {
type: ‘object’,
properties: {
property_id: { type: ‘string’ },
start_date: { type: ‘string’, format: ‘date’ },
end_date: { type: ‘string’, format: ‘date’ },
project_cost: { type: ‘number’ },
rating: {
type: ‘number’,
minimum: 1,
maximum: 5
}
},
required: [‘property_id’]
}
}
},
required: [‘id’, ‘name’]
},
financials: {
type: ‘object’,
properties: {
purchase_costs: {
type: ‘object’,
properties: {
purchase_price: { type: ‘number’ },
closing_costs: { type: ‘number’ },
inspection_costs: { type: ‘number’ },
other_acquisition_costs: { type: ‘number’ }
},
required: [‘purchase_price’]
},
rehabilitation_costs: {
type: ‘object’,
properties: {
total_rehab_budget: { type: ‘number’ },
contingency_percentage: { type: ‘number’ },
labor_costs: { type: ‘number’ },
material_costs: { type: ‘number’ },
contractor_profit: { type: ‘number’ },
permits_and_fees: { type: ‘number’ }
},
required: [‘total_rehab_budget’]
},
holding_costs: {
type: ‘object’,
properties: {
monthly_insurance: { type: ‘number’ },
monthly_taxes: { type: ‘number’ },
monthly_utilities: { type: ‘number’ },
monthly_other: { type: ‘number’ },
estimated_holding_period_months: { type: ‘number’ }
}
},
exit_costs: {
type: ‘object’,
properties: {
selling_agent_commission_percentage: { type: ‘number’ },
buying_agent_commission_percentage: { type: ‘number’ },
estimated_closing_costs: { type: ‘number’ },
transfer_taxes: { type: ‘number’ }
}
},
financing: {
type: ‘object’,
properties: {
loan_amount: { type: ‘number’ },
interest_rate: { type: ‘number’ },
term_months: { type: ‘number’ },
loan_points: { type: ‘number’ },
other_financing_costs: { type: ‘number’ }
}
}
}
},
market_analysis: {
type: ‘object’,
properties: {
average_days_on_market: { type: ‘number’ },
median_sale_price: { type: ‘number’ },
price_per_sqft: { type: ‘number’ },
year_over_year_appreciation: { type: ‘number’ },
rental_demand: {
type: ‘string’,
enum: [‘very_low’, ‘low’, ‘moderate’, ‘high’, ‘very_high’]
},
occupancy_rate: { type: ‘number’ },
price_to_rent_ratio: { type: ‘number’ }
}
}
},
required: [‘property’, ‘buyer’, ‘lead’, ‘contractor’]
};

module.exports = { realEstateSchema };
