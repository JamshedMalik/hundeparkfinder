import { getDogParkBySlug, createSlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';

export default function ParkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const park = getDogParkBySlug(params.slug);
  
  if (!park) {
    notFound();
  }
  
  // Function to determine feature status
  const getFeatureStatus = (value: string) => {
    if (value === 'yes') return { icon: '✅', text: 'Ja' };
    if (value === 'no') return { icon: '❌', text: 'Nein' };
    if (value === 'partially') return { icon: '⚠️', text: 'Teilweise' };
    return { icon: '❓', text: 'Unbekannt' };
  };
  
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/suche" className="text-green-700 hover:underline">
            ← Zurück zur Suche
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Park Header */}
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{park.name}</h1>
            <p className="text-xl">{park.city}, {park.state}</p>
            
            {park.rating && (
              <div className="flex items-center mt-2">
                <span className="text-yellow-300 mr-1">★</span>
                <span className="font-medium">{park.rating}</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Details</h2>
                
                {park.description && (
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Beschreibung</h3>
                    <p className="text-gray-700">{park.description}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-2">Adresse</h3>
                  <p className="text-gray-700">{park.address}</p>
                  {park.postal_code && (
                    <p className="text-gray-700">{park.postal_code} {park.city}</p>
                  )}
                  
                  {park.google_maps_url && (
                    <a 
                      href={park.google_maps_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-green-700 hover:underline"
                    >
                      Auf Google Maps anzeigen
                    </a>
                  )}
                </div>
                
                {park.opening_hours && (
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Öffnungszeiten</h3>
                    <p className="text-gray-700">{park.opening_hours}</p>
                  </div>
                )}
                
                {park.phone && (
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Telefon</h3>
                    <p className="text-gray-700">{park.phone}</p>
                  </div>
                )}
                
                {park.website && (
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Website</h3>
                    <a 
                      href={park.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline"
                    >
                      {park.website}
                    </a>
                  </div>
                )}
              </div>
              
              {/* Right Column - Features and Map */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Merkmale</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.is_fenced).icon}</span>
                    <span>Eingezäunt: {getFeatureStatus(park.is_fenced).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_water).icon}</span>
                    <span>Wasser: {getFeatureStatus(park.has_water).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_agility).icon}</span>
                    <span>Agility: {getFeatureStatus(park.has_agility).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_seating).icon}</span>
                    <span>Sitzgelegenheiten: {getFeatureStatus(park.has_seating).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_waste_bins).icon}</span>
                    <span>Mülleimer: {getFeatureStatus(park.has_waste_bins).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_lighting).icon}</span>
                    <span>Beleuchtung: {getFeatureStatus(park.has_lighting).text}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2">{getFeatureStatus(park.has_parking).icon}</span>
                    <span>Parkplätze: {getFeatureStatus(park.has_parking).text}</span>
                  </div>
                  
                  {park.size && (
                    <div className="flex items-center">
                      <span className="mr-2">📏</span>
                      <span>Größe: {park.size}</span>
                    </div>
                  )}
                </div>
                
                {/* Map */}
                <h2 className="text-2xl font-bold mb-4">Lage</h2>
                <div className="h-[300px] rounded-lg overflow-hidden shadow-md">
                  {park.latitude && park.longitude && (
                    <MapComponent 
                      parks={[park]} 
                      center={[parseFloat(park.latitude), parseFloat(park.longitude)]} 
                      zoom={15} 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            {park.reviews && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Bewertungen</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {park.reviews.split('|').map((review, index) => (
                    <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
                      <p className="text-gray-700 italic">"{review.trim()}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Last Updated */}
            <div className="mt-8 text-sm text-gray-500">
              Letzte Aktualisierung: {park.last_updated}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
