
import React, { useState } from 'react';
import { SearchResult, TextType } from '../types';
import { expandAbstract } from '../services/geminiService';

interface ResultCardProps {
  result: SearchResult;
  onRead: (result: SearchResult) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedAbstract, setDetailedAbstract] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTypeStyle = (type: TextType) => {
    switch (type) {
      case TextType.LIBRO: return 'bg-blue-50 text-blue-600 border border-blue-100';
      case TextType.ARTICULO: return 'bg-purple-50 text-purple-600 border border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const handleExpand = async () => {
    if (!isExpanded && !detailedAbstract) {
      setLoadingDetail(true);
      setIsExpanded(true);
      const details = await expandAbstract(result.title, result.author);
      setDetailedAbstract(details);
      setLoadingDetail(false);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleShare = async () => {
    const fakeUrl = `https://periotextos.unlp.edu.ar/textos/${result.id}`;
    try {
      await navigator.clipboard.writeText(fakeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-1 hover:border-green-100 border border-slate-50 flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative gradient top bar on hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B8D2C] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getTypeStyle(result.type)}`}>
          {result.type}
        </span>
        <span className="text-slate-400 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-lg">{result.year}</span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-[#0B8D2C] transition-colors duration-200">
        {result.title}
      </h3>
      <p className="text-slate-500 font-medium text-sm mb-4 flex items-center">
        <span className="w-6 h-[1px] bg-slate-300 mr-2"></span>
        {result.author}
      </p>
      
      <div className="flex-grow">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 opacity-90">
            {result.abstract}
          </p>

          {isExpanded && (
            <div className="mt-2 mb-4 p-4 bg-slate-50/80 backdrop-blur rounded-2xl text-sm text-slate-700 animate-fadeIn">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-2 space-x-2 text-slate-400">
                  <div className="w-2 h-2 bg-[#0B8D2C] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#0B8D2C] rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-[#0B8D2C] rounded-full animate-bounce delay-150"></div>
                </div>
              ) : (
                <div className="prose prose-sm prose-slate max-w-none">
                    <p className="italic text-slate-600 border-l-2 border-[#0B8D2C] pl-3">{detailedAbstract}</p>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6 mt-2">
        {result.keywords.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 gap-3 mt-auto border-t border-slate-50">
        <button 
          onClick={handleExpand}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wide hover:underline decoration-2 underline-offset-4"
        >
          {isExpanded ? 'Menos info' : 'Vista rápida'}
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#0B8D2C] hover:bg-green-50 rounded-full transition-all active:scale-95"
            title="Copiar enlace"
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            )}
          </button>
          
          <button 
            onClick={() => onRead(result)}
            className="bg-slate-900 group-hover:bg-[#0B8D2C] text-white text-sm font-bold py-2.5 px-5 rounded-full transition-all shadow-md hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center active:scale-95"
          >
            Leer
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
