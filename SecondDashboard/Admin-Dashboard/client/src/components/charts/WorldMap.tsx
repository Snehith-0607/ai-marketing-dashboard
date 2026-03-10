import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

const countries = [
  { name: "Canada", code: "🇨🇦", users: "87,142", x: "20%", y: "24%" },
  { name: "Germany", code: "🇩🇪", users: "90,069", x: "51%", y: "22%" },
  { name: "Uruguay", code: "🇺🇾", users: "85,321", x: "30%", y: "76%" },
  { name: "Indonesia", code: "🇮🇩", users: "120,904", x: "77%", y: "60%" },
];

function generateWorldDots(): [number, number][] {
  const dots: [number, number][] = [];
  const spacing = 1.8;

  const isLand = (x: number, y: number): boolean => {
    // North America
    if (x >= 8 && x <= 30 && y >= 12 && y <= 20) return true;
    if (x >= 10 && x <= 28 && y >= 20 && y <= 30) return true;
    if (x >= 12 && x <= 26 && y >= 30 && y <= 38) return true;
    if (x >= 14 && x <= 24 && y >= 38 && y <= 42) return true;
    if (x >= 16 && x <= 22 && y >= 42 && y <= 46) return true;
    // Alaska
    if (x >= 4 && x <= 12 && y >= 12 && y <= 20) return true;
    // Greenland
    if (x >= 32 && x <= 40 && y >= 8 && y <= 18) return true;

    // Central America
    if (x >= 16 && x <= 22 && y >= 46 && y <= 52) return true;

    // South America
    if (x >= 22 && x <= 36 && y >= 52 && y <= 58) return true;
    if (x >= 24 && x <= 38 && y >= 58 && y <= 66) return true;
    if (x >= 26 && x <= 36 && y >= 66 && y <= 74) return true;
    if (x >= 28 && x <= 34 && y >= 74 && y <= 82) return true;
    if (x >= 30 && x <= 34 && y >= 82 && y <= 88) return true;

    // Europe
    if (x >= 44 && x <= 56 && y >= 12 && y <= 20) return true;
    if (x >= 42 && x <= 52 && y >= 20 && y <= 28) return true;
    if (x >= 44 && x <= 50 && y >= 28 && y <= 34) return true;
    if (x >= 42 && x <= 48 && y >= 34 && y <= 38) return true;
    // UK / Ireland
    if (x >= 40 && x <= 44 && y >= 16 && y <= 24) return true;
    // Scandinavia
    if (x >= 48 && x <= 54 && y >= 8 && y <= 16) return true;
    // Iceland
    if (x >= 36 && x <= 40 && y >= 10 && y <= 14) return true;

    // Africa
    if (x >= 44 && x <= 56 && y >= 38 && y <= 46) return true;
    if (x >= 42 && x <= 58 && y >= 46 && y <= 54) return true;
    if (x >= 46 && x <= 60 && y >= 54 && y <= 62) return true;
    if (x >= 48 && x <= 58 && y >= 62 && y <= 70) return true;
    if (x >= 50 && x <= 56 && y >= 70 && y <= 78) return true;
    // Madagascar
    if (x >= 58 && x <= 62 && y >= 64 && y <= 72) return true;

    // Middle East
    if (x >= 56 && x <= 64 && y >= 28 && y <= 38) return true;
    if (x >= 54 && x <= 60 && y >= 38 && y <= 44) return true;

    // Russia / Central Asia
    if (x >= 54 && x <= 68 && y >= 12 && y <= 22) return true;
    if (x >= 68 && x <= 82 && y >= 10 && y <= 22) return true;
    if (x >= 82 && x <= 94 && y >= 12 && y <= 20) return true;
    if (x >= 56 && x <= 70 && y >= 22 && y <= 30) return true;

    // India / South Asia
    if (x >= 64 && x <= 72 && y >= 30 && y <= 40) return true;
    if (x >= 66 && x <= 74 && y >= 40 && y <= 50) return true;
    if (x >= 68 && x <= 72 && y >= 50 && y <= 56) return true;

    // China / East Asia
    if (x >= 70 && x <= 86 && y >= 22 && y <= 32) return true;
    if (x >= 74 && x <= 88 && y >= 32 && y <= 40) return true;
    if (x >= 80 && x <= 90 && y >= 40 && y <= 46) return true;

    // Southeast Asia
    if (x >= 74 && x <= 82 && y >= 46 && y <= 54) return true;
    if (x >= 78 && x <= 86 && y >= 54 && y <= 60) return true;
    if (x >= 82 && x <= 92 && y >= 56 && y <= 64) return true;

    // Japan / Korea
    if (x >= 86 && x <= 92 && y >= 26 && y <= 36) return true;

    // Australia
    if (x >= 78 && x <= 94 && y >= 66 && y <= 74) return true;
    if (x >= 80 && x <= 92 && y >= 74 && y <= 82) return true;
    if (x >= 82 && x <= 88 && y >= 82 && y <= 86) return true;

    // New Zealand
    if (x >= 94 && x <= 98 && y >= 78 && y <= 86) return true;

    return false;
  };

  for (let y = 6; y < 92; y += spacing) {
    for (let x = 2; x < 98; x += spacing) {
      if (isLand(x, y)) {
        dots.push([x, y]);
      }
    }
  }

  return dots;
}

const worldDots = generateWorldDots();

export default function WorldMap() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-world-map">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-5">
          <div>
            <p className="text-sm text-[#64748B]">Campaign Reach</p>
            <p className="text-2xl font-bold text-[#1C2434]" data-testid="text-campaign-reach">12 country</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B]">User Reached</p>
            <p className="text-2xl font-bold text-[#1C2434]" data-testid="text-users-reached">180,807,839 user</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B]">Period</p>
            <p className="text-2xl font-bold text-[#1C2434]">9 month</p>
          </div>
          <div className="pt-2 border-t border-[#F1F5F9]">
            <p className="text-xs text-[#94A3B8]">Updated 2s ago</p>
            <button className="flex items-center gap-1.5 text-sm text-[#465FFF] font-medium mt-1 hover:text-[#3A50E0] transition-colors" data-testid="button-refresh-map">
              <RefreshCw className="w-3.5 h-3.5" />
              Click to refresh
            </button>
          </div>
        </div>

        <div className="lg:w-3/4 relative bg-[#F8FAFC] rounded-xl overflow-hidden" style={{ minHeight: 340 }}>
          <svg viewBox="0 0 100 94" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {worldDots.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="0.6"
                fill="#94A3B8"
                opacity={0.35}
              />
            ))}
          </svg>

          {countries.map((country, i) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
              className="absolute"
              style={{ left: country.x, top: country.y, transform: "translate(-50%, -100%)" }}
              data-testid={`marker-${country.name.toLowerCase()}`}
            >
              <div className="bg-[#1C2434] text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-2 shadow-xl whitespace-nowrap relative">
                <span className="text-base leading-none">{country.code}</span>
                <span>{country.users}</span>
                <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#1C2434] rotate-45 -translate-x-1/2" />
              </div>
              <div className="w-3 h-3 bg-[#465FFF] rounded-full mx-auto mt-2 shadow-lg shadow-[#465FFF]/40 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
