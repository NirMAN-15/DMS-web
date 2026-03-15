# Distribution Management System (DMS) - Web Admin Panel

This project is a React-based front-end web application (built with Vite) that serves as the Admin Panel for the Distribution Management System.

## Core Features

1. **Authentication (JWT-based)**
   - Secure login system for administrators.
   - Protected routes ensure that only authenticated users can access the system.
   - JWT tokens are stored in `localStorage` and automatically attached to all API requests.

2. **Inventory Management**
   - **View Products**: Fetches and displays a list of all products from the backend.
   - **Add Products**: Allows admins to add new products by specifying a name and price.
   - **Delete Products**: Admins can remove products from the inventory.

3. **Sales Representative Management**
   - **Register Reps**: Allows admins to register new sales representatives by providing their name, email, and password.

## Project Structure & Files

The project is structured within the `src` directory as follows:

- **`main.jsx` & `App.jsx`**: The entry points of the application. `App.jsx` handles the routing using `react-router-dom` and wraps the app in the `AuthProvider`.
- **`index.css`**: Contains the global styles for the application.

### `/pages` (Core Views)
- **`Login.jsx`**: Provides the login form for administrators. Upon successful login (`POST /auth/login`), a JWT token is saved, and the user is redirected to the Inventory dashboard.
- **`Inventory.jsx`**: The main dashboard for inventory control. It interacts with the `/products` API endpoints to display, create, and delete products.
- **`SalesRep.jsx`**: A form to register new sales representatives. It sends a `POST` request to `/auth/register` with the new representative's details.

### `/context` (State Management)
- **`AuthContext.jsx`**: Manages the global authentication state. It provides the `isAuthenticated` flag, the `login(token)` function (which saves the token to local storage), and the `logout()` function (which clears the token).

### `/services` (API Connection)
- **`api.js`**: An Axios instance configured to communicate with the backend API.
  - Base URL is determined by the `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:5000`).
  - Includes a request interceptor that automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests if a token is present in local storage.

## Data Flow & Connections

1. **Backend API Connection**: The frontend assumes a backend running on `http://localhost:5000` (or the URL specified in `VITE_API_BASE_URL`).
2. **API Endpoints Used**:
   - `POST /auth/login`: Authenticates the admin and returns a JWT.
   - `POST /auth/register`: Registers a new sales representative.
   - `GET /products`: Retrieves the inventory list.
   - `POST /products`: Adds a new product `{ name, price }`.
   - `DELETE /products/:id`: Deletes a specific product by ID.
3. **State & Routing**: 
   - `App.jsx` defines `<PrivateRoute>` components that check the `AuthContext`. If `isAuthenticated` is false, users are redirected to `/login`.
   - Once authenticated, users can navigate between the Inventory (`/inventory`) and Sales Representative (`/sales-rep`) pages via the `NavBar`.

## Running the Project

To run this project locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
