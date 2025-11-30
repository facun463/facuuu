
import React, { useEffect, useState } from 'react';
import { SearchResult } from '../types';
import { generateDocumentContent } from '../services/geminiService';

interface ReaderViewProps {
  document: SearchResult;
  onBack: () => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ document, onBack }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const text = await generateDocumentContent(document.title, document.author, document.type);
      setContent(text);
      setLoading(false);
    };
    loadContent();
  }, [document]);

  // Helper function to highlight keywords in a text string
  const highlightKeywords = (text: string) => {
    if (!document.keywords || document.keywords.length === 0) return text;
    const sortedKeywords = [...document.keywords].sort((a, b) => b.length - a.length);
    const escapedKeywords = sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    const parts = text.split(pattern);

    return parts.map((part, i) => {
        const isKeyword = sortedKeywords.some(k => k.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
            return (
                <span key={i} className="bg-yellow-200/50 text-slate-900 px-1 rounded-md mx-0.5 font-semibold decoration-clone box-decoration-clone border-b-2 border-yellow-300">
                    {part}
                </span>
            );
        }
        return part;
    });
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} className="h-6" />; 

      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-slate-800 mt-12 mb-6 tracking-tight leading-snug">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-extrabold text-slate-900 mt-16 mb-8 tracking-tight relative inline-block leading-tight">
             <span className="relative z-10">{trimmedLine.replace('## ', '')}</span>
             <span className="absolute bottom-1 left-0 w-full h-3 bg-green-100 -z-0 -rotate-1 rounded-sm"></span>
          </h2>
        );
      }
      
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);

      return (
        <p key={index} className="mb-8 text-lg leading-loose text-slate-800 font-serif md:text-justify hyphens-auto">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return <React.Fragment key={i}>{highlightKeywords(part)}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      
      {/* Back Button */}
      <div className="sticky top-24 z-20 mb-8 pointer-events-none">
         <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur shadow-md hover:shadow-lg text-slate-600 hover:text-[#0B8D2C] transition-all rounded-full font-bold text-sm transform hover:-translate-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver
        </button>
      </div>

      <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden mb-20">
        
        {/* Document Header */}
        <div className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 p-8 md:p-14 relative overflow-hidden">
           {/* Abstract Decoration */}
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100/50 rounded-full blur-3xl"></div>
           <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-100/50 rounded-full blur-2xl"></div>

           <div className="relative z-10 text-center max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 text-white mb-6 shadow-md">
                {document.type}
              </span>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                  {document.title}
              </h1>
              
              <div className="flex flex-col items-center gap-4 text-slate-600">
                  <div className="font-bold text-lg md:text-xl text-[#0B8D2C]">
                    {document.author}
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium opacity-70">
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {document.year}
                    </span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {document.location}
                    </span>
                  </div>
              </div>

               {/* Keyword Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                 {document.keywords.map((k, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:border-[#0B8D2C] hover:text-[#0B8D2C] transition-colors cursor-default">
                        #{k}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-10 md:px-16 md:py-14">
          {loading ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {[...Array(6)].map((_, i) => (
                 <div key={i} className="space-y-4">
                    <div className="h-5 bg-slate-100 rounded-full w-full animate-pulse"></div>
                    <div className="h-5 bg-slate-100 rounded-full w-[98%] animate-pulse"></div>
                    <div className="h-5 bg-slate-100 rounded-full w-[95%] animate-pulse"></div>
                    <div className="h-5 bg-slate-100 rounded-full w-[90%] animate-pulse"></div>
                 </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
               <div className="mb-12 p-8 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-900 text-base leading-relaxed italic flex gap-4 shadow-sm">
                  <span className="text-4xl font-serif text-yellow-400/60 select-none">“</span>
                  <p>{document.abstract}</p>
               </div>
               
               {content ? renderContent(content) : <p className="text-center text-slate-400">Error al cargar contenido.</p>}
               
               <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Fin del fragmento</p>
                  <div className="w-2 h-2 bg-[#0B8D2C] rounded-full mx-auto mt-6"></div>
               </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ReaderView;
