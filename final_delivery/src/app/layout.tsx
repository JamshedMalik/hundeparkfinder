import Link from 'next/link';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-green-800">
              HundeparkFinder.de
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-green-700">
                Startseite
              </Link>
              <Link href="/suche" className="text-gray-700 hover:text-green-700">
                Alle Hundeparks
              </Link>
              <Link href="/merkmal/eingezaeunt" className="text-gray-700 hover:text-green-700">
                Eingezäunte Parks
              </Link>
              <Link href="/merkmal/indoor" className="text-gray-700 hover:text-green-700">
                Indoor Parks
              </Link>
              <Link href="/park-hinzufuegen" className="text-gray-700 hover:text-green-700">
                Park hinzufügen
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/en" className="text-gray-700 hover:text-green-700">
                EN
              </Link>
              <Link href="/" className="text-green-700 font-medium">
                DE
              </Link>
              
              <button className="md:hidden text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {children}
      
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HundeparkFinder.de</h3>
              <p className="text-gray-300">
                Die umfassendste Datenbank für Hundewiesen, Hundespielplätze und Hundeparks in Deutschland.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Schnellzugriff</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Startseite
                  </Link>
                </li>
                <li>
                  <Link href="/suche" className="text-gray-300 hover:text-white">
                    Alle Hundeparks
                  </Link>
                </li>
                <li>
                  <Link href="/merkmal/eingezaeunt" className="text-gray-300 hover:text-white">
                    Eingezäunte Parks
                  </Link>
                </li>
                <li>
                  <Link href="/merkmal/indoor" className="text-gray-300 hover:text-white">
                    Indoor Parks
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Beliebte Städte</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/stadt/berlin" className="text-gray-300 hover:text-white">
                    Berlin
                  </Link>
                </li>
                <li>
                  <Link href="/stadt/hamburg" className="text-gray-300 hover:text-white">
                    Hamburg
                  </Link>
                </li>
                <li>
                  <Link href="/stadt/muenchen" className="text-gray-300 hover:text-white">
                    München
                  </Link>
                </li>
                <li>
                  <Link href="/stadt/koeln" className="text-gray-300 hover:text-white">
                    Köln
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Rechtliches</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/impressum" className="text-gray-300 hover:text-white">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-gray-300 hover:text-white">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="text-gray-300 hover:text-white">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HundeparkFinder.de - Alle Rechte vorbehalten</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
