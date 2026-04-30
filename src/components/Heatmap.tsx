import React, { useMemo } from 'react';
import HeatMap from '@uiw/react-heat-map';
import type { DailyActivity } from '../types/quran';

interface HeatmapProps {
  data: DailyActivity[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const { value, startDate } = useMemo(() => {
    const today = new Date();

    const start = new Date(today);
    start.setDate(start.getDate() - 371);

    const active = data.filter((d) => d.count > 0).map((d) => ({
      date: d.date.replace(/-/g, '/'),
      count: d.count,
    }));

    return { value: active, startDate: start };
  }, [data]);

  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <div className="heatmap-header-left">
          <h3>Activity</h3>
          <span className="heatmap-subtitle">365-day heatmap</span>
        </div>
        <div className="heatmap-header-right">
          <span className="heatmap-active-days">
            {value.length} active day{value.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="heatmap-wrapper">
        <HeatMap
          value={value}
          width={700}
          startDate={startDate}
          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          rectProps={{ rx: 4 }}
          panelColors={['#FFFFFF', '#FEF3C7', '#FCD34D', '#F59E0B', '#D97706', '#B45309']}
          style={{
            '--rhm-rect': '#FFFFFF',
            '--rhm-rect-active': '#D4AF37',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            color: '#94A3B8',
          } as React.CSSProperties}
          rectRender={(props, item) => {
            const count = item.count || 0;
            const date = new Date(item.date.replace(/\//g, '-'));
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const tooltip = count > 0 ? `${day} ${month} · ${count}` : `${day} ${month}`;
            return (
              <rect {...(props as any)}>
                <title>{tooltip}</title>
              </rect>
            );
          }}
        />
      </div>
      <div className="heatmap-footer">
        <span className="heatmap-legend-label">Less</span>
        <div className="heatmap-legend">
          <div className="legend-cell" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }} />
          <div className="legend-cell" style={{ background: '#FEF3C7' }} />
          <div className="legend-cell" style={{ background: '#FCD34D' }} />
          <div className="legend-cell" style={{ background: '#F59E0B' }} />
          <div className="legend-cell" style={{ background: '#D97706' }} />
          <div className="legend-cell" style={{ background: '#B45309' }} />
        </div>
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
};

export default Heatmap;
