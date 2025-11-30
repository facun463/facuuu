
import React, { useState, useCallback } from 'react';
import { TextType, SearchResult, Carrera } from './types';
import { searchLibraryTexts } from './services/geminiService';
import ResultCard from './components/ResultCard';
import ReaderView from './components/ReaderView';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [readingDoc, setReadingDoc] = useState<SearchResult | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setError(null);
    setResults([]); // Clear previous results while loading
    setReadingDoc(null); // Ensure we are not in reading mode

    try {
      const data = await searchLibraryTexts(query, selectedType, selectedCarrera);
      setResults(data);
    } catch (err) {
      setError("Hubo un error al realizar la búsqueda. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [query, selectedType, selectedCarrera]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReadDocument = (doc: SearchResult) => {
    setReadingDoc(doc);
  };

  const handleBackToSearch = () => {
    setReadingDoc(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] relative overflow-x-hidden selection:bg-[#0B8D2C] selection:text-white">
      
      {/* Background Decor Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Modern Header */}
      <div className="sticky top-4 z-50 px-4 md:px-6">
        <header className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/50 rounded-2xl mx-auto max-w-7xl transition-all duration-300">
          <div className="px-4 py-3 md:px-6 md:py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleBackToSearch}>
              <div className="w-10 h-10 bg-[#011A9D] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/20 transform group-hover:scale-110 transition-transform duration-300 tracking-tight">
                TP
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold leading-none text-slate-800 tracking-tight group-hover:text-[#0B8D2C] transition-colors">Textos Perio</h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">UNLP</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              {['Inicio', 'Repositorio', 'Revistas'].map((item) => (
                <a key={item} href="#" onClick={(e) => { e.preventDefault(); if(item === 'Inicio') handleBackToSearch(); }} 
                   className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0B8D2C] hover:bg-green-50 rounded-full transition-all">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 relative z-0">
        
        {readingDoc ? (
          <ReaderView document={readingDoc} onBack={handleBackToSearch} />
        ) : (
          <>
            {/* Search Hero Section */}
            <div className={`transition-all duration-700 ease-out ${hasSearched ? 'mt-4 scale-95 opacity-100' : 'mt-20 md:mt-32 scale-100'} max-w-3xl mx-auto text-center mb-12`}>
              
              {!hasSearched && (
                <div className="mb-10 animate-fadeInUp">
                  <h2 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
                    Explora el saber <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B8D2C] to-emerald-500">
                      sin límites.
                    </span>
                  </h2>
                  <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
                    Accedé a toda la bibliografía, libros y artículos de la Facultad de Periodismo de la UNLP.
                  </p>
                </div>
              )}

              <div className={`relative group transition-all duration-500 ${hasSearched ? 'shadow-none' : 'shadow-2xl shadow-green-900/10'}`}>
                {/* Search Bar Container */}
                <div className="bg-white p-2 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-2 shadow-xl shadow-slate-200/60 ring-4 ring-transparent hover:ring-green-50 transition-all duration-300">
                  
                  {/* Input Area */}
                  <div className="flex-1 flex items-center bg-slate-50 rounded-[1.5rem] px-4 py-2 md:py-3 border border-transparent focus-within:bg-white focus-within:border-green-200 focus-within:shadow-inner transition-all">
                    <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 font-medium text-lg"
                      placeholder="¿Qué estás buscando hoy?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  {/* Desktop Filters & Button */}
                  <div className="hidden md:flex items-center gap-2">
                    <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
                    
                    <select 
                      className="bg-transparent text-sm font-semibold text-slate-600 hover:text-[#0B8D2C] py-2 px-2 cursor-pointer outline-none transition-colors border-none focus:ring-0 appearance-none text-center min-w-[140px]"
                      value={selectedCarrera}
                      onChange={(e) => setSelectedCarrera(e.target.value)}
                    >
                      <option value="">Todas las carreras</option>
                      {Object.values(Carrera).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select 
                      className="bg-transparent text-sm font-semibold text-slate-600 hover:text-[#0B8D2C] py-2 px-2 cursor-pointer outline-none transition-colors border-none focus:ring-0 appearance-none"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">Todo tipo</option>
                      <option value={TextType.LIBRO}>Libros</option>
                      <option value={TextType.ARTICULO}>Artículos</option>
                    </select>

                    <button 
                      onClick={() => handleSearch()}
                      className="bg-[#0B8D2C] hover:bg-[#097a26] text-white rounded-full p-4 shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center aspect-square"
                      aria-label="Buscar"
                    >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>

                {/* Mobile Filters */}
                <div className="md:hidden mt-3 grid grid-cols-2 gap-2">
                   <select 
                        className="bg-white text-sm font-medium text-slate-600 rounded-2xl border border-slate-200 py-3 px-4 outline-none focus:border-[#0B8D2C] appearance-none"
                        value={selectedCarrera}
                        onChange={(e) => setSelectedCarrera(e.target.value)}
                      >
                        <option value="">Todas las carreras</option>
                        {Object.values(Carrera).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                   <select 
                        className="bg-white text-sm font-medium text-slate-600 rounded-2xl border border-slate-200 py-3 px-4 outline-none focus:border-[#0B8D2C] appearance-none"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value={TextType.LIBRO}>Libros</option>
                        <option value={TextType.ARTICULO}>Artículos</option>
                      </select>
                   <button 
                      onClick={() => handleSearch()}
                      className="col-span-2 bg-[#0B8D2C] text-white font-bold py-3 rounded-2xl shadow-lg shadow-green-500/30 mt-2 active:scale-95 transition-transform"
                    >
                      Buscar Textos
                    </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-8 h-72 border border-slate-100 shadow-sm animate-pulse flex flex-col">
                      <div className="flex justify-between mb-6">
                        <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                        <div className="h-6 bg-slate-100 rounded-full w-12"></div>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-lg w-3/4 mb-3"></div>
                      <div className="h-8 bg-slate-100 rounded-lg w-1/2 mb-6"></div>
                      <div className="space-y-2 mt-auto">
                         <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                         <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="max-w-2xl mx-auto p-6 mb-8 text-center bg-red-50 text-red-500 rounded-3xl border border-red-100 animate-fadeIn">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && hasSearched && results.length === 0 && !error && (
              <div className="text-center py-20 animate-fadeIn">
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800">Ups, sin resultados</h3>
                 <p className="text-slate-500 mt-2">Prueba buscando con palabras clave de tu materia.</p>
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <div className="max-w-7xl mx-auto animate-fadeInUp">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Resultados encontrados <span className="text-slate-400 font-normal ml-2 text-base">({results.length})</span>
                  </h3>
                  {selectedCarrera && (
                    <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-[#0B8D2C]">
                      {selectedCarrera}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-12">
                  {results.map((result) => (
                    <ResultCard key={result.id} result={result} onRead={handleReadDocument} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {!readingDoc && (
        <footer className="relative bg-white border-t border-slate-100 py-10 mt-auto">
          <div className="container mx-auto px-4 text-center">
             <div className="flex items-center justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="w-8 h-8 bg-[#011A9D] rounded-lg flex items-center justify-center text-white font-bold text-xs mr-2">TP</div>
               <span className="font-bold text-slate-700">Textos Perio</span>
             </div>
            <div className="flex justify-center gap-6 mb-8 text-sm font-medium text-slate-500">
               <a href="#" className="hover:text-[#0B8D2C] transition-colors">Términos</a>
               <a href="#" className="hover:text-[#0B8D2C] transition-colors">Privacidad</a>
               <a href="#" className="hover:text-[#0B8D2C] transition-colors">Ayuda</a>
            </div>
            <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Facultad de Periodismo y Comunicación Social - UNLP</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
