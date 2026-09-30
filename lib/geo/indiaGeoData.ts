// Indian Geospatial Features for Map Layers
// State boundaries, rivers, major cities, weather stations, and physiographic regions

export interface GeoPoint {
  id: string;
  name: string;
  state?: string;
  lon: number;
  lat: number;
  type?: string;
}

export interface GeoPolyline {
  id: string;
  name: string;
  color?: string;
  path: [number, number][]; // [lon, lat][]
}

export interface GeoPolygon {
  id: string;
  name: string;
  color: [number, number, number, number];
  polygon: [number, number][];
}

// ─── Major Indian Cities ──────────────────────────────────────────
export const MAJOR_CITIES: GeoPoint[] = [
  { id: "delhi", name: "New Delhi", state: "Delhi", lon: 77.209, lat: 28.6139, type: "capital" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lon: 72.8777, lat: 19.076, type: "metro" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lon: 88.3639, lat: 22.5726, type: "metro" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lon: 80.2707, lat: 13.0827, type: "metro" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lon: 77.5946, lat: 12.9716, type: "metro" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lon: 78.4867, lat: 17.385, type: "metro" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lon: 72.5714, lat: 23.0225, type: "city" },
  { id: "pune", name: "Pune", state: "Maharashtra", lon: 73.8567, lat: 18.5204, type: "city" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lon: 75.7873, lat: 26.9124, type: "city" },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lon: 80.9462, lat: 26.8467, type: "city" },
  { id: "patna", name: "Patna", state: "Bihar", lon: 85.1376, lat: 25.5941, type: "city" },
  { id: "guwahati", name: "Guwahati", state: "Assam", lon: 91.7362, lat: 26.1445, type: "city" },
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", lon: 78.0322, lat: 30.3165, type: "city" },
  { id: "srinagar", name: "Srinagar", state: "Jammu & Kashmir", lon: 74.7973, lat: 34.0837, type: "city" },
  { id: "kochi", name: "Kochi", state: "Kerala", lon: 76.2673, lat: 9.9312, type: "city" },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lon: 77.4126, lat: 23.2599, type: "city" },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", lon: 85.8245, lat: 20.2961, type: "city" },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", lon: 77.1734, lat: 31.1048, type: "city" },
];

// ─── IMD Weather Stations & Doppler Radars ───────────────────────
export const WEATHER_STATIONS: GeoPoint[] = [
  { id: "imd-ddn", name: "Dehradun DWR", state: "Uttarakhand", lon: 78.04, lat: 30.33, type: "DWR" },
  { id: "imd-del", name: "Delhi Safdarjung AWS", state: "Delhi", lon: 77.21, lat: 28.58, type: "AWS" },
  { id: "imd-bom", name: "Mumbai Colaba DWR", state: "Maharashtra", lon: 72.82, lat: 18.90, type: "DWR" },
  { id: "imd-ccu", name: "Kolkata Alipore DWR", state: "West Bengal", lon: 88.33, lat: 22.53, type: "DWR" },
  { id: "imd-maa", name: "Chennai Meenambakkam", state: "Tamil Nadu", lon: 80.18, lat: 12.99, type: "DWR" },
  { id: "imd-cok", name: "Kochi Coastal Radar", state: "Kerala", lon: 76.27, lat: 9.95, type: "DWR" },
  { id: "imd-gau", name: "Guwahati Borjhar DWR", state: "Assam", lon: 91.58, lat: 26.11, type: "DWR" },
  { id: "imd-srx", name: "Srinagar Observatory", state: "Jammu & Kashmir", lon: 74.83, lat: 34.09, type: "AWS" },
  { id: "imd-jpr", name: "Jaipur DWR", state: "Rajasthan", lon: 75.81, lat: 26.82, type: "DWR" },
  { id: "imd-bpl", name: "Bhopal Central AWS", state: "Madhya Pradesh", lon: 77.42, lat: 23.28, type: "AWS" },
  { id: "imd-hyd", name: "Hyderabad Begumpet DWR", state: "Telangana", lon: 78.47, lat: 17.45, type: "DWR" },
];

