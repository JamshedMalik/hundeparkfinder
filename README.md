# HundeparkFinder.de

A comprehensive directory website for dog parks (Hundewiesen) in Germany.

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

## Getting Started

### Prerequisites

- Node.js (v16 or later)
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

## Deployment on Vercel

This project is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel dashboard
3. Configure the project settings (no special configuration needed)
4. Deploy

Alternatively, you can deploy directly from the command line:

```
npm install -g vercel
vercel
```

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

## Data Management

The website uses a CSV file (`public/data/hundewiesen_germany.csv`) as its data source. This file contains information about dog parks across Germany, including:

- Name
- Address
- City and State
- GPS coordinates
- Features (fenced, water access, etc.)
- Ratings and reviews

To update or add new dog parks, edit the CSV file directly and rebuild the website.

## API Routes

The website includes several API routes for accessing data:

- `/api/parks`: Get all dog parks or filter by query, city, or feature
- `/api/parks/[id]`: Get a specific dog park by ID
- `/api/cities`: Get all cities with dog parks
- `/api/cities/[slug]`: Get a specific city by slug
- `/api/features`: Get all available features

## Future Enhancements

Potential future enhancements include:

- User accounts and favorites
- User reviews and ratings
- Photo uploads
- Admin panel for managing dog parks
- Blog section with CMS integration
- Affiliate marketing integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
