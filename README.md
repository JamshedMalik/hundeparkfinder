# HundeparkFinder.de - Documentation

## Project Overview

HundeparkFinder.de is a comprehensive directory website for dog parks (Hundewiesen) in Germany. The website allows users to search for dog parks by location, features, and keywords, view detailed information about each park, and explore parks on an interactive map.

## Features

- **Responsive Design**: Fully responsive website that works on desktop, tablet, and mobile devices
- **Search Functionality**: Search for dog parks by name, city, or postal code
- **Interactive Map**: View dog parks on an interactive map with markers and popups
- **Filtering**: Filter dog parks by features (fenced, water access, agility equipment, etc.)
- **City Pages**: Dedicated pages for major German cities showing local dog parks
- **Feature Pages**: Pages showcasing parks with specific features (e.g., fenced parks, indoor parks)
- **Detailed Park Pages**: Comprehensive information about each dog park
- **Multilingual Support**: Toggle between German (default) and English
- **SEO Optimized**: Structured for search engine visibility with proper metadata

## Tech Stack

- **Frontend Framework**: Next.js with App Router
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and customizable styling
- **Leaflet**: For interactive maps
- **CSV Parser**: For reading dog park data

## Project Structure

```
hundeparkfinder/
├── public/
│   ├── data/
│   │   └── hundewiesen_germany.csv  # Dog park data
│   └── images/                      # Images and assets
├── src/
│   ├── app/
│   │   ├── api/                     # API routes
│   │   │   ├── parks/
│   │   │   ├── cities/
│   │   │   └── features/
│   │   ├── park/[slug]/             # Park detail pages
│   │   ├── stadt/[slug]/            # City pages
│   │   ├── merkmal/[slug]/          # Feature pages
│   │   ├── suche/                   # Search page
│   │   ├── layout.tsx               # Main layout with header and footer
│   │   └── page.tsx                 # Homepage
│   ├── components/                  # Reusable components
│   │   ├── FeaturedCities.tsx
│   │   ├── MapComponent.tsx
│   │   ├── ParkCard.tsx
│   │   └── SearchBar.tsx
│   └── lib/                         # Utility functions and types
│       ├── data.ts                  # Data handling functions
│       └── types.ts                 # TypeScript interfaces
└── package.json                     # Dependencies and scripts
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hundeparkfinder.git
   cd hundeparkfinder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Building for Production

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Data Management

The website uses a CSV file (`public/data/hundewiesen_germany.csv`) as its data source. This file contains information about dog parks across Germany, including:

- Name
- Address
- City and State
- GPS coordinates
- Features (fenced, water access, etc.)
- Ratings and reviews
- And more

To update or add new dog parks:

1. Edit the CSV file directly or use the admin panel (when implemented)
2. Ensure all required fields are filled
3. Rebuild the website to reflect the changes

## API Routes

The website includes several API routes for accessing data:

- `/api/parks`: Get all dog parks or filter by query, city, or feature
- `/api/parks/[id]`: Get a specific dog park by ID
- `/api/cities`: Get all cities with dog parks
- `/api/cities/[slug]`: Get a specific city by slug
- `/api/features`: Get all features

## Multilingual Support

The website currently supports German (default) and English. The language toggle in the header allows users to switch between languages.

## SEO Implementation

The website is optimized for search engines with:

- Semantic HTML structure
- Proper metadata (title, description)
- Structured data for dog parks
- SEO-friendly URLs
- Optimized content based on keyword research

## Future Enhancements

Potential future enhancements include:

- User accounts and favorites
- User reviews and ratings
- Photo uploads
- Admin panel for managing dog parks
- Blog section with CMS integration
- Affiliate marketing integration

## Troubleshooting

### Common Issues

- **Maps not loading**: Ensure Leaflet CSS is properly imported
- **Data not appearing**: Check that the CSV file is correctly formatted and accessible
- **Build errors**: Verify all dependencies are installed and compatible

### Support

For support or questions, please contact:
- Email: support@hundeparkfinder.de
- GitHub: [github.com/yourusername/hundeparkfinder](https://github.com/yourusername/hundeparkfinder)
