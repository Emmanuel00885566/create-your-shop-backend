# Create Your Shop (Multi-Store Web App)
A backend system that allows users to create and manage their own online shops. Each user can sign up, create a shop with a name and logo, add and manage products, and share a unique shop link where customers can browse items, add to cart, and checkout with a “Thank you for shopping” confirmation.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Contributors](#contributors)
- [License](#license)


## Overview
**Create Your Shop (Multi-Store Web App)** is designed as a scalable backend system that empowers users to own independent online stores within a shared platform.  
Each shop operates autonomously — allowing users to:
- Register and authenticate securely using JWT.
- Create and customize their shop details.
- Add, update, and delete products.
- Process and manage customer orders.
- View shop analytics and dashboard stats.

## Features

1. **User Authentication**
   - Secure registration and login using JWT
   - Each user can manage only their own shop

2. **Shop Management**
   - Create and update shops with name, logo, and description
   - Each shop has a unique shareable slug link

3. **Product Management**
   - Add, update, or delete products with image upload
   - Search and filter by category or name

4. **Customer Shopping**
   - Browse products, add/remove from cart
   - Checkout with confirmation message

5. **Order Management**
   - Shop owners can view, update, or track order status

6. **Customer Reviews**
   - Customers can leave feedback on products

7. **Dashboard & Analytics**
   - Total products, orders, revenue, and order breakdown

8. **Email Notifications**
   - Confirmation emails via Nodemailer

9. **Delivery Option (Optional)**
   - Capture delivery address or pickup preference during checkout
| **File Uploads** | Product and shop images handled via Multer. |
| **Security** | Password hashing with bcrypt, protected routes using JWT middleware. |

## Tech Stack
**Backend Framework:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** JWT (JSON Web Token), bcrypt  
**File Uploads:** Multer  
**Environment Management:** dotenv  
**Development Tools:** Nodemon, Postman  
**Architecture:** MVC Pattern (Model–View–Controller)

## Project Architecture
This project follows the **MVC (Model-View-Controller)** pattern with an additional **Service layer** for logic separation.
- **Controllers:** Handle requests, responses, and validation.  
- **Services:** Contain reusable business logic.  
- **Models:** Define MongoDB schemas using Mongoose.  
- **Routes:** Define API endpoints and middlewares.  
- **Middlewares:** Handle authentication, authorization, and error control.
- **Config** – Contains app configuration such as Multer setup and database connection.
This separation ensures cleaner code, easier debugging, and future scalability.


## Project Architecture

The backend follows a modular MVC (Model-View-Controller) pattern:
- **Models** – Define database schemas and relationships using Mongoose.  
- **Controllers** – Contain logic for each route (handling requests, validations, and responses).  
- **Routes** – Map endpoints to corresponding controllers.  
- **Middlewares** – Handle authentication and error management.  
  
## Folder Structure

Create-Your-Shop/
├── config/
│   └── multer.js
|   └── db.js
├── controllers/
│   ├── authController.js
│   ├── ShopController.js
│   ├── productController.js
│   ├── orderController.js
|   ├── reviewController.js
|   ├── CartController.js
│   └── dashboardController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Shop.js
│   ├── Product.js
│   ├── Order.js
|   ├── Review.js
│   └── Cart.js
├── routes/
│   ├── authRoutes.js
│   ├── shopRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
|   ├── CartRoutes.js
|   ├── reviewRoutes.js
│   └── dashboardRoutes.js
├── services/
│ ├── authService.js
│ ├── cartService.js
│ ├── orderService.js
│ ├── productService.js
│ └── shopService.js
├── uploads/ # Stores uploaded product images & shop logos
├── utils/
│ ├── generateToken.js
│ └── mailer.js
│
├── .env
├── package.json
├── package-lock.json
├── server.js
└── README.md

## Installation

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/create-your-shop.git
cd create-your-shop

### Step 2: Install dependencies

npm install


### Step 3: Setup environment variables

Create a `.env` file in the project root and add:

.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/createYourShop
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Create Your Shop

### Step 4: Start the development server

npm run dev

For production:

npm start

The app will run locally on:
`http://localhost:5000`

##  Environment Variables

| Variable     | Description                                      |
| ------------ | ------------------------------------------------ |
| `PORT`       | Port on which the server runs                    |
| `MONGO_URI`  | MongoDB connection string                        |
| `JWT_SECRET` | Secret key for token signing                     |
| `CLOUD_NAME` | (Optional) For image hosting if using Cloudinary |
| `API_KEY`    | (Optional) API key for external integrations     |

## API Endpoints

###  Authentication

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Register a new user                |
| POST   | `/api/auth/login`    | Login existing user              |
| GET    | `/api/auth/profile`  | Get user details (JWT protected) |

### Shop Management

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/create_shop` | Create a new shop   |
| PUT    | `/api/update_shop`         | View all shops      |
| GET    | `/api/shop/:id`         | View single shop    |
| GET   | `/api/:slug`         | Update shop details |

### Product Management

### Product

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| POST   | `/api/product/create_product`    | Add new product    |
| GET    | `/api/product/products`          | Get all products   |
| GET    | `/api/product/product/:product_name` | Get single product |
| PUT    | `/api/product/product/:product_name` | Update product     |
| DELETE | `/api/product/product/:product_name` | Delete product     |


### Orders
| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/api/order/create_order`     | Create a new order         |
| GET    | `/api/order/list_orders`      | Get all orders             |
| GET    | `/api/order/get_order/:id`    | Get a single order by ID   |
| PATCH  | `/api/order/update_order/:id` | Update order status        |
| PATCH  | `/api/order/:id/delivery`     | Update delivery status     |

### Review

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/api/review/:productId`   | Add a review to product |
| GET    | `/api/review/:productId`   | Get product reviews     |


### Cart
| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/api/cart`                       | View user's cart          |
| POST   | `/api/cart/add`                   | Add item to cart          |
| DELETE | `/api/cart/remove/:productId`     | Remove item from cart     |
| POST   | `/api/cart/checkout`              | Checkout (create order)   |


### Dashboard
| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/dashboard/stats` | Get shop statistics  |

## How It Works

1. **User Registration/Login:** Users register with unique credentials and receive a JWT token.
2. **Shop Creation:** Each authenticated user can create their own shop with a name, logo, and description.
3. **Product Management:** Shop owners add and manage products linked to their shop ID.
4. **Customer Interaction:** Customers browse a shop’s products, add to cart, and place orders.
5. **Dashboard Insights:** Shop owners get analytics on sales, revenue, and pending/completed orders.

## 👥 Contributors

| Name                   | Role                          |
| ---------------------- | ----------------------------- |
| **Adeboye Emmanuel**   | Team Lead / Backend Developer |
| **Adediji Faith**      | Backend Developer             |
| **Boboye Esther**      | Backend Developer             |
| **Onuzulike Chijioke** | Backend Developer             |

## License

This project is licensed for academic and educational use.
© 2025 — **TechCrush Backend Team (Create Your Shop)**

## Notes

This project was built following best practices for Express.js applications, including:
* Modular route and controller structure.
* Use of middleware for authentication and file uploads.
* Consistent naming conventions and clean response formats.
* Tested with **Postman** for all CRUD operations.