import React, { useState, useEffect } from 'react';
import { publicService } from '../services/api';
import { MapPin, Phone, Navigation, Shield, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceCentersSection = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await publicService.getServiceCenters();
        const data = res.data?.data || res.data || [];
        setCenters(data);
      } catch (err) {
        console.warn('Using fallback service centers:', err.message);
        setCenters([
          {
            _id: '1',
            name: 'Ashulia Highway Rescue & Service',
            contactNumber: '+8801711122233',
            address: 'Baipail Bypass, Ashulia, Dhaka',
            lat: 23.9315,
            lng: 90.2707,
          },
          {
            _id: '2',
            name: 'Savar Rider Helpdesk & Garage',
            contactNumber: '+8801722233344',
            address: 'Nabinagar Bus Stand, Savar, Dhaka',
            lat: 23.9142,
            lng: 90.2602,
          },
          {
            _id: '3',
            name: 'Uttara Quick Response Hub',
            contactNumber: '+8801733344455',
            address: 'Sector 11, Uttara, Dhaka',
            lat: 23.8759,
            lng: 90.3795,
          },
          {
            _id: '4',
            name: 'Mirpur Emergency Moto Care',
            contactNumber: '+8801744455566',
            address: 'Mirpur 10 Roundabout, Dhaka',
            lat: 23.8069,
            lng: 90.3687,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  return (
    <section id="service-centers" className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-2">
              <Compass className="w-3.5 h-3.5" />
              PHYSICAL SERVICE INFRASTRUCTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Ashulia & Dhaka <span className="text-cyan-400">Rescue Hubs</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Strategically placed rapid intervention garages equipped with recovery flatbeds, 
              certified mechanics, and reserve fuel tanks.
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            4 Active Hub Stations
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {centers.map((center, idx) => (
            <motion.div
              key={center._id || idx}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    Hub #{idx + 1}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  {center.name}
                </h4>

                <p className="text-xs text-slate-300 mb-3 flex items-start gap-1.5 leading-relaxed">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </p>

                <div className="text-[11px] font-mono text-slate-400 mb-4 bg-white/5 p-2 rounded-lg border border-white/5">
                  GPS: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`tel:${center.contactNumber}`}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-semibold text-xs border border-white/10 hover:border-cyan-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{center.contactNumber}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceCentersSection;
