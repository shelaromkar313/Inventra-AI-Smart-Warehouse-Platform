import React from 'react';

// Dummy data for heatmap (replace with real data from API)
const dummyHeatmapData = [
  [5, 2, 0, 1, 3],
  [1, 0, 4, 2, 1],
  [0, 3, 2, 5, 0],
  [2, 1, 0, 3, 4],
  [3, 2, 1, 0, 2],
];

const getColor = (value: number) => {
  // Simple color scale: 0 (white) to 5 (red)
  const colors = ['#fff', '#ffe5e5', '#ffb3b3', '#ff8080', '#ff4d4d', '#ff1a1a'];
  return colors[Math.min(value, colors.length - 1)];
};

const InventoryHeatmap: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Heatmap</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dummyHeatmapData[0].length}, 40px)`, gap: 4 }}>
        {dummyHeatmapData.flat().map((value, idx) => (
          <div
            key={idx}
            style={{
              width: 40,
              height: 40,
              background: getColor(value),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ccc',
              fontWeight: 'bold',
            }}
          >
            {value}
          </div>
        ))}
      </div>
      <p style={{marginTop: 10, color: '#888'}}>Darker = more inventory</p>
    </div>
  );
};

export default InventoryHeatmap;
