import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { RefreshCw } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country flag emojis
const FLAGS: Record<string, string> = {
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  Uruguay: "🇺🇾",
  Indonesia: "🇮🇩",
  "United States": "🇺🇸",
  Brazil: "🇧🇷",
  India: "🇮🇳",
  China: "🇨🇳",
  "United Kingdom": "🇬🇧",
  France: "🇫🇷",
  Australia: "🇦🇺",
  Japan: "🇯🇵",
  Mexico: "🇲🇽",
  Nigeria: "🇳🇬",
  "South Africa": "🇿🇦",
  Russia: "🇷🇺",
  "South Korea": "🇰🇷",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Egypt: "🇪🇬",
};

// Default highlighted countries with coordinates and values
const defaultMarkers = [
  { name: "Canada", coordinates: [-106.3468, 56.1304] as [number, number], value: 87142 },
  { name: "Germany", coordinates: [10.4515, 51.1657] as [number, number], value: 90069 },
  { name: "Uruguay", coordinates: [-55.7658, -32.5228] as [number, number], value: 85321 },
  { name: "Indonesia", coordinates: [113.9213, -0.7893] as [number, number], value: 120904 },
];

interface WorldMapCardProps {
  campaignReach?: number;
  userReached?: number;
  period?: number;
  markers?: Array<{ name: string; coordinates: [number, number]; value: number }>;
  onRefresh?: () => void;
}

export default function WorldMapCard({
  campaignReach = 12,
  userReached = 180807839,
  period = 9,
  markers,
  onRefresh,
}: WorldMapCardProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(2);

  const activeMarkers = markers && markers.length > 0 ? markers : defaultMarkers;

  const handleRefresh = () => {
    setLastUpdated(0);
    onRefresh?.();
    // Simulate update timer
    setTimeout(() => setLastUpdated(1), 1000);
    setTimeout(() => setLastUpdated(2), 2000);
  };

  const formattedUserReached = useMemo(() => {
    return userReached.toLocaleString("en-US");
  }, [userReached]);

  return (
    <div
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
      data-testid="card-world-map"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Stats Panel */}
        <div className="lg:w-[220px] p-6 lg:border-r border-b lg:border-b-0 border-[#E2E8F0] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Campaign Reach</p>
              <p className="text-2xl font-bold text-[#1C2434]">
                {campaignReach} <span className="text-base font-normal text-[#64748B]">country</span>
              </p>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8] mb-1">User Reached</p>
              <p className="text-2xl font-bold text-[#1C2434]">
                {formattedUserReached} <span className="text-base font-normal text-[#64748B]">user</span>
              </p>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Period</p>
              <p className="text-2xl font-bold text-[#1C2434]">
                {period} <span className="text-base font-normal text-[#64748B]">month</span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-[#94A3B8] mb-1.5">Updated {lastUpdated}s ago</p>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-sm text-[#465FFF] hover:text-[#3A50E0] font-medium transition-colors"
              data-testid="button-map-refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Click to refresh
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative p-4 min-h-[320px] lg:min-h-[400px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [20, 20],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* SVG dot pattern definition */}
            <defs>
              <pattern
                id="dotPattern"
                x="0"
                y="0"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="1.5" fill="#CBD5E1" />
              </pattern>
              <pattern
                id="dotPatternHighlight"
                x="0"
                y="0"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="1.5" fill="#465FFF" />
              </pattern>
            </defs>

            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies
                  .filter((geo: any) => geo.properties.name !== "Antarctica")
                  .map((geo: any) => {
                    const isHighlighted = activeMarkers.some(
                      (m) => m.name === geo.properties.name
                    );
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHighlighted ? "url(#dotPatternHighlight)" : "url(#dotPattern)"}
                        stroke="transparent"
                        strokeWidth={0}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: isHighlighted ? "url(#dotPatternHighlight)" : "url(#dotPattern)" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
              }
            </Geographies>

            {/* Country Markers with Tooltips */}
            {activeMarkers.map((marker) => (
              <Marker
                key={marker.name}
                coordinates={marker.coordinates}
                onMouseEnter={() => setHoveredMarker(marker.name)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Pulsing dot */}
                <circle r={4} fill="#465FFF" stroke="#fff" strokeWidth={2} />
                <circle r={8} fill="#465FFF" opacity={0.2}>
                  <animate
                    attributeName="r"
                    from="6"
                    to="14"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.3"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Tooltip card - always visible */}
                <g>
                  <foreignObject
                    x={-50}
                    y={-52}
                    width={100}
                    height={40}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        background: "#1C2434",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap",
                        width: "fit-content",
                        margin: "0 auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>
                        {FLAGS[marker.name] || "🏳️"}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                        <span style={{ color: "#94A3B8", fontSize: "9px", fontWeight: 500 }}>
                          {marker.name}
                        </span>
                        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>
                          {marker.value.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                  </foreignObject>

                  {/* Arrow pointer */}
                  <polygon
                    points="-5,-12 5,-12 0,-6"
                    fill="#1C2434"
                  />
                </g>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}
