import { Plus, Minus } from "lucide-react";

const countries = [
  { name: "USA", flag: "🇺🇸", customers: "2,379 Customers", percentage: 79 },
  { name: "France", flag: "🇫🇷", customers: "589 Customers", percentage: 23 },
  { name: "India", flag: "🇮🇳", customers: "1,245 Customers", percentage: 45 },
  { name: "UK", flag: "🇬🇧", customers: "890 Customers", percentage: 32 },
];

export default function CustomerDemographic() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-customer-demographic">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">Customers Demographic</h3>
          <p className="text-sm text-[#64748B]">Number of customer based on country</p>
        </div>
        <div className="flex gap-1">
          <button className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]" data-testid="button-zoom-in">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]" data-testid="button-zoom-out">
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {countries.map((country) => (
          <div key={country.name} className="flex items-center gap-4" data-testid={`demographic-${country.name.toLowerCase()}`}>
            <span className="text-2xl">{country.flag}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#1C2434]">{country.name}</span>
                <span className="text-sm font-semibold text-[#1C2434]">{country.percentage}%</span>
              </div>
              <p className="text-xs text-[#94A3B8] mb-2">{country.customers}</p>
              <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                <div
                  className="bg-[#465FFF] h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
