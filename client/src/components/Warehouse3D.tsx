import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Text, Plane, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  zone: 'A' | 'B' | 'C' | 'D';
  position: [number, number, number];
  color: string;
}

interface ZoneData {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  itemCount: number;
  heatmapIntensity: number;
}

// Mock warehouse data - in real app, this comes from API
const warehouseZones: ZoneData[] = [
  { name: 'Zone A - Receiving', position: [-8, 0, -8], size: [6, 0.1, 6], color: '#3B82F6', itemCount: 45, heatmapIntensity: 0.7 },
  { name: 'Zone B - Storage', position: [0, 0, -8], size: [6, 0.1, 6], color: '#10B981', itemCount: 128, heatmapIntensity: 0.9 },
  { name: 'Zone C - Picking', position: [8, 0, -8], size: [6, 0.1, 6], color: '#F59E0B', itemCount: 32, heatmapIntensity: 0.5 },
  { name: 'Zone D - Shipping', position: [-8, 0, 0], size: [6, 0.1, 6], color: '#EF4444', itemCount: 67, heatmapIntensity: 0.6 },
  { name: 'Zone E - Cold Storage', position: [0, 0, 0], size: [6, 0.1, 6], color: '#8B5CF6', itemCount: 23, heatmapIntensity: 0.3 },
  { name: 'Zone F - Hazmat', position: [8, 0, 0], size: [6, 0.1, 6], color: '#F97316', itemCount: 12, heatmapIntensity: 0.4 },
];

const inventoryItems: InventoryItem[] = [
  { id: 1, name: 'Industrial Shelf', sku: 'SHLF-001', quantity: 45, location: 'Zone A-1', zone: 'A', position: [-9, 1, -9], color: '#6366F1' },
  { id: 2, name: 'Forklift Battery', sku: 'BATT-002', quantity: 12, location: 'Zone A-2', zone: 'A', position: [-7, 1, -9], color: '#EF4444' },
  { id: 3, name: 'Pallet Jack', sku: 'JACK-003', quantity: 8, location: 'Zone B-1', zone: 'B', position: [-1, 1, -9], color: '#10B981' },
  { id: 4, name: 'Safety Cones', sku: 'SAFE-004', quantity: 150, location: 'Zone C-1', zone: 'C', position: [7, 1, -9], color: '#F59E0B' },
  { id: 5, name: 'Shipping Boxes', sku: 'BOX-005', quantity: 500, location: 'Zone D-1', zone: 'D', position: [-9, 1, 1], color: '#3B82F6' },
  { id: 6, name: 'Cold Packs', sku: 'COLD-006', quantity: 200, location: 'Zone E-1', zone: 'E', position: [-1, 1, 1], color: '#8B5CF6' },
  { id: 7, name: 'Chemical Storage', sku: 'HAZ-007', quantity: 15, location: 'Zone F-1', zone: 'F', position: [7, 1, 1], color: '#F97316' },
];

