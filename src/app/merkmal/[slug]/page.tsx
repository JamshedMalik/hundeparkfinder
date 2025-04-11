import { getParksByFeature, getFeatures } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ParkCard from '@/components/ParkCard';
import MapComponent from '@/components/MapComponent';

export default function FeaturePage({
  params,
}: {
  params: { slug: string };
}) {
  const features = getFeatures();
  const feature = features.find(f => f.slug === params.slug);
  
  if (!feature) {
    notFound();
  }
  
  const parks = getParksByFeature(params.slug);
  
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/" className="text-green-700 hover:underline">
            ← Zurück zur Startseite
          </Link>
        </div>
        
        {/* Feature Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{feature.name} Hundeparks</h1>
            <p className="text-xl">{parks.length} Hundeparks gefunden</p>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              {feature.slug === 'eingezaeunt' && 
                'Eingezäunte Hundewiesen bieten einen sicheren Raum für deinen Hund zum Spielen und Toben. Besonders geeignet für Welpen, unsichere Hunde oder Hunde mit geringem Rückruf.'}
              {feature.slug === 'wasser' && 
                'Hundeparks mit Wasserzugang ermöglichen deinem Vierbeiner eine erfrischende Abkühlung an warmen Tagen. Ideal für wasserliebende Hunde und heiße Sommertage.'}
              {feature.slug === 'agility' && 
                'Hundeparks mit Agility-Elementen bieten zusätzliche Herausforderungen und Trainingsmöglichkeiten für aktive Hunde. Perfekt für sportliche Vierbeiner, die geistig und körperlich gefordert werden wollen.'}
              {feature.slug === 'indoor' && 
                'Indoor Hundespielplätze sind die perfekte Lösung bei schlechtem Wetter. Hier kann dein Hund auch bei Regen oder Kälte ausgiebig toben und spielen.'}
              {feature.slug === 'sitzgelegenheiten' && 
                'Hundeparks mit Sitzgelegenheiten bieten Komfort für Hundebesitzer während ihre Vierbeiner spielen. Ideal für längere Aufenthalte und entspannte Beobachtung.'}
              {feature.slug === 'muelleimer' && 
                'Hundeparks mit Mülleimern erleichtern die Entsorgung von Hundekot und halten die Anlage sauber. Ein wichtiger Beitrag zur Hygiene und Sauberkeit.'}
              {feature.slug === 'beleuchtung' && 
                'Beleuchtete Hundeparks ermöglichen auch in den Abendstunden sichere Spaziergänge und Spielzeiten. Besonders praktisch in der dunklen Jahreszeit.'}
              {feature.slug === 'parkplaetze' && 
                'Hundeparks mit Parkplätzen sind bequem mit dem Auto erreichbar. Ideal für weiter entfernte Ausflugsziele oder wenn du Ausrüstung für deinen Hund mitnehmen möchtest.'}
            </p>
            
            {/* Map */}
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md mb-6">
              <MapComponent parks={parks} zoom={6} />
            </div>
          </div>
        </div>
        
        {/* Parks Grid */}
        <h2 className="text-2xl font-bold mb-6">Alle {feature.name} Hundeparks</h2>
        
        {parks.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium text-yellow-800 mb-2">Keine Hundeparks gefunden</h2>
            <p className="text-yellow-700">
              Leider wurden keine Hundeparks mit diesem Merkmal gefunden. Schau dir andere Merkmale an oder durchsuche alle verfügbaren Hundeparks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        )}
        
        {/* SEO Content */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{feature.name} Hundewiesen in Deutschland</h2>
          <p className="text-gray-700 mb-4">
            {feature.slug === 'eingezaeunt' && 
              'Eingezäunte Hundewiesen sind besonders beliebt bei Hundebesitzern, die ihren Vierbeinern Freilauf ermöglichen möchten, ohne sich Sorgen um Ausbruchsversuche machen zu müssen. Diese sicheren Bereiche sind ideal für Welpen im Training, Hunde mit geringem Rückruf oder in städtischen Gebieten mit viel Verkehr.'}
            {feature.slug === 'wasser' && 
              'Hundewiesen mit Wasserzugang bieten eine willkommene Abkühlung für aktive Hunde, besonders während der warmen Sommermonate. Viele Hunde lieben es, im Wasser zu spielen, zu schwimmen oder einfach nur zu planschen, was eine hervorragende körperliche Betätigung darstellt.'}
            {feature.slug === 'agility' && 
              'Hundewiesen mit Agility-Elementen bieten zusätzliche Herausforderungen für aktive und sportliche Hunde. Die verschiedenen Hindernisse und Trainingsgeräte fördern nicht nur die körperliche Fitness, sondern auch die geistige Auslastung und stärken die Bindung zwischen Hund und Halter.'}
            {feature.slug === 'indoor' && 
              'Indoor Hundespielplätze sind die perfekte Alternative bei schlechtem Wetter oder extremen Temperaturen. Diese überdachten Bereiche ermöglichen es Hunden, unabhängig von den Wetterbedingungen zu spielen, zu trainieren und sich mit Artgenossen zu sozialisieren.'}
            {feature.slug === 'sitzgelegenheiten' && 
              'Hundewiesen mit Sitzgelegenheiten bieten Komfort für Hundebesitzer, während ihre Vierbeiner spielen und toben. Bänke oder andere Sitzmöglichkeiten laden zum Verweilen ein und ermöglichen es, andere Hundebesitzer kennenzulernen und sich auszutauschen.'}
            {feature.slug === 'muelleimer' && 
              'Hundewiesen mit Mülleimern tragen zur Sauberkeit und Hygiene bei. Die bereitgestellten Abfallbehälter erleichtern die ordnungsgemäße Entsorgung von Hundekot und anderen Abfällen, was zu einer angenehmeren Umgebung für alle Besucher führt.'}
            {feature.slug === 'beleuchtung' && 
              'Beleuchtete Hundewiesen ermöglichen sichere Besuche auch in den Abendstunden oder während der dunklen Jahreszeit. Die Beleuchtung erhöht nicht nur die Sicherheit, sondern verlängert auch die nutzbaren Stunden, besonders wichtig für Berufstätige.'}
            {feature.slug === 'parkplaetze' && 
              'Hundewiesen mit Parkplätzen sind bequem mit dem Auto erreichbar, was besonders für weiter entfernte oder größere Hundeauslaufflächen von Vorteil ist. Parkplätze in der Nähe erleichtern den Transport von Ausrüstung, Spielzeug oder mehreren Hunden.'}
          </p>
          <p className="text-gray-700">
            Nutze unsere Karte und Detailansichten, um den perfekten {feature.name.toLowerCase()} Hundepark für deinen Vierbeiner zu finden.
          </p>
        </div>
      </div>
    </main>
  );
}
