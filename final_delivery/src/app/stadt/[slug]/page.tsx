import { getCityBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ParkCard from '@/components/ParkCard';
import MapComponent from '@/components/MapComponent';

export default function CityPage({
  params,
}: {
  params: { slug: string };
}) {
  const city = getCityBySlug(params.slug);
  
  if (!city) {
    notFound();
  }
  
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/" className="text-green-700 hover:underline">
            ← Zurück zur Startseite
          </Link>
        </div>
        
        {/* City Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Hundeparks in {city.name}</h1>
            <p className="text-xl">{city.parks.length} Hundeparks gefunden</p>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Entdecke die besten Hundewiesen, Hundespielplätze und Hundeparks in {city.name}. 
              Hier findest du alle Informationen zu Öffnungszeiten, Ausstattung und Bewertungen.
            </p>
            
            {/* Map */}
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md mb-6">
              <MapComponent 
                parks={city.parks} 
                center={
                  city.parks[0]?.latitude && city.parks[0]?.longitude
                    ? [parseFloat(city.parks[0].latitude), parseFloat(city.parks[0].longitude)]
                    : undefined
                }
                zoom={12} 
              />
            </div>
          </div>
        </div>
        
        {/* Parks Grid */}
        <h2 className="text-2xl font-bold mb-6">Alle Hundeparks in {city.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {city.parks.map(park => (
            <ParkCard key={park.id} park={park} />
          ))}
        </div>
        
        {/* SEO Content */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Hundewiesen in {city.name}</h2>
          <p className="text-gray-700 mb-4">
            {city.name} bietet zahlreiche Möglichkeiten für Hundebesitzer, ihre Vierbeiner austoben zu lassen. 
            Von eingezäunten Hundewiesen bis hin zu weitläufigen Freilaufflächen ist für jeden Hund etwas dabei.
          </p>
          <p className="text-gray-700 mb-4">
            Besonders beliebt sind die {city.parks.filter(p => p.is_fenced === 'yes').length} eingezäunten Bereiche, 
            die auch für unsichere Hunde oder Welpen geeignet sind. 
            {city.parks.filter(p => p.has_water === 'yes').length > 0 && 
              ` Einige Hundewiesen in ${city.name} bieten sogar Zugang zu Wasser, wo Hunde an heißen Tagen eine Abkühlung finden können.`
            }
          </p>
          <p className="text-gray-700">
            Nutze unsere Karte und Detailansichten, um den perfekten Hundepark in {city.name} für deinen Vierbeiner zu finden.
          </p>
        </div>
      </div>
    </main>
  );
}
