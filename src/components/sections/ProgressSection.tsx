import React from 'react';
import { motion } from 'framer-motion';
import Heatmap from '../Heatmap';
import ProgressPot from '../ProgressPot';
import { useProgress } from '../../context/ProgressContext';

const ProgressSection: React.FC = () => {
  const { progress, completedCount, recentActivity } = useProgress();

  return (
    <section className="progress-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Your Journey</h2>
          <p className="section-subtitle">
            Track your Quran reading progress and build your daily habit
          </p>
        </motion.div>

        <div className="progress-layout">
          <motion.div
            className="progress-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProgressPot
              progress={progress}
              completedCount={completedCount}
              totalCount={114}
            />
          </motion.div>

          <motion.div
            className="progress-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Heatmap data={recentActivity} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;
