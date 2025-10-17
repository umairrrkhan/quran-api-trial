// src/components/sections/SearchSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchSection.css';

// Emotion to Surah mappings
const emotionSurahMap = {
  sadness: [
    { id: 93, name: "Ad-Duhaa", name_arabic: "الضحى", translation: "The Morning Hours", reason: "Brings hope after hardship" },
    { id: 94, name: "Ash-Sharh", name_arabic: "الشرح", translation: "The Relief", reason: "Comfort and relief" },
    { id: 12, name: "Yusuf", name_arabic: "يوسف", translation: "Joseph", reason: "Story of patience and overcoming hardship" }
  ],
  happiness: [
    { id: 55, name: "Ar-Rahman", name_arabic: "الرحمن", translation: "The Beneficent", reason: "Celebrates Allah's blessings" },
    { id: 1, name: "Al-Fatihah", name_arabic: "الفاتحة", translation: "The Opener", reason: "Gratitude and praise" },
    { id: 87, name: "Al-A'la", name_arabic: "الأعلى", translation: "The Most High", reason: "Glorifies Allah's greatness" }
  ],
  anxiety: [
    { id: 2, name: "Al-Baqarah", name_arabic: "البقرة", translation: "The Cow", reason: "Brings peace and security" },
    { id: 113, name: "Al-Falaq", name_arabic: "الفلق", translation: "The Daybreak", reason: "Protection from evil" },
    { id: 114, name: "An-Nas", name_arabic: "الناس", translation: "Mankind", reason: "Seeking refuge in Allah" }
  ],
  guidance: [
    { id: 1, name: "Al-Fatihah", name_arabic: "الفاتحة", translation: "The Opener", reason: "The path of guidance" },
    { id: 36, name: "Ya-Sin", name_arabic: "يس", translation: "Ya Sin", reason: "Heart of the Quran" },
    { id: 67, name: "Al-Mulk", name_arabic: "الملك", translation: "The Sovereignty", reason: "Purpose and meaning" }
  ],
  patience: [
    { id: 2, name: "Al-Baqarah", name_arabic: "البقرة", translation: "The Cow", reason: "Teaches patience and perseverance" },
    { id: 3, name: "Ali 'Imran", name_arabic: "آل عمران", translation: "Family of Imran", reason: "Steadfastness in faith" },
    { id: 103, name: "Al-'Asr", name_arabic: "العصر", translation: "The Declining Day", reason: "Value of patience and time" }
  ],
  forgiveness: [
    { id: 3, name: "Ali 'Imran", name_arabic: "آل عمران", translation: "Family of Imran", reason: "Allah's mercy and forgiveness" },
    { id: 39, name: "Az-Zumar", name_arabic: "الزمر", translation: "The Troops", reason: "Seeking forgiveness" },
    { id: 110, name: "An-Nasr", name_arabic: "النصر", translation: "The Divine Support", reason: "Forgiveness and victory" }
  ],
  strength: [
    { id: 67, name: "Al-Mulk", name_arabic: "الملك", translation: "The Sovereignty", reason: "Strength through faith" },
    { id: 48, name: "Al-Fath", name_arabic: "الفتح", translation: "The Victory", reason: "Divine strength and support" },
    { id: 57, name: "Al-Hadid", name_arabic: "الحديد", translation: "The Iron", reason: "Strength and resilience" }
  ],
  gratitude: [
    { id: 55, name: "Ar-Rahman", name_arabic: "الرحمن", translation: "The Beneficent", reason: "Counting blessings" },
    { id: 16, name: "An-Nahl", name_arabic: "النحل", translation: "The Bee", reason: "Gratitude for creation" },
    { id: 14, name: "Ibrahim", name_arabic: "ابراهيم", translation: "Abraham", reason: "Thankfulness and blessings" }
  ],
  fear: [
    { id: 113, name: "Al-Falaq", name_arabic: "الفلق", translation: "The Daybreak", reason: "Protection from fear" },
    { id: 114, name: "An-Nas", name_arabic: "الناس", translation: "Mankind", reason: "Refuge from fear" },
    { id: 23, name: "Al-Mu'minun", name_arabic: "المؤمنون", translation: "The Believers", reason: "Overcoming fear through faith" }
  ],
  hope: [
    { id: 93, name: "Ad-Duhaa", name_arabic: "الضحى", translation: "The Morning Hours", reason: "Hope after darkness" },
    { id: 94, name: "Ash-Sharh", name_arabic: "الشرح", translation: "The Relief", reason: "Relief and hope" },
    { id: 92, name: "At-Tin", name_arabic: "التين", translation: "The Fig", reason: "Human dignity and hope" }
  ]
};

// AI-like response templates
const aiResponses = {
  greeting: [
    "I understand you're looking for guidance. Let me help you find the perfect Surah for your situation.",
    "Based on what you're feeling, I can recommend some beautiful Surahs that will bring you comfort.",
    "I'm here to help you find the right verses for your emotional state."
  ],
  closing: [
    "May these verses bring you peace and guidance in your time of need.",
    "I hope these recommendations resonate with your heart and bring you comfort.",
    "These Surahs are known to help with situations like yours. May they be a source of strength."
  ]
};

