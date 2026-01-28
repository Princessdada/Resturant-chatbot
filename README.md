# Restaurant Chatbot

A comprehensive, interactive restaurant ordering chatbot built with Node.js, Express, and valid HTML/CSS. This chatbot allows users to browse a menu, place orders, and make payments via Paystack integration.

## Features

- **Interactive Menu**: Browse food items with prices.
- **Order Management**: Add items to cart, view current order, and view order history.
- **Checkout & Payment**: Seamless integration with Paystack for payments.
- **Order Cancellation**: Smart cancellation logic regarding pending vs. paid orders.
- **Persistent Sessions**: Uses MongoDB to store user sessions and order history.
- **Responsive UI**: A clean, mobile-friendly chat interface.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection)
- A [Paystack](https://paystack.com/) Account (for payment testing)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Princessdada/Resturant-chatbot.git
    cd Resturant-chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=8000
    MONGO_URI=mongodb://localhost:27017/restaurant-bot
    SESSION_SECRET=your_secret_key
    PAYSTACK_SECRET_KEY=your_paystack_secret_key
    ```
    *Note: Replace `your_paystack_secret_key` with your actual test/live secret key from Paystack.*

4.  **Seed Data (Optional):**
    The menu is encrypted in `menu.js`. You can modify it there.

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    *Or for development with auto-restart:*
    ```bash
    npm run dev
    ```

2.  **Access the Chatbot:**
    Open your browser and navigate to:
    [http://localhost:8000](http://localhost:8000)

## Usage Guide

- **Select 1**: Place an order (Shows the menu).
- **Select 97**: See current active order/cart.
- **Select 98**: See order history.
- **Select 99**: Checkout (Generates a payment link).
- **Select 0**: Cancel order (Clears cart or cancels pending order).

## Project Structure

- `server.js`: Entry point of the application.
- `services/`: Business logic (Chat logic, Payment service).
- `controllers/`: Request handlers.
- `models/`: Mongoose schemas (Session).
- `routes/`: API routes.
- `frontend/`: Static frontend files (HTML, CSS, JS).
- `config/`: Configuration files (DB, Session).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
