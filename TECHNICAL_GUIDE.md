# HundeparkFinder.de - Technical Implementation Guide

## Development Environment Setup

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git (for version control)

### Initial Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/hundeparkfinder.git
cd hundeparkfinder
```

2. Install dependencies:
```bash
npm install
```

3. Create necessary environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here  # Optional if using Mapbox instead of OpenStreetMap
NEXT_PUBLIC_SITE_URL=https://hundeparkfinder.de
```

## Development Workflow

### Running the Development Server
```bash
npm run dev
```
This will start the development server at http://localhost:3000.

### Building for Production
```bash
npm run build
```

### Running Production Build Locally
```bash
npm start
```

## Project Structure Details

### Core Directories and Files

#### `/src/app`
Contains all the pages and API routes using Next.js App Router.

- `/page.tsx` - Homepage
- `/suche/page.tsx` - Search results page
- `/park/[slug]/page.tsx` - Individual park detail page
- `/stadt/[slug]/page.tsx` - City-specific page
- `/merkmal/[slug]/page.tsx` - Feature-specific page
- `/layout.tsx` - Root layout with header and footer

#### `/src/components`
Reusable React components:

- `SearchBar.tsx` - Search input component
- `ParkCard.tsx` - Card component for displaying park information
- `MapComponent.tsx` - Leaflet map integration
- `FeaturedCities.tsx` - Grid of featured cities

#### `/src/lib`
Utility functions and TypeScript types:

- `data.ts` - Functions for data retrieval and manipulation
- `types.ts` - TypeScript interfaces for the application

#### `/public/data`
Data files:

- `hundewiesen_germany.csv` - CSV file containing dog park data

## Data Management

### Data Structure
The dog park data is stored in a CSV file with the following structure:

```
id,name,address,postal_code,city,state,latitude,longitude,google_maps_url,phone,opening_hours,website,description,is_fenced,has_water,has_agility,has_seating,has_waste_bins,has_lighting,has_parking,photos,rating,reviews,size,last_updated,data_source
```

### Adding New Data
To add new dog parks:

1. Edit the CSV file directly or create a new one with the same structure
2. Place the file in the `/public/data` directory
3. Update the data loading functions in `/src/lib/data.ts` if necessary

### Data Processing
The application processes the CSV data using the `csv-parse` library. The main functions for data handling are:

- `getDogParks()` - Reads and parses the CSV file
- `getCities()` - Extracts unique cities from the park data
- `getFeatures()` - Returns available features for filtering
- `getParksByFeature()` - Filters parks by a specific feature
- `searchParks()` - Searches parks based on query string

## Component Implementation Details

### MapComponent
The map implementation uses Leaflet with React-Leaflet for integration. Key features:

- Displays markers for all dog parks
- Centers on specified coordinates
- Allows zooming and panning
- Shows popups with basic information on marker click

```typescript
// Example usage
<MapComponent 
  parks={parks} 
  center={[51.1657, 10.4515]} 
  zoom={6} 
/>
```

### SearchBar
Client-side search component that redirects to the search page with query parameters:

```typescript
// Example usage
<SearchBar />
```

### ParkCard
Displays a summary of a dog park with key information:

```typescript
// Example usage
<ParkCard park={parkObject} />
```

## API Routes

### `/api/parks`
- **GET**: Returns all parks or filtered results
- Query parameters:
  - `query`: Search term
  - `city`: City slug
  - `feature`: Feature slug

### `/api/parks/[id]`
- **GET**: Returns a specific park by ID

### `/api/cities`
- **GET**: Returns all cities with dog parks

### `/api/cities/[slug]`
- **GET**: Returns a specific city by slug

### `/api/features`
- **GET**: Returns all available features

## Multilingual Implementation

The website is designed to support both German and English languages. The current implementation includes:

- Language toggle in the header
- URL structure for language variants
- Preparation for full i18n integration

To fully implement internationalization:

