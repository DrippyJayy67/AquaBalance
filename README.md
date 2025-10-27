# Aqua Balance Tshwane - React Application

A comprehensive React application for the Aqua Balance Tshwane Car Wash Regulation & Support Portal.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Parallax Effects**: Dynamic parallax background that changes based on scroll position
- **Animated Counters**: Statistics dashboard with animated number counters
- **Interactive Chatbot**: Floating chatbot with modal containing contact information
- **Smooth Scrolling**: Smooth navigation between sections
- **Modern UI**: Clean, professional design with hover effects and animations

## Components

- **Header**: Fixed navigation header with logo and menu
- **Hero**: Main hero section with call-to-action buttons
- **About**: About us section with mission, values, and statistics
- **Dashboard**: Live statistics with animated counters
- **Features**: Key features and services grid
- **Education**: Water conservation tips and education content
- **Community**: Success stories from community members
- **Footer**: Contact information and links
- **ChatBot**: Floating help button with contact modal
- **ParallaxBackground**: Dynamic parallax background effect

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd c:\Users\letsw\Desktop\BroCode\AQBalance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Configuration

This application connects to a backend API for user authentication and data management.

### Development Setup

For local development, the application automatically uses the proxy configuration in `package.json` to connect to the backend API running on `https://localhost:7180`.

### Production Deployment

#### Environment Variables

Set the following environment variable for production deployment:

```bash
REACT_APP_API_URL=https://your-backend-api-url.com/api
```

#### AWS Amplify Deployment

1. **Set Environment Variables**:
   - Go to your Amplify app console
   - Navigate to "App settings" > "Environment variables"
   - Add: `REACT_APP_API_URL` with your backend API URL

2. **CORS Configuration**:
   - Ensure your backend API has CORS configured to allow requests from your Amplify domain
   - Example CORS origins: `https://your-app.amplifyapp.com`

#### Presentation Mode (Localhost Backend)

For presentations where you want to use a hosted frontend with a local backend:

1. **Backend CORS Setup**:
   - Configure your backend API to allow CORS from your hosted domain
   - Add your Amplify URL to the allowed origins

2. **Alternative Options**:
   - Use a CORS proxy service (requires activation)
   - Copy `.env.example` to `.env.production` and configure as needed

#### Troubleshooting CORS Issues

If you encounter CORS errors when using a hosted frontend with localhost backend:

1. Check that your backend API is running on `https://localhost:7180`
2. Ensure SSL certificates are trusted in your browser
3. Configure backend CORS to allow your hosted domain
4. Consider using environment variables for different API endpoints

### Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` folder with optimized files ready for deployment.

## Project Structure

```
src/
├── components/
│   ├── About.js
│   ├── ChatBot.js
│   ├── Community.js
│   ├── Dashboard.js
│   ├── Education.js
│   ├── Features.js
│   ├── Footer.js
│   ├── Header.js
│   ├── Hero.js
│   └── ParallaxBackground.js
├── styles/
│   └── App.css
├── App.js
└── index.js

public/
├── assets/
│   ├── A.png
│   └── tlogo.png
└── index.html
```

## Assets

The application uses the following assets:
- `A.png`: City of Tshwane logo used in the header
- `tlogo.png`: Background logo used for parallax effects

## Styling

The application uses a comprehensive CSS file (`App.css`) that includes:
- Parallax background effects
- Responsive grid layouts
- Smooth animations and transitions
- Modal styling for the chatbot
- Mobile-responsive design

## Technologies Used

- **React 18**: Modern React with hooks
- **CSS3**: Advanced styling with animations and effects
- **Font Awesome**: Icons for better visual appeal
- **Intersection Observer API**: For triggering animations on scroll

## Browser Support

This application supports all modern browsers including:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Optimizations

- Optimized scroll event handling with requestAnimationFrame
- Lazy loading of animations using Intersection Observer
- Efficient component re-rendering with React hooks
- Smooth animations with CSS transforms

## Contributing

This is a government initiative project. For contributions or suggestions, please contact the development team through the official channels.

## License

© 2025 City of Tshwane. All rights reserved.