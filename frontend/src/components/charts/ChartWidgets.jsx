import React from 'react';

/**
 * Enterprise SVG Bar Chart for Grade Distribution
 */
export const GradeDistributionChart = ({ data = [] }) => {
  const maxCount = Math.max(...data.map((d) => d.count || 0), 5);

  return (
    <div style={{ width: '100%', padding: '0.5rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '180px',
          gap: '1.25rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {data.map((item, index) => {
          const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {item.count}
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${Math.max(heightPercent, 4)}%`,
                  background: 'linear-gradient(180deg, #e85d5d 0%, #c02828 100%)',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.6s ease',
                  boxShadow: '0 2px 8px rgba(192, 40, 40, 0.2)'
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            {item.grade || item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Enterprise Performance Radar / Spider Graph for Competency Mapping
 */
export const PerformanceRadar = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No course competency data available
      </div>
    );
  }

  // Calculate polygon points on an SVG canvas (260x260)
  const size = 260;
  const center = size / 2;
  const radius = 90;
  const axes = ['Assignments', 'Quizzes', 'Attendance', 'Overall'];
  const totalAxes = axes.length;

  const getCoordinates = (value, axisIndex) => {
    const angle = (Math.PI * 2 / totalAxes) * axisIndex - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Average competency scores across all courses
  const avgAssignments = Math.round(data.reduce((a, b) => a + (b.assignments || 0), 0) / data.length);
  const avgQuizzes = Math.round(data.reduce((a, b) => a + (b.quizzes || 0), 0) / data.length);
  const avgAttendance = Math.round(data.reduce((a, b) => a + (b.attendance || 0), 0) / data.length);
  const avgOverall = Math.round(data.reduce((a, b) => a + (b.overall || 0), 0) / data.length);

  const values = [avgAssignments, avgQuizzes, avgAttendance, avgOverall];
  const points = values.map((v, i) => {
    const { x, y } = getCoordinates(v, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Radar concentric webs */}
        {[0.25, 0.5, 0.75, 1].map((level, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="var(--border-subtle)"
            strokeDasharray={level < 1 ? '3 3' : 'none'}
          />
        ))}

        {/* Axis spokes */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--border-subtle)"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          fill="rgba(192, 40, 40, 0.2)"
          stroke="#c02828"
          strokeWidth="2.5"
        />

        {/* Data points */}
        {values.map((v, i) => {
          const { x, y } = getCoordinates(v, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#c02828"
              stroke="#ffffff"
              strokeWidth="2"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(118, i);
          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--text-secondary)"
            >
              {axis} ({values[i]}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Donut Metric Progress
 */
export const DonutProgress = ({ value = 75, label = 'Average', size = 120, strokeWidth = 10, color = '#c02828' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}%</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      </div>
    </div>
  );
};
