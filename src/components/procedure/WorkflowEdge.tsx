import React from 'react';

interface WorkflowEdgeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive: boolean;
  isCompleted: boolean;
  label?: string;
}

export const WorkflowEdgeComponent: React.FC<WorkflowEdgeProps> = ({
  startX,
  startY,
  endX,
  endY,
  isActive,
  isCompleted,
  label
}) => {
  // Compute mid point
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Path string
  const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

  return (
    <g className="transition-all duration-300">
      {/* Background Line */}
      <path
        d={pathData}
        fill="none"
        stroke={isActive ? '#06b6d4' : isCompleted ? '#10b981' : '#334155'}
        strokeWidth={isActive ? '3' : '2'}
        strokeDasharray={isActive ? '6 6' : undefined}
        className={isActive ? 'animate-[dash_1s_linear_infinite]' : undefined}
      />

      {/* Pulsing glow line when active */}
      {isActive && (
        <path
          d={pathData}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="6"
          strokeOpacity="0.3"
          filter="blur(3px)"
        />
      )}

      {/* Label bubble if present */}
      {label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x="-36"
            y="-10"
            width="72"
            height="20"
            rx="6"
            fill="#0f172a"
            stroke={isActive ? '#22d3ee' : '#475569'}
            strokeWidth="1"
          />
          <text
            x="0"
            y="3"
            fill={isActive ? '#38bdf8' : '#94a3b8'}
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};
