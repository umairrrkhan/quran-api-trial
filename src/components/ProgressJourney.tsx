import React from 'react';
import { motion } from 'framer-motion';
import './ProgressJourney.css';

interface ProgressJourneyProps {
  progress: number;
}

const ProgressJourney: React.FC<ProgressJourneyProps> = ({ progress }) => {
  const glow = Math.min(progress / 100, 1);
  const msg =
    progress === 0
      ? 'A lamp waiting to be lit. Complete surahs to fill it with light.'
      : progress < 25
        ? 'A faint glow appears. Keep reading, the light grows.'
        : progress < 50
          ? 'The lantern is warming. Halfway to full radiance.'
          : progress < 75
            ? 'Glowing brighter. The light is spreading.'
            : progress < 100
              ? 'Almost fully illuminated. A few more surahs.'
              : 'The lantern is complete. Noor upon noor!';

  return (
    <div className="lantern-container">
      <div className="lantern-header">
        <h3 className="lantern-title">Your Light</h3>
        <p className="lantern-desc">{msg}</p>
      </div>

      <div className="lantern-svg-wrap">
        <svg className="lantern-svg" viewBox="0 0 200 260" fill="none">
          <defs>
            <radialGradient id="innerGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity={0.9 * glow} />
              <stop offset="40%" stopColor="#FCD34D" stopOpacity={0.6 * glow} />
              <stop offset="80%" stopColor="#D4AF37" stopOpacity={0.3 * glow} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="outerGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.25 * glow} />
              <stop offset="60%" stopColor="#D4AF37" stopOpacity={0.08 * glow} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="lightBurst" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity={0.15 * glow} />
              <stop offset="100%" stopColor="#FEF3C7" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="30%" stopColor="#44403C" />
              <stop offset="70%" stopColor="#44403C" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>
            <linearGradient id="metallic" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B8962E" />
              <stop offset="40%" stopColor="#FCD34D" />
              <stop offset="60%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#B8962E" />
            </linearGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="rayBlur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <clipPath id="lanternClip">
              <path d="M75 80 C75 65, 65 60, 60 50 C55 40, 55 35, 60 30 L140 30 C145 35, 145 40, 140 50 C135 60, 125 65, 125 80 L130 190 C132 200, 128 210, 100 210 C72 210, 68 200, 70 190 Z" />
            </clipPath>
          </defs>

          {/* Outer ambient glow */}
          <ellipse
            cx="100"
            cy="130"
            rx={60 + glow * 30}
            ry={70 + glow * 35}
            fill="url(#outerGlow)"
            filter="url(#glowFilter)"
          />

          {/* Light burst rays */}
          <g opacity={0.3 * glow}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const rad = (a * Math.PI) / 180;
              const len = 70 + glow * 40;
              return (
                <motion.line
                  key={`ray-${i}`}
                  x1="100"
                  y1="120"
                  x2={100 + Math.cos(rad) * len}
                  y2={120 + Math.sin(rad) * len}
                  stroke="#FCD34D"
                  strokeWidth="0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 * glow }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                />
              );
            })}
          </g>

          {/* Hanging chain */}
          <motion.path
            d="M100 10 L100 28"
            stroke="#78716C"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Top hook */}
          <motion.path
            d="M95 10 C95 5, 105 5, 105 10"
            stroke="#78716C"
            strokeWidth="2"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Top cap */}
          <motion.path
            d="M55 28 L145 28 L140 38 L60 38 Z"
            fill="url(#metallic)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Top crown */}
          <motion.path
            d="M65 38 L135 38 L130 45 L70 45 Z"
            fill="#44403C"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
          />

          {/* Lantern body */}
          <motion.path
            d="M75 45 C75 40, 60 35, 55 50 C50 60, 65 65, 70 80 L70 190 C68 205, 75 215, 100 215 C125 215, 132 205, 130 190 L130 80 C135 65, 150 60, 145 50 C140 35, 125 40, 125 45 Z"
            fill="url(#bodyGrad)"
            stroke="#57534E"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Lantern inner glow (visible through cutouts) */}
          <g clipPath="url(#lanternClip)">
            <motion.ellipse
              cx="100"
              cy="120"
              rx={35}
              ry={50}
              fill="url(#innerGlow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: glow, scale: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </g>

          {/* Decorative cutout - top arch */}
          <motion.path
            d="M85 60 C85 52, 115 52, 115 60"
            stroke="#57534E"
            strokeWidth="0.8"
            fill="url(#innerGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          {/* Decorative cutout - middle diamond */}
          <motion.path
            d="M85 90 L100 75 L115 90 L100 105 Z"
            stroke="#57534E"
            strokeWidth="0.8"
            fill="url(#innerGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Decorative cutout - middle diamond 2 */}
          <motion.path
            d="M88 120 L100 108 L112 120 L100 132 Z"
            stroke="#57534E"
            strokeWidth="0.8"
            fill="url(#innerGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />

          {/* Decorative cutout - bottom pattern */}
          <motion.path
            d="M85 148 C85 140, 115 140, 115 148"
            stroke="#57534E"
            strokeWidth="0.8"
            fill="url(#innerGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.9 }}
          />

          {/* Side cutouts */}
          <motion.circle
            cx="76"
            cy="110"
            r="4"
            fill="url(#innerGlow)"
            stroke="#57534E"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />
          <motion.circle
            cx="124"
            cy="110"
            r="4"
            fill="url(#innerGlow)"
            stroke="#57534E"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: glow }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />

          {/* Small decorative dots on body */}
          {[
            [100, 50],
            [90, 50],
            [110, 50],
            [100, 47],
          ].map(([dx, dy], i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={dx}
              cy={dy}
              r="1"
              fill="#D4AF37"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}

          {/* Bottom crown */}
          <motion.path
            d="M68 190 L132 190 L130 200 L70 200 Z"
            fill="#44403C"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Bottom cap */}
          <motion.path
            d="M65 200 L135 200 L130 210 L70 210 Z"
            fill="url(#metallic)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
          />

          {/* Bottom tassel */}
          <motion.line
            x1="100"
            y1="210"
            x2="100"
            y2="225"
            stroke="#A8A29E"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.circle
            cx="100"
            cy="228"
            r="3"
            fill="#D4AF37"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
          />

          {/* Light spill at bottom */}
          {glow > 0 && (
            <motion.ellipse
              cx="100"
              cy="235"
              rx={10 + glow * 20}
              ry={3 + glow * 5}
              fill="#FCD34D"
              opacity={0.15 * glow}
              filter="url(#softGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 * glow }}
              transition={{ duration: 2 }}
            />
          )}

          {/* Completion celebration */}
          {progress >= 100 && (
            <>
              <motion.circle
                cx="100"
                cy="120"
                r="55"
                fill="url(#lightBurst)"
                filter="url(#glowFilter)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              {[78, 90, 100, 110, 122].map((sx, i) => (
                <motion.text
                  key={`star-${i}`}
                  x={sx}
                  y={-5 + i * 4}
                  textAnchor="middle"
                  fill="#FFD700"
                  fontSize="9"
                  filter="url(#softGlow)"
                  animate={{
                    y: [-5 + i * 4, -12 + i * 4, -5 + i * 4],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  ★
                </motion.text>
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="lantern-progress">
        <div className="lantern-track">
          <motion.div
            className="lantern-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <span className="lantern-pct">{progress}%</span>
      </div>

      <div className="lantern-stages">
        <div className={`ls ${progress >= 15 ? 'lit' : ''}`}>
          <div className="ls-dot" />
          <span className="ls-label">Spark</span>
        </div>
        <div className={`ls ${progress >= 35 ? 'lit' : ''}`}>
          <div className="ls-dot" />
          <span className="ls-label">Glow</span>
        </div>
        <div className={`ls ${progress >= 60 ? 'lit' : ''}`}>
          <div className="ls-dot" />
          <span className="ls-label">Warm</span>
        </div>
        <div className={`ls ${progress >= 85 ? 'lit' : ''}`}>
          <div className="ls-dot" />
          <span className="ls-label">Bright</span>
        </div>
        <div className={`ls ${progress >= 100 ? 'lit' : ''}`}>
          <div className="ls-dot" />
          <span className="ls-label">Noor ✦</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressJourney;
