# Bhok Lagyo - Backend

Welcome to the backend of **Bhok Lagyo**, a recipe app built with **Express** and **Node.js**. This app allows users to discover and manage recipes, favorite them, place orders, and make payments via **Stripe**.

## Features

- **Favorite Recipes**: Users can add and remove recipes to/from their favorites list.
- **Search Recipes**: Users can search for recipes based on ingredients or names.
- **Order Recipes**: Users can view and manage their order list.
- **Stripe Payment Integration**: Secure payment processing through Stripe. Once a user pays, the recipe will appear in their order list.
  
## Security Features

- **HTTPS**: All communication is secured using HTTPS to ensure safe data transfer.
- **Cookies**: User session cookies are stored securely with a 30-day expiration.
- **Rate Limiting**: Users can make up to 12 requests per minute, enforced through a rate limiter to prevent abuse.

## Getting Started

### Prerequisites

- **Node.js**: Ensure that Node.js is installed. You can download it from [here](https://nodejs.org/).
- **Stripe Account**: You will need a Stripe account to handle payments. Make sure you have your Stripe API keys ready.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iadityatharu/Recipe-App.git
   cd bhok-lagyo-backend
