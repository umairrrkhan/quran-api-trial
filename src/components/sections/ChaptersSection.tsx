// src/components/sections/ChaptersSection.tsx
import React, { useState, useEffect } from 'react';
import './ChaptersSection.css';

interface Chapter {
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

interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  words: Array<{
    id: number;
    position: number;
    text: string;
    char_type_name: string;
    translation: {
      text: string;
      language_name: string;
    };
  }>;
}

interface SurahContent {
  chapter: Chapter;
  verses: Verse[];
}

const ChaptersSection: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch('https://api.quran.com/api/v4/chapters');
        if (!response.ok) {
          throw new Error('Failed to fetch chapters');
        }
        const data = await response.json();
        setChapters(data.chapters || []);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Failed to load chapters');
        
        // Fallback data
        const fallbackChapters: Chapter[] = [
          { id: 1, name_simple: "Al-Fatihah", name_arabic: "الفاتحة", translated_name: { language_name: "english", name: "The Opener" }, verses_count: 7, revelation_place: "makkah" },
          { id: 2, name_simple: "Al-Baqarah", name_arabic: "البقرة", translated_name: { language_name: "english", name: "The Cow" }, verses_count: 286, revelation_place: "madinah" },
          { id: 3, name_simple: "Ali 'Imran", name_arabic: "آل عمران", translated_name: { language_name: "english", name: "Family of Imran" }, verses_count: 200, revelation_place: "madinah" },
          { id: 4, name_simple: "An-Nisa", name_arabic: "النساء", translated_name: { language_name: "english", name: "The Women" }, verses_count: 176, revelation_place: "madinah" },
          { id: 5, name_simple: "Al-Ma'idah", name_arabic: "المائدة", translated_name: { language_name: "english", name: "The Table Spread" }, verses_count: 120, revelation_place: "madinah" }
        ];
        setChapters(fallbackChapters);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  const handleSurahClick = async (chapter: Chapter) => {
    if (selectedSurah?.chapter.id === chapter.id) {
      // Close if clicking the same surah
      setSelectedSurah(null);
      return;
    }

    setLoadingContent(true);
    try {
      // Use the correct API endpoint with words and translations
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapter.id}?language=en&per_page=50&words=true&translations=131`);
      if (!response.ok) {
        throw new Error('Failed to fetch surah content');
      }
      const data = await response.json();
      
      const surahContent: SurahContent = {
        chapter,
        verses: data.verses || []
      };
      
      setSelectedSurah(surahContent);
    } catch (err) {
      console.error('Error fetching surah content:', err);
      // Fallback content with better structure
      const fallbackVerses: Verse[] = Array.from({ length: Math.min(chapter.verses_count, 7) }, (_, i) => ({
        id: i + 1,
        verse_number: i + 1,
        verse_key: `${chapter.id}:${i + 1}`,
        words: [
          {
            id: 1,
            position: 1,
            text: 'ﭑ',
            translation: {
              text: `Verse ${i + 1} from ${chapter.translated_name.name}`,
              language_name: "english"
            },
            char_type_name: "word"
          }
        ]
      }));
      
      setSelectedSurah({
        chapter,
        verses: fallbackVerses
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const closeSurahContent = () => {
    setSelectedSurah(null);
  };

  if (loading) {
    return (
      <section className="chapters-section">
        <div className="container">
          <div className="loading-state">
            <p>Loading Quran chapters...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="chapters-section">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="chapters-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Quran Chapters (Surahs)</h2>
          <p className="section-subtitle">Click on any chapter to read its full content</p>
        </div>

        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="chapter-card clickable"
              onClick={() => handleSurahClick(chapter)}
            >
              <div className="chapter-number">
                {chapter.id}
              </div>
              <div className="chapter-content">
                <h3 className="chapter-name">
                  {chapter.name_simple}
                </h3>
                <p className="chapter-arabic">
                  {chapter.name_arabic}
                </p>
                <p className="chapter-translation">
                  {chapter.translated_name.name}
                </p>
                <div className="chapter-meta">
                  <span className="verses-count">
                    {chapter.verses_count} verses
                  </span>
                  <span className={`revelation-place ${chapter.revelation_place}`}>
                    {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
                  </span>
                </div>
              </div>
              <div className="click-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surah Content Modal */}
      {selectedSurah && (
        <div className="surah-modal-overlay" onClick={closeSurahContent}>
          <div className="surah-modal" onClick={(e) => e.stopPropagation()}>
            <div className="surah-modal-header">
              <div className="surah-modal-title">
                <h2>{selectedSurah.chapter.name_simple}</h2>
                <p className="surah-modal-arabic">{selectedSurah.chapter.name_arabic}</p>
                <p className="surah-modal-translation">{selectedSurah.chapter.translated_name.name}</p>
                <div className="surah-modal-meta">
                  <span className="verses-count">{selectedSurah.chapter.verses_count} verses</span>
                  <span className={`revelation-place ${selectedSurah.chapter.revelation_place}`}>
                    {selectedSurah.chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
                  </span>
                </div>
              </div>
              <button className="close-modal" onClick={closeSurahContent}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {loadingContent ? (
              <div className="loading-state">
                <p>Loading surah content...</p>
              </div>
            ) : (
              <div className="verses-container">
                {selectedSurah.verses.map((verse) => (
                  <div key={verse.id} className="verse-item">
                    <div className="verse-header">
                      <span className="verse-number">Verse {verse.verse_number}</span>
                    </div>
                    <div className="verse-translation">
                      {verse.words
                        .filter(word => word.char_type_name !== 'end')
                        .map(word => word.translation.text)
                        .join(' ')}
                    </div>
                  </div>
                ))}
                {selectedSurah.verses.length < selectedSurah.chapter.verses_count && (
                  <div className="partial-content-note">
                    <p>Showing first {selectedSurah.verses.length} verses of {selectedSurah.chapter.verses_count}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ChaptersSection;