1. Install and configure `next-i18next`
2. Create translation files in `/public/locales/`
3. Wrap components with translation HOCs
4. Implement language detection and routing

## SEO Implementation

### Meta Tags
Each page should include proper meta tags:

```tsx
export const metadata = {
  title: 'Page Title | HundeparkFinder.de',
  description: 'Page description optimized for search engines',
  openGraph: {
    title: 'Page Title | HundeparkFinder.de',
    description: 'Page description optimized for social sharing',
    images: ['/images/og-image.jpg'],
  },
};
```

### Structured Data
Implement JSON-LD structured data for dog parks:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Park',
      'name': park.name,
      // Additional structured data
    })
  }}
/>
```

## Performance Optimization

### Image Optimization
Use Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image';

<Image
  src="/images/park.jpg"
  alt="Park description"
  width={300}
  height={200}
  priority={false}
/>
```

### Code Splitting
Next.js handles code splitting automatically, but consider:

- Using dynamic imports for large components
- Lazy loading components below the fold

```tsx
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/MapComponent'), {
  loading: () => <p>Loading map...</p>,
  ssr: false
});
```

### Caching Strategy
Implement caching headers for static assets and API responses:

```tsx
export async function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  });
}
```

## Deployment

### Vercel Deployment
The recommended deployment platform is Vercel:

1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Set environment variables
4. Deploy

### Alternative Deployment Options

#### Static Export
For static hosting platforms:

```bash
npm run build
npm run export
```

This generates a static version in the `out` directory.

#### Docker Deployment
A Dockerfile is provided for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run the container:

```bash
docker build -t hundeparkfinder .
docker run -p 3000:3000 hundeparkfinder
```

## Testing

### Unit Testing
Use Jest for unit testing:

```bash
npm test
```

### End-to-End Testing
Use Cypress for E2E testing:

```bash
npm run cypress
```

## Maintenance and Updates

### Adding New Features
1. Create new components in `/src/components`
2. Add new pages in `/src/app`
3. Update API routes if necessary
4. Update documentation

### Updating Dog Park Data
1. Update the CSV file with new data
2. Rebuild and redeploy the application

### Monitoring
Set up monitoring using:
- Vercel Analytics
- Google Analytics
- Error tracking (Sentry)

## Troubleshooting Common Issues

### Map Not Displaying
- Check if Leaflet CSS is properly imported
- Verify that coordinates are valid numbers
- Ensure the map container has a defined height

### Data Not Loading
- Check the CSV file format and path
- Verify the data parsing functions
- Check for console errors

### Build Errors
- Clear the `.next` directory and rebuild
- Update dependencies
- Check for TypeScript errors

## Security Considerations

### API Rate Limiting
Implement rate limiting for API routes:

```tsx
// Example with a simple rate limiter
let lastRequestTime = 0;
const RATE_LIMIT_WINDOW = 1000; // 1 second

export async function GET(request: Request) {
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_WINDOW) {
    return new Response('Too Many Requests', { status: 429 });
  }
  lastRequestTime = now;
  
  // Process request
}
```

### Input Validation
Always validate user input:

```tsx
function validateSearchQuery(query: string) {
  return query.trim().slice(0, 100); // Limit length and trim
}
```

### Content Security Policy
Implement a Content Security Policy in the `next.config.js`:

```js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.tile.openstreetmap.org;
  font-src 'self';
  connect-src 'self';
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};
```

## Future Development Roadmap

### Phase 1: Core Enhancements
- User accounts and authentication
- Favorites and saved parks
- User reviews and ratings

### Phase 2: Advanced Features
- Geolocation for "near me" functionality
- Advanced filtering options
- Photo uploads for parks

### Phase 3: Monetization
- Affiliate marketing integration
- Premium listings for businesses
- Sponsored content

### Phase 4: Community Features
- User forums
- Event calendar for dog meetups
- Social sharing integration
