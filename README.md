# Wanderlust - Travel Stay Booking Platform

## Overview
Wanderlust is a web application that allows users to browse, book, and list travel accommodations. Built with Node.js, Express, and MongoDB, it provides a platform similar to Airbnb where users can find unique stays and experiences.

## Features
- User authentication and authorization
- Property listing creation and management
- Review and rating system
- Search and filter accommodations
- Secure payment processing
- Responsive design for all devices
- Flash messages for user feedback
- Session management with MongoDB store

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap
- **Authentication**: Passport.js
- **Session Management**: express-session with connect-mongo
- **Other Tools**:
  - method-override for RESTful routes
  - morgan for logging
  - connect-flash for flash messages
  - ejs-mate for layouts

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sujal862/Wanderlust.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Wanderlust
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables in a `.env` file. You may need to include:
   ```
   Cloudinary API Key, MapBox Token . . .
   ```
5. Start the application:
   ```bash
   node app.js
   ```

## Usage
- Visit `http://localhost:8080` to access the application.
- Users can sign up, log in, and start listing or booking properties.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.
