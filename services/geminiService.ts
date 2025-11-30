import { GoogleGenAI } from "@google/genai";
import { SearchResult, TextType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchLibraryTexts = async (query: string, filterType?: string, filterCarrera?: string): Promise<SearchResult[]> => {
  const model = "gemini-2.5-flash";
  
  // Simplified prompt to avoid schema validation errors
  const prompt = `
    Actúa como el motor de búsqueda exclusivo del sitio web "Cátedras" de la Facultad de Periodismo y Comunicación Social de la UNLP (https://perio.unlp.edu.ar/catedras/).
    
    TU OBJETIVO: Buscar y listar bibliografía (textos, libros, artículos) que esté alojada, enlazada o sea material obligatorio en ese sitio web específico.
    
    El usuario está buscando: "${query}".
    ${filterType ? `Filtro tipo: ${filterType}.` : ''}
    ${filterCarrera ? `Carrera: ${filterCarrera}. Busca textos utilizados en las cátedras correspondientes a esta carrera.` : ''}

    Genera una lista de 6 a 10 resultados bibliográficos REALES que sean material de estudio en dichas cátedras.
    NO inventes bibliografía que no pertenezca al plan de estudios de la UNLP.
    
    IMPORTANTE: Genera ÚNICAMENTE resultados de tipo "Libro" o "Artículo Académico".
    
    Responde ÚNICAMENTE con un JSON válido que sea una lista de objetos. No uses markdown.
    El formato de cada objeto debe ser:
    {
      "id": "string_unico",
      "title": "string (Título exacto)",
      "author": "string (Autor)",
      "year": number,
      "type": "Libro" | "Artículo Académico",
      "abstract": "string (Breve descripción de cómo se aborda este texto en la cátedra)",
      "keywords": ["string", "string", ...],
      "location": "string (Nombre de la Cátedra UNLP donde se usa, ej: 'Taller de Producción Gráfica I')"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      // Clean up potential markdown formatting if the model ignores the instruction
      const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText) as SearchResult[];
    }
    return [];
  } catch (error) {
    console.error("Error searching texts:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const expandAbstract = async (title: string, author: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Sobre el texto "${title}" de ${author}, utilizado en la Facultad de Periodismo de la UNLP:
      Genera un fragmento textual representativo (cita larga simulada) del libro y 3 conceptos clave que se estudian en la cátedra.
      NO hagas un resumen tipo "este libro trata de". 
      Formato: 
      "Fragmento destacado: ..."
      Conceptos clave: ...`,
    });
    return response.text || "No se pudo generar el detalle.";
  } catch (error) {
    console.error("Error expanding abstract:", error);
    return "Error al conectar con el asistente.";
  }
};

export const generateDocumentContent = async (title: string, author: string, type: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  try {
    const prompt = `
      ROL: ERES UN TRANSCRIPTOR DE TEXTOS ACADÉMICOS. NO ERES UN ASISTENTE.
      TAREA: PROPORCIONAR UNA TRANSCRIPCIÓN DIRECTA Y LITERAL (VERBATIM) DEL TEXTO ORIGINAL.

      OBRA: "${title}"
      AUTOR: "${author}"
      CONTEXTO: Facultad de Periodismo y Comunicación Social (UNLP).

      REGLAS DE TRANSCRIPCIÓN (ESTRICTAS):
      1. PROHIBIDO RESUMIR. PROHIBIDO EXPLICAR. PROHIBIDO PARAFRASEAR.
      2. NO escribas introducciones como "Aquí presento el texto" o "En este capítulo...".
      3. Empieza DIRECTAMENTE con el título de un capítulo y el primer párrafo del texto original.
      4. El estilo debe ser 100% el del autor: mantén la densidad teórica, las palabras complejas, la sintaxis académica y las oraciones largas.
      5. INCLUYE ELEMENTOS ORIGINALES: Citas bibliográficas entre paréntesis (Ej: Verón, 1987), notas al pie simuladas, y subtítulos.
      6. EXTENSIÓN: MÍNIMO 2000 PALABRAS. Genera un bloque de texto extenso, como si hubieras escaneado 5 páginas seguidas del libro.
      
      FORMATO DE SALIDA ESPERADO:
      ## [Título del Capítulo o Artículo]

      [Párrafo 1: Texto académico denso, directo del autor, sin modificaciones...]
      
      [Párrafo 2: Continuación directa...]

      [Párrafo 3...]
      
      ... (Continuar por 2000 palabras) ...
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "No se pudo recuperar el contenido del documento.";
  } catch (error) {
    console.error("Error generating document content:", error);
    return "Error al cargar el documento. Por favor intente más tarde.";
  }
};
