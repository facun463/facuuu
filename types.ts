
export enum TextType {
  LIBRO = 'Libro',
  ARTICULO = 'Artículo Académico'
}

export enum Carrera {
  COMUNICACION_SOCIAL = 'Lic. en Comunicación Social',
  PERIODISMO_DEPORTIVO = 'Periodismo Deportivo',
  COMUNICACION_POPULAR = 'Comunicación Popular',
  COMUNICACION_DIGITAL = 'Comunicación Digital',
  COMUNICACION_PUBLICA = 'Comunicación Pública y Política',
  PROFESORADO = 'Profesorado en Comunicación'
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  year: number;
  type: TextType;
  abstract: string;
  keywords: string[];
  location: string; // e.g., "Biblioteca Central", "Repositorio Digital"
}

export interface SearchFilters {
  type?: TextType;
  carrera?: Carrera;
  yearFrom?: number;
  yearTo?: number;
}
