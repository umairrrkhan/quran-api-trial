import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProgressPotProps {
  progress: number;
  completedCount: number;
  totalCount: number;
}

const ProgressPot: React.FC<ProgressPotProps> = ({
  progress,
  completedCount,
  totalCount,
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 70 + Math.sin(i * 1.2) * 35,
        delay: i * 0.4,
        size: 2 + (i % 3),
      })),
    []
  );

  const clipY = 225 - (progress / 100) * 185;

  return (
    <div className="progress-pot-container">
      <div className="pot-ambient-glow" />
      <div className="progress-pot">
        <svg
          className="pot-svg"
          viewBox="0 0 200 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="potFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8962E" />
            </linearGradient>
            <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8F9FC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8962E" />
            </linearGradient>
            <filter id="potGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ambientGlow">
              <feGaussianBlur stdDeviation="12" />
            </filter>
            <clipPath id="potShape">
              <path d="M60 115 C58 85, 55 65, 58 48 C62 28, 80 22, 100 22 C120 22, 138 28, 142 48 C145 65, 142 85, 140 115 L145 195 C147 215, 135 225, 100 225 C65 225, 53 215, 55 195 Z" />
            </clipPath>
          </defs>

          <path
            d="M60 115 C58 85, 55 65, 58 48 C62 28, 80 22, 100 22 C120 22, 138 28, 142 48 C145 65, 142 85, 140 115 L145 195 C147 215, 135 225, 100 225 C65 225, 53 215, 55 195 Z"
            fill="url(#potBody)"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1.5"
          />

          <rect
            x="52"
            y="18"
            width="96"
            height="16"
            rx="8"
            fill="url(#potRim)"
            stroke="rgba(212,175,55,0.3)"
            strokeWidth="1"
          />

          <rect
            x="56"
            y="34"
            width="88"
            height="3"
            rx="1.5"
            fill="rgba(212,175,55,0.15)"
          />

          <g clipPath="url(#potShape)">
            <motion.rect
              x="40"
              y={clipY}
              width="120"
              height={225 - clipY}
              fill="url(#potFill)"
              initial={{ y: 225 }}
              animate={{ y: clipY }}
              transition={{ duration: 1.8, ease: [0.22, 0.61, 0.36, 1] }}
            />

            {progress > 0 && (
              <motion.rect
                x="40"
                y={clipY}
                width="120"
                height="4"
                fill="#FEF3C7"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                filter="url(#potGlow)"
              />
            )}

            {particles.map((p) => (
              <motion.circle
                key={p.id}
                cx={p.x}
                cy={clipY + 10 + p.id * 5}
                r={p.size}
                fill="#FCD34D"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  y: [-30, -80 + p.id * 5],
                }}
                transition={{
                  duration: 2.5 + p.id * 0.3,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </g>

          <path
            d="M60 115 C58 85, 55 65, 58 48 C62 28, 80 22, 100 22 C120 22, 138 28, 142 48 C145 65, 142 85, 140 115 L145 195 C147 215, 135 225, 100 225 C65 225, 53 215, 55 195 Z"
            fill="none"
            stroke="rgba(212,175,55,0.2)"
            strokeWidth="1"
          />

          {progress >= 100 && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
            >
              <foreignObject x="45" y="100" width="110" height="50">
                <div className="pot-complete-badge">✦ Complete ✦</div>
              </foreignObject>
            </motion.g>
          )}
        </svg>

        <div className="pot-stats">
          <motion.span
            className="pot-percentage"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
          >
            {progress}%
          </motion.span>
          <motion.span
            className="pot-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {completedCount} of {totalCount} Surahs
          </motion.span>
          <motion.div
            className="pot-progress-track"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div
              className="pot-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPot;
