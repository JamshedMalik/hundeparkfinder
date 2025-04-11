import { getDogParks, getCities, getFeatures } from '@/lib/data';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ParkCard from '@/components/ParkCard';
import MapComponent from '@/components/MapComponent';
import FeaturedCities from '@/components/FeaturedCities';

export default function Home() {
  const parks = getDogParks();
  const cities = getCities();
  const features = getFeatures();
  
  // Get featured parks (top rated)
  const featuredParks = [...parks]
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 4);
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hundewiesen und Hundeparks in Deutschland
            </h1>
            <p className="text-xl mb-8">
              Finde die besten Hundewiesen, Hundespielplätze und Hundeparks in deiner Nähe
            </p>
            
            {/* Search Bar */}
            <SearchBar />
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link 
                href="/merkmal/eingezaeunt" 
                className="bg-white text-green-800 px-4 py-2 rounded-full font-medium hover:bg-green-100 transition"
              >
                Eingezäunte Hundewiesen
              </Link>
              <Link 
                href="/merkmal/indoor" 
                className="bg-white text-green-800 px-4 py-2 rounded-full font-medium hover:bg-green-100 transition"
              >
                Indoor Hundespielplätze
              </Link>
              <Link 
                href="/suche" 
                className="bg-white text-green-800 px-4 py-2 rounded-full font-medium hover:bg-green-100 transition"
              >
                Alle Hundeparks
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Parks Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Beliebte Hundeparks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/suche" 
              className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition"
            >
              Alle Hundeparks anzeigen
            </Link>
          </div>
        </div>
      </section>
      
      {/* Map Overview Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Hundeparks in Deutschland</h2>
          
          <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
            <MapComponent parks={parks} />
          </div>
        </div>
      </section>
      
      {/* Cities Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Hundeparks nach Städten</h2>
          
          <FeaturedCities cities={cities} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Finde Hundeparks nach Merkmalen</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(feature => (
              <Link 
                key={feature.id}
                href={`/merkmal/${feature.slug}`}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                <div className="text-3xl mb-2">
                  {feature.icon === 'fence' && '🔒'}
                  {feature.icon === 'water' && '💧'}
                  {feature.icon === 'agility' && '🏃‍♂️'}
                  {feature.icon === 'indoor' && '🏠'}
                  {feature.icon === 'bench' && '🪑'}
                  {feature.icon === 'trash' && '🗑️'}
                  {feature.icon === 'light' && '💡'}
                  {feature.icon === 'parking' && '🅿️'}
                </div>
                <h3 className="font-medium">{feature.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-12 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Über HundeparkFinder.de</h2>
            <p className="text-lg mb-6">
              HundeparkFinder.de ist die umfassendste Datenbank für Hundewiesen, Hundespielplätze und Hundeparks in Deutschland. 
              Wir helfen dir dabei, den perfekten Ort für deinen Vierbeiner zu finden.
            </p>
            <Link 
              href="/ueber-uns" 
              className="inline-block bg-white text-green-800 px-6 py-3 rounded-lg font-medium hover:bg-green-100 transition"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
