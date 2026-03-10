import { MoreVertical } from "lucide-react";

const orders = [
  {
    id: 1,
    product: "MacBook Pro 13\"",
    variants: "2 Variants",
    price: "$2399.00",
    category: "Laptop",
    status: "Delivered",
    color: "bg-[#465FFF]/10 text-[#465FFF]",
    img: "💻",
  },
  {
    id: 2,
    product: "Apple Watch Ultra",
    variants: "1 Variant",
    price: "$879.00",
    category: "Watch",
    status: "Pending",
    color: "bg-amber-50 text-amber-600",
    img: "⌚",
  },
  {
    id: 3,
    product: "iPhone 15 Pro Max",
    variants: "2 Variants",
    price: "$1869.00",
    category: "SmartPhone",
    status: "Delivered",
    color: "bg-[#465FFF]/10 text-[#465FFF]",
    img: "📱",
  },
  {
    id: 4,
    product: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    price: "$1699.00",
    category: "Electronics",
    status: "Canceled",
    color: "bg-red-50 text-red-500",
    img: "📲",
  },
  {
    id: 5,
    product: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    price: "$240.00",
    category: "Accessories",
    status: "Delivered",
    color: "bg-[#465FFF]/10 text-[#465FFF]",
    img: "🎧",
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Canceled: "bg-red-50 text-red-500",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-recent-orders">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1C2434]">Recent Orders</h3>
        <div className="flex items-center gap-2">
          <button className="text-sm text-[#465FFF] font-medium" data-testid="link-see-all-orders">See all</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="table-orders">
          <thead>
            <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              <th className="pb-3 pr-4">Products</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-[#F1F5F9]"
                data-testid={`row-order-${order.id}`}
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-2xl">
                      {order.img}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C2434]">{order.product}</p>
                      <p className="text-xs text-[#94A3B8]">{order.variants}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 pr-4 text-sm text-[#64748B]">{order.category}</td>
                <td className="py-4 pr-4 text-sm font-medium text-[#1C2434]">{order.price}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
