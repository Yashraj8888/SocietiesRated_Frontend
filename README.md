# SocietiesRated Frontend

A modern React application for discovering and reviewing housing societies. Built with React, Redux Toolkit, and TailwindCSS.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Society Discovery**: Browse and search housing societies by location and ratings
- **Reviews & Ratings**: Read and write authentic reviews with star ratings
- **Add Societies**: Contribute by adding new housing societies to the platform
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live updates for ratings and reviews

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SocietyRated_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── Login.js
│   │   └── Register.js
│   ├── common/         # Reusable components
│   │   ├── LoadingSpinner.js
│   │   └── StarRating.js
│   ├── layout/         # Layout components
│   │   └── Navbar.js
│   └── societies/      # Society-related components
│       ├── AddSociety.js
│       ├── SocietyCard.js
│       ├── SocietyDetail.js
│       └── SocietyList.js
├── services/           # API services
│   └── api.js
├── store/              # Redux store
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── reviewsSlice.js
│   │   └── societiesSlice.js
│   └── store.js
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API through:

- **Authentication**: JWT-based auth with automatic token refresh
- **Societies**: CRUD operations for housing societies
- **Reviews**: Add and fetch reviews with ratings
- **Search**: Full-text search across societies

## State Management

Redux Toolkit is used for state management with three main slices:

- **authSlice**: User authentication and profile
- **societiesSlice**: Society data and operations
- **reviewsSlice**: Reviews and ratings

## Styling

TailwindCSS provides utility-first styling with:

- Custom color palette (primary/secondary)
- Responsive design utilities
- Component-specific styles in `index.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |

## License

This project is licensed under the MIT License.
