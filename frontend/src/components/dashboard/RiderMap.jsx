import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, Navigation, Crosshair, Fuel, Wrench, ShieldAlert } from 'lucide-react';

/**
 * Component to smoothly animate/pan the map whenever center coordinates update
 */
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

/**
 * Custom Leaflet DivIcons with Tailwind CSS Neon Glow
 */
const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(6, 182, 212, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background: rgba(6, 182, 212, 0.3); border: 2px solid #22D3EE;"></span>
        <span style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 14px #06B6D4;"></span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

const createCenterIcon = (name) =>
  L.divIcon({
    className: 'custom-center-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 12px; border: 2px solid #FCD34D; box-shadow: 0 0 16px rgba(245, 158, 11, 0.65); color: #080B12; font-size: 15px;">
        🔧
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

const createFuelStationIcon = () =>
  L.divIcon({
    className: 'custom-fuel-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10B981, #059669); border-radius: 12px; border: 2px solid #6EE7B7; box-shadow: 0 0 16px rgba(16, 185, 129, 0.65); color: #080B12; font-size: 15px;">
        ⛽
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

const RiderMap = ({
  userCoords,
  serviceCenters = [],
  fuels = [],
  onSelectLocation,
  onRecenter,
}) => {
  const centerLat = userCoords?.lat || 23.9315;
  const centerLng = userCoords?.lng || 90.2707;
  const centerPos = [centerLat, centerLng];

  // Additional realistic fuel stations around Ashulia/Dhaka for the interactive map
  const fuelPumps = [
    {
      id: 'fp-1',
      name: 'Padma Oil Fuel Station (Baipail Bypass)',
      address: 'Dhaka-Tangail Highway, Ashulia, Dhaka',
      contactNumber: '+8801711223344',
      lat: 23.935,
      lng: 90.274,
      fuelsAvailable: 'Octane, Petrol, Diesel',
    },
    {
      id: 'fp-2',
      name: 'Meghna Petroleum Hub (Savar)',
      address: 'Savar Cantonment Road, Savar, Dhaka',
      contactNumber: '+8801711334455',
      lat: 23.86,
      lng: 90.265,
      fuelsAvailable: 'Octane, Petrol',
    },
    {
      id: 'fp-3',
      name: 'Jamuna Oil Express (Uttara)',
      address: 'Airport Road, Sector 8, Uttara, Dhaka',
      contactNumber: '+8801711445566',
      lat: 23.87,
      lng: 90.395,
      fuelsAvailable: 'Octane, Diesel',
    },
  ];

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass-card">
      
      {/* Top Map Status Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-[#080B12]/85 backdrop-blur-md border border-white/15 text-xs text-slate-200 font-mono flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Live GPS: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080B12]/85 backdrop-blur-md border border-white/15 text-xs text-slate-300 font-mono pointer-events-auto shadow-lg">
          <span className="text-amber-400">🔧 {serviceCenters.length} Garages</span>
          <span>•</span>
          <span className="text-emerald-400">⛽ {fuelPumps.length} Fuel Pumps</span>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        type="button"
        onClick={onRecenter}
        title="Recenter to my live GPS coordinates"
        className="absolute top-4 right-4 z-[1000] p-2.5 rounded-xl bg-[#080B12]/90 hover:bg-amber-500 hover:text-slate-950 backdrop-blur-md border border-white/15 text-slate-200 transition-all shadow-xl group"
      >
        <Crosshair className="w-5 h-5 text-cyan-400 group-hover:text-slate-950 transition-colors" />
      </button>

      {/* Leaflet MapContainer with CartoDB Dark Matter Tiles */}
      <MapContainer
        center={centerPos}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapUpdater center={centerPos} />

        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* 1. User Live GPS Marker */}
        <Marker position={centerPos} icon={createUserIcon()}>
          <Popup className="dark-leaflet-popup">
            <div className="p-2 text-slate-900 font-sans">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 uppercase font-mono">
                <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                <span>Your Live Position</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                Rider Beacon Active
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Coords: {centerLat.toFixed(5)}, {centerLng.toFixed(5)}
              </p>
              <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                ✓ Ready for Fuel Dispatch & Rescue SOS
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 2. Service Centers from MongoDB Atlas */}
        {serviceCenters.map((center) => (
          <Marker
            key={center._id}
            position={[center.lat, center.lng]}
            icon={createCenterIcon(center.name)}
          >
            <Popup className="dark-leaflet-popup">
              <div className="p-2 text-slate-900 font-sans min-w-[210px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase font-mono">
                  <span>🔧 Certified Rescue Hub</span>
                </div>
                <h4 className="font-bold text-sm text-slate-950 mt-1 leading-snug">
                  {center.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                  <span>📍 {center.address}</span>
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`tel:${center.contactNumber}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-200 px-2.5 py-1 rounded-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{center.contactNumber}</span>
                  </a>
                  {onSelectLocation && (
                    <button
                      onClick={() => onSelectLocation(center.lat, center.lng, center.name)}
                      className="text-[11px] font-mono text-cyan-700 hover:underline font-semibold"
                    >
                      Pin here
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Nearby Petrol Pumps */}
        {fuelPumps.map((pump) => (
          <Marker
            key={pump.id}
            position={[pump.lat, pump.lng]}
            icon={createFuelStationIcon()}
          >
            <Popup className="dark-leaflet-popup">
              <div className="p-2 text-slate-900 font-sans min-w-[210px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase font-mono">
                  <span>⛽ Authorized Fuel Pump</span>
                </div>
                <h4 className="font-bold text-sm text-slate-950 mt-1 leading-snug">
                  {pump.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  📍 {pump.address}
                </p>
                <p className="text-[11px] font-mono text-slate-700 mt-1 font-semibold">
                  Fuels: {pump.fuelsAvailable}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href={`tel:${pump.contactNumber}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{pump.contactNumber}</span>
                  </a>
                  {onSelectLocation && (
                    <button
                      onClick={() => onSelectLocation(pump.lat, pump.lng, pump.name)}
                      className="text-[11px] font-mono text-cyan-700 hover:underline font-semibold"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RiderMap;
