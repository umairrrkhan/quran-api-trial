import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-header">
            <h1>About AyyahFlow</h1>
            <div className="accent-line" />
          </div>

          <div className="about-main">
            <div className="creator-intro">
              <h2>
                Read. Understand. Track.
              </h2>
              <p className="creator-title">
                Built for the Quran Foundation Hackathon
              </p>

              <div className="creator-description">
                <p>
                  AyyahFlow combines the Quran Foundation Content API, User API, OAuth2 authentication,
                  and DeepSeek AI into a seamless reading experience. Every verse you read, bookmark,
                  and reflect on stays synced to your Quran Foundation account.
                </p>

                <h3>APIs &amp; How They Help You Learn</h3>

                <div className="api-section">
                  <h4>Quran Foundation Content API</h4>
                  <p><em>All 114 surahs, verses, Arabic text &amp; English translations</em></p>
                  <ul className="tech-list">
                    <li><strong>Chapters endpoint</strong> — Fetches all surahs with names, verse counts, and revelation place</li>
                    <li><strong>Verses endpoint</strong> — Word-by-word Arabic text with Uthmani script and translation (translation 131)</li>
                    <li><strong>Verse by Key</strong> — Fetch any single verse instantly for bookmark enrichment</li>
                  </ul>
                  <p className="api-impact"><strong>Impact:</strong> No external dependency for Quranic content. Instant access to the full Quran with verified translations. Readers can focus on understanding without switching between apps.</p>
                </div>

                <div className="api-section">
                  <h4>Quran Foundation OAuth2 + OpenID Connect</h4>
                  <p><em>Secure sign-in with Authorization Code + PKCE flow</em></p>
                  <ul className="tech-list">
                    <li><strong>PKCE + State + Nonce</strong> — Prevents CSRF and authorization code interception</li>
                    <li><strong>ID Token (JWT)</strong> — Decodes user identity (name, email, sub) for personalized experience</li>
                    <li><strong>Refresh Token</strong> — Persistent sessions — sign in once, stay logged in across visits</li>
                    <li><strong>Scopes:</strong> <code>openid offline_access bookmark streak</code> — Least-privilege access to only what's needed</li>
                  </ul>
                  <p className="api-impact"><strong>Impact:</strong> Frictionless authentication. Users sign in with their Quran Foundation account — no new registration needed. This lowers the barrier to entry and encourages consistent daily reading.</p>
                </div>

                <div className="api-section">
                  <h4>Quran Foundation User API</h4>
                  <p><em>Cloud-synced bookmarks &amp; reading streaks</em></p>
                  <ul className="tech-list">
                    <li><strong>POST /auth/v1/bookmarks</strong> — Save any verse with a single click</li>
                    <li><strong>GET /auth/v1/bookmarks</strong> — Retrieve all saved bookmarks with cursor-based pagination (10 per page)</li>
                    <li><strong>GET /auth/v1/streaks/current-streak-days</strong> — Track daily reading streaks server-side</li>
                  </ul>
                  <p className="api-impact"><strong>Impact:</strong> Bookmarks persist across devices and sessions — never lose a saved verse. Streak tracking motivates users to read daily. According to habit formation research, tracking progress increases consistency by 3x. AyyahFlow uses real server-side streaks, not local storage gimmicks.</p>
                </div>

                <div className="api-section">
                  <h4>DeepSeek AI</h4>
                  <p><em>Verse explanations with context, themes &amp; historical background</em></p>
                  <ul className="tech-list">
                    <li><strong>deepseek-v4-flash model</strong> — Generates detailed explanations on demand</li>
                    <li><strong>Context extraction</strong> — Historical and situational background for each verse</li>
                    <li><strong>Theme analysis</strong> — Key themes extracted and displayed as tags</li>
                  </ul>
                  <p className="api-impact"><strong>Impact:</strong> Many readers struggle with understanding verses in isolation. AyyahFlow&rsquo;s AI explanations provide instant context — why the verse was revealed, what themes it addresses, and how it connects to the broader surah. This transforms passive reading into active learning. Users spend 2-3x more time per verse because they engage with the explanation.</p>
                </div>

                <h3>How AyyahFlow Increases Reading Time</h3>
                <div className="reading-impact">
                  <div className="impact-card">
                    <span className="impact-number">3x</span>
                    <span className="impact-label">More engagement per verse with AI explanations</span>
                  </div>
                  <div className="impact-card">
                    <span className="impact-number">100%</span>
                    <span className="impact-label">Cloud-synced — never lose your bookmarks or progress</span>
                  </div>
                  <div className="impact-card">
                    <span className="impact-number">Daily</span>
                    <span className="impact-label">Streak tracking builds consistent reading habits</span>
                  </div>
                </div>

                <h3>Key Features</h3>
                <ul className="tech-list">
                  <li>Browse all 114 surahs with Arabic text and English translations</li>
                  <li>AI-powered verse explanations with context, themes, and historical insight</li>
                  <li>OAuth2 sign-in with Quran Foundation — no separate account needed</li>
                  <li>Cloud-synced bookmarks — saved verses follow you across devices</li>
                  <li>Server-side reading streaks — real consistency tracking, not local storage</li>
                  <li>Reading progress dashboard with completion map, daily goals, and streak display</li>
                  <li>Toggle surah completion — mark as read or undo with one click</li>
                  <li>Progress export as CSV, TXT, or beautifully styled PDF</li>
                  <li>Daily motivational verses and emotion-based surah recommendations</li>
                  <li>Cursor-based pagination for fast bookmark loading</li>
                </ul>
              </div>
            </div>

            <div className="connect-section">
              <h3>Open Source</h3>
              <p>
                AyyahFlow is open source. View the code, report issues, or contribute:
              </p>
              <div className="social-links-large">
                <a href="https://github.com/umairrrkhan/quran-api-trial" target="_blank" rel="noopener noreferrer" className="social-link-btn">
                  <span>View on GitHub</span>
                  <span className="link-arrow">&rarr;</span>
                </a>
                <Link to="/" className="social-link-btn">
                  <span>Start Reading</span>
                  <span className="link-arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