// ─── Major Rivers & Basins ────────────────────────────────────────
export const MAJOR_RIVERS: GeoPolyline[] = [
  {
    id: "ganga",
    name: "Ganga",
    color: "#4a90e2",
    path: [
      [79.0, 31.0], [78.6, 30.1], [78.2, 29.9], [80.3, 26.5], [81.8, 25.4],
      [83.0, 25.3], [85.1, 25.6], [87.5, 25.3], [88.1, 24.8], [88.4, 22.5]
    ],
  },
  {
    id: "brahmaputra",
    name: "Brahmaputra",
    color: "#3a88d8",
    path: [
      [95.3, 28.1], [94.9, 27.5], [92.8, 26.6], [91.7, 26.2], [90.5, 26.1], [89.7, 25.2]
    ],
  },
  {
    id: "yamuna",
    name: "Yamuna",
    color: "#5ca0f2",
    path: [
      [78.4, 31.0], [77.3, 30.4], [77.2, 28.6], [77.7, 27.2], [78.0, 27.1], [81.8, 25.4]
    ],
  },
  {
    id: "godavari",
    name: "Godavari",
    color: "#4084d0",
    path: [
      [73.5, 19.9], [75.3, 19.8], [77.1, 19.1], [79.9, 18.8], [81.0, 17.5], [81.8, 16.7]
    ],
  },
  {
    id: "krishna",
    name: "Krishna",
    color: "#367ac8",
    path: [
      [73.7, 17.9], [74.5, 16.8], [76.5, 16.2], [78.0, 16.4], [80.0, 16.5], [80.9, 15.8]
    ],
  },
  {
    id: "narmada",
    name: "Narmada",
    color: "#4a90e2",
    path: [
      [81.7, 22.7], [79.9, 23.1], [77.7, 22.5], [75.3, 22.1], [73.0, 21.6]
    ],
  },
  {
    id: "tapi",
    name: "Tapi",
    color: "#5098ea",
    path: [
      [78.3, 21.8], [76.2, 21.4], [74.8, 21.2], [72.8, 21.1]
    ],
  },
  {
    id: "mahanadi",
    name: "Mahanadi",
    color: "#4288d6",
    path: [
      [81.9, 21.2], [83.5, 21.4], [84.9, 20.9], [85.9, 20.4], [86.7, 20.3]
    ],
  },
  {
    id: "kaveri",
    name: "Kaveri",
    color: "#387cc8",
    path: [
      [75.5, 12.4], [76.5, 12.3], [77.7, 12.1], [78.7, 11.1], [79.8, 11.1]
    ],
  },
];

// ─── Indian State Outline Polylines (Simplifed for clean rendering) ─
export const STATE_OUTLINES: GeoPolyline[] = [
  // Northern boundary
  { id: "north-1", name: "Himalayan Arc", color: "rgba(0, 212, 255, 0.45)", path: [[74.0, 35.5], [76.5, 34.5], [78.5, 32.5], [80.5, 30.5], [81.5, 29.5], [88.0, 27.5], [92.0, 27.8], [97.0, 28.2]] },
  // Western coast
  { id: "west-coast", name: "Western Coastline", color: "rgba(0, 212, 255, 0.5)", path: [[68.7, 23.7], [70.0, 21.0], [72.8, 21.1], [72.8, 18.9], [73.8, 15.5], [75.0, 13.0], [76.2, 10.0], [77.5, 8.1]] },
  // Eastern coast
  { id: "east-coast", name: "Eastern Coastline", color: "rgba(0, 212, 255, 0.5)", path: [[77.5, 8.1], [79.8, 10.3], [80.3, 13.1], [82.2, 16.9], [85.0, 19.5], [87.0, 21.5], [89.0, 21.8]] },
  // Northwest border
  { id: "northwest", name: "NW Border", color: "rgba(0, 212, 255, 0.4)", path: [[68.7, 23.7], [70.5, 27.0], [72.0, 28.5], [74.5, 31.5], [74.8, 34.0], [74.0, 35.5]] },
  // Central division lines
  { id: "trough-line", name: "Monsoon Trough Axis", color: "rgba(255, 212, 0, 0.4)", path: [[73.0, 28.0], [77.0, 26.5], [82.0, 24.5], [87.0, 22.5], [89.0, 21.5]] },
  // Western Ghats ridge
  { id: "w-ghats", name: "Western Ghats Escarpment", color: "rgba(34, 214, 138, 0.5)", path: [[73.5, 20.5], [73.6, 18.5], [74.2, 15.8], [75.2, 13.5], [76.5, 10.5], [77.3, 8.5]] },
];

// ─── Physiographic Regions ─────────────────────────────────────────
export const PHYSIOGRAPHIC_REGIONS: GeoPolygon[] = [
  {
    id: "himalayas",
    name: "Northern Himalayan Region",
    color: [0, 180, 255, 30],
    polygon: [
      [74.0, 35.5], [78.5, 32.5], [81.0, 30.5], [88.5, 27.5], [96.5, 28.0],
      [95.5, 26.5], [89.0, 26.5], [80.5, 29.0], [76.0, 31.5], [73.5, 34.0], [74.0, 35.5]
    ],
  },
  {
    id: "igp",
    name: "Indo-Gangetic Plains",
    color: [34, 214, 138, 25],
    polygon: [
      [74.5, 31.0], [77.5, 29.0], [84.0, 26.5], [88.5, 25.0], [89.0, 22.5],
      [86.0, 23.5], [80.0, 24.5], [76.0, 27.0], [74.5, 31.0]
    ],
  },
  {
    id: "peninsular",
    name: "Peninsular Deccan Plateau",
    color: [245, 166, 35, 25],
    polygon: [
      [74.0, 21.0], [78.5, 22.0], [84.0, 20.5], [80.5, 13.5], [77.5, 9.0],
      [76.0, 11.5], [74.5, 15.0], [73.8, 18.5], [74.0, 21.0]
    ],
  },
  {
    id: "thar",
    name: "Thar Desert / Arid NW",
    color: [255, 180, 50, 25],
    polygon: [
      [69.5, 27.5], [73.0, 28.5], [75.0, 26.5], [73.5, 24.5], [70.0, 24.5], [69.5, 27.5]
    ],
  },
];
