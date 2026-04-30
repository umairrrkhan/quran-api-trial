export interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: {
    language_name: string;
    name: string;
  };
  verses_count: number;
  revelation_place: string;
}

export interface Word {
  id: number;
  position: number;
  text: string;
  text_uthmani?: string;
  char_type_name: string;
  translation: {
    text: string;
    language_name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  words: Word[];
}

export interface SurahContent {
  chapter: Chapter;
  verses: Verse[];
}

export interface ReadingRecord {
  completedDate: string;
  versesRead: number;
  completed: boolean;
}

export interface DailyActivity {
  date: string;
  count: number;
}