interface Recommendation {
  id: number;
  name: string;
  name_arabic: string;
  translation: string;
  reason: string;
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
  chapter: Recommendation & { verses_count: number; revelation_place: string };
  verses: Verse[];
}

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Simple emotion detection based on keywords
  const detectEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy') || lowerText.includes('cry')) {
      return 'sadness';
    } else if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('celebrate') || lowerText.includes('blessed')) {
      return 'happiness';
    } else if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('stress') || lowerText.includes('panic')) {
      return 'anxiety';
    } else if (lowerText.includes('guid') || lowerText.includes('help') || lowerText.includes('direction') || lowerText.includes('path')) {
      return 'guidance';
    } else if (lowerText.includes('patient') || lowerText.includes('wait') || lowerText.includes('persever') || lowerText.includes('endur')) {
      return 'patience';
    } else if (lowerText.includes('forgiv') || lowerText.includes('mistake') || lowerText.includes('sorry') || lowerText.includes('sin')) {
      return 'forgiveness';
    } else if (lowerText.includes('strong') || lowerText.includes('weak') || lowerText.includes('power') || lowerText.includes('courage')) {
      return 'strength';
    } else if (lowerText.includes('thank') || lowerText.includes('grateful') || lowerText.includes('blessing') || lowerText.includes('appreciate')) {
      return 'gratitude';
    } else if (lowerText.includes('fear') || lowerText.includes('scared') || lowerText.includes('afraid') || lowerText.includes('terror')) {
      return 'fear';
    } else if (lowerText.includes('hope') || lowerText.includes('future') || lowerText.includes('optimistic') || lowerText.includes('better')) {
      return 'hope';
    } else {
      return 'guidance'; // Default fallback
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSurahClick = async (surah: Recommendation) => {
    if (selectedSurah?.chapter.id === surah.id) {
      // Close if clicking the same surah
      setSelectedSurah(null);
      return;
    }

    setLoadingContent(true);
    try {
      // Get full chapter info to get verses_count and revelation_place
      const chapterResponse = await fetch(`https://api.quran.com/api/v4/chapters/${surah.id}`);
      const chapterData = await chapterResponse.json();
      const chapter = chapterData.chapter;
      
      // Get verses
      const versesResponse = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&per_page=50&words=true&translations=131`);
      const versesData = await versesResponse.json();
      
      const surahContent: SurahContent = {
        chapter: {
          ...surah,
          verses_count: chapter.verses_count,
          revelation_place: chapter.revelation_place
        },
        verses: versesData.verses || []
      };
      
      setSelectedSurah(surahContent);
    } catch (err) {
      console.error('Error fetching surah content:', err);
      // Fallback content
      const fallbackVerses: Verse[] = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        verse_number: i + 1,
        verse_key: `${surah.id}:${i + 1}`,
        words: [
          {
            id: 1,
            position: 1,
            text: 'ﭑ',
            translation: {
              text: `Verse ${i + 1} from ${surah.translation}`,
              language_name: "english"
            },
            char_type_name: "word"
          }
        ]
      }));
      
      setSelectedSurah({
        chapter: {
          ...surah,
          verses_count: 7,
          revelation_place: 'makkah'
        },
        verses: fallbackVerses
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const closeSurahContent = () => {
    setSelectedSurah(null);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const emotion = detectEmotion(query);
    const surahs = emotionSurahMap[emotion as keyof typeof emotionSurahMap] || emotionSurahMap.guidance;
    
    // Generate AI-like message
    const greeting = aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    const closing = aiResponses.closing[Math.floor(Math.random() * aiResponses.closing.length)];
    
    setAiMessage(`${greeting} ${closing}`);
    setRecommendations(surahs);
    setIsSearching(false);
    setHasSearched(true);
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-content">
          <h2 className="search-title">Find Your Perfect Surah</h2>
          <p className="search-subtitle">Tell me how you're feeling, and I'll recommend the perfect Surah for you</p>
          
          <div className="search-box-container">
            <input 
              type="text" 
              placeholder="e.g., 'I'm feeling sad and need comfort', 'I need guidance', 'I'm anxious'..." 
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? 'Thinking...' : 'Get Recommendations'}
            </button>
          </div>

          {isSearching && (
            <div className="ai-thinking">
              <div className="thinking-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
              <p>Analyzing your emotions and finding the perfect Surahs...</p>
            </div>
          )}

          {hasSearched && recommendations.length > 0 && (
            <div className="ai-response">
              <div className="ai-message">
                <div className="ai-avatar">AI</div>
                <div className="ai-text">
                  <p>{aiMessage}</p>
                </div>
              </div>
              
              <div className="recommendations-grid">
                {recommendations.map((surah) => (
                  <div 
                    key={surah.id} 
                    className="recommendation-card clickable"
                    onClick={() => handleSurahClick(surah)}
                  >
                    <div className="surah-header">
                      <h4>{surah.name}</h4>
                      <span className="surah-number">#{surah.id}</span>
                    </div>
                    <p className="surah-arabic">{surah.name_arabic}</p>
                    <p className="surah-translation">{surah.translation}</p>
                    <div className="surah-reason">
                      <strong>Why this Surah:</strong> {surah.reason}
                    </div>
                    <div className="click-indicator">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && hasSearched && recommendations.length === 0 && (
            <div className="ai-response">
              <div className="ai-message">
                <div className="ai-avatar">AI</div>
                <div className="ai-text">
                  <p>I couldn't find specific recommendations for your request. Try describing your emotions or needs differently.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Surah Content Modal */}
      {selectedSurah && (
        <div className="surah-modal-overlay" onClick={closeSurahContent}>
          <div className="surah-modal" onClick={(e) => e.stopPropagation()}>
            <div className="surah-modal-header">
              <div className="surah-modal-title">
                <h2>{selectedSurah.chapter.name}</h2>
                <p className="surah-modal-arabic">{selectedSurah.chapter.name_arabic}</p>
                <p className="surah-modal-translation">{selectedSurah.chapter.translation}</p>
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

export default SearchSection;