// Zone Floor Component with Heatmap
function ZoneFloor({ zone, onClick, isSelected }: { zone: ZoneData; onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const heatmapColor = useMemo(() => {
    const intensity = zone.heatmapIntensity;
    const r = Math.floor(255 * intensity);
    const g = Math.floor(255 * (1 - intensity));
    const b = 50;
    return new THREE.Color(`rgb(${r}, ${g}, ${b})`);
  }, [zone.heatmapIntensity]);

  return (
    <group>
      {/* Zone Base */}
      <Box
        ref={meshRef}
        args={zone.size}
        position={zone.position}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial 
          color={isSelected ? '#FBBF24' : '#1E293B'} 
          transparent
          opacity={0.8}
          emissive={isSelected ? '#F59E0B' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Box>
      
      {/* Heatmap Overlay */}
      <Plane
        args={[zone.size[0] - 0.2, zone.size[2] - 0.2]}
        position={[zone.position[0], zone.position[1] + 0.06, zone.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={heatmapColor}
          transparent
          opacity={0.4}
          emissive={heatmapColor}
          emissiveIntensity={0.2}
        />
      </Plane>

      {/* Zone Label */}
      <Text
        position={[zone.position[0], zone.position[1] + 0.5, zone.position[2]]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {zone.name.split(' - ')[0]}
      </Text>

      {/* Item Count Badge */}
      <Html
        position={[zone.position[0], zone.position[1] + 0.8, zone.position[2]]}
        center
        distanceFactor={10}
      >
        <div className="bg-slate-900 text-white px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg border border-slate-700">
          {zone.itemCount} items
        </div>
      </Html>
    </group>
  );
}

// Inventory Item Box Component
function InventoryBox({ item, onClick, isSelected }: { item: InventoryItem; onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.1;
    } else if (meshRef.current) {
      meshRef.current.rotation.y = 0;
      meshRef.current.position.y = item.position[1];
    }
  });

  const boxSize = Math.max(0.3, Math.min(0.8, item.quantity / 100));

  return (
    <group>
      <Box
        ref={meshRef}
        args={[boxSize, boxSize, boxSize]}
        position={item.position}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <meshStandardMaterial 
          color={item.color} 
          emissive={isSelected ? item.color : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </Box>

      {/* Item Label */}
      {isSelected && (
        <Html
          position={[item.position[0], item.position[1] + 1, item.position[2]]}
          center
          distanceFactor={8}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white text-slate-900 p-3 rounded-xl shadow-2xl whitespace-nowrap border border-slate-200 min-w-[200px]"
          >
            <p className="font-bold text-sm">{item.name}</p>
            <p className="text-xs text-slate-500">{item.sku}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">
                {item.quantity} units
              </span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                {item.location}
              </span>
            </div>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// Robot/Worker Animation
function MovingRobot() {
  const robotRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (robotRef.current) {
      const t = state.clock.elapsedTime * 0.3;
      robotRef.current.position.x = Math.sin(t) * 6;
      robotRef.current.position.z = Math.cos(t * 0.7) * 6;
      robotRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={robotRef} position={[0, 0.5, 0]}>
      {/* Robot Body */}
      <Box args={[0.6, 0.4, 0.8]}>
        <meshStandardMaterial color="#F59E0B" />
      </Box>
      {/* Robot Light */}
      <Box args={[0.2, 0.1, 0.1]} position={[0, 0.3, 0.4]}>
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.8} />
      </Box>
      {/* Robot Wheels */}
      <Box args={[0.1, 0.2, 0.2]} position={[-0.35, -0.2, 0.3]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.1, 0.2, 0.2]} position={[0.35, -0.2, 0.3]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.1, 0.2, 0.2]} position={[-0.35, -0.2, -0.3]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.1, 0.2, 0.2]} position={[0.35, -0.2, -0.3]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  );
}

// Main 3D Scene
function Scene({ selectedZone, setSelectedZone, selectedItem, setSelectedItem }: {
  selectedZone: ZoneData | null;
  setSelectedZone: (z: ZoneData | null) => void;
  selectedItem: InventoryItem | null;
  setSelectedItem: (i: InventoryItem | null) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#6366F1" />
      
      {/* Floor Grid */}
      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#0F172A" />
      </Plane>
      
      {/* Grid Lines */}
      <gridHelper args={[30, 30, '#1E293B', '#1E293B']} position={[0, 0, 0]} />

      {/* Warehouse Zones */}
      {warehouseZones.map((zone) => (
        <ZoneFloor
          key={zone.name}
          zone={zone}
          onClick={() => {
            setSelectedZone(selectedZone?.name === zone.name ? null : zone);
            setSelectedItem(null);
          }}
          isSelected={selectedZone?.name === zone.name}
        />
      ))}

      {/* Inventory Items */}
      {inventoryItems.map((item) => (
        <InventoryBox
          key={item.id}
          item={item}
          onClick={() => {
            setSelectedItem(selectedItem?.id === item.id ? null : item);
            setSelectedZone(null);
          }}
          isSelected={selectedItem?.id === item.id}
        />
      ))}

      {/* Autonomous Robot */}
      <MovingRobot />

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.5}
      />
    </>
  );
}

// Legend Component
function HeatmapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
      <h4 className="text-white font-bold text-sm mb-3">Zone Activity Heatmap</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-xs text-slate-300">High Activity (&gt;100 items)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-xs text-slate-300">Medium Activity (50-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-xs text-slate-300">Low Activity (&lt;50 items)</span>
        </div>
      </div>
    </div>
  );
}

// Stats Panel
function StatsPanel({ selectedZone, selectedItem }: { selectedZone: ZoneData | null; selectedItem: InventoryItem | null }) {
  return (
    <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl w-64">
      <h4 className="text-white font-bold text-sm mb-3">Live Warehouse Stats</h4>
      
      {selectedItem ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Selected Item</p>
          <p className="text-white font-bold">{selectedItem.name}</p>
          <p className="text-xs text-slate-300">{selectedItem.sku}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-indigo-500 text-white px-2 py-1 rounded text-xs font-bold">
              {selectedItem.quantity} units
            </span>
          </div>
        </div>
      ) : selectedZone ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Selected Zone</p>
          <p className="text-white font-bold">{selectedZone.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold">
              {selectedZone.itemCount} items
            </span>
            <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
              {Math.round(selectedZone.heatmapIntensity * 100)}% capacity
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Total Zones:</span>
            <span className="font-bold text-white">6</span>
          </div>
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="font-bold text-white">307</span>
          </div>
          <div className="flex justify-between">
            <span>Active Robots:</span>
            <span className="font-bold text-emerald-400">1</span>
          </div>
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span className="font-bold text-white">Just now</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export const Warehouse3D: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Scene
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <HeatmapLegend />
      <StatsPanel selectedZone={selectedZone} selectedItem={selectedItem} />
      
      {/* Controls Hint */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400">
          🖱️ Left Click: Select • 🖱️ Right Click: Pan • 🖱️ Scroll: Zoom
        </p>
      </div>
    </div>
  );
};

export default Warehouse3D;
