import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  BarChart3,
  Globe,
  DollarSign,
  Target,
  Zap,
  Layout,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const audienceData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 1600 },
  { month: "Apr", value: 2200 },
  { month: "May", value: 2800 },
  { month: "Jun", value: 3200 },
  { month: "Jul", value: 2900 },
  { month: "Aug", value: 3600 },
  { month: "Sep", value: 4100 },
  { month: "Oct", value: 3800 },
  { month: "Nov", value: 4500 },
  { month: "Dec", value: 5200 },
];

const engagementData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 600 },
  { month: "Mar", value: 550 },
  { month: "Apr", value: 780 },
  { month: "May", value: 900 },
  { month: "Jun", value: 1100 },
];

function Navbar() {
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold text-gray-900"
              data-testid="text-logo"
            >
              TrendTide
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm text-gray-600 font-medium"
              data-testid="link-how-it-works"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-gray-600 font-medium"
              data-testid="link-about"
            >
              About Us
            </a>
            <a
              href="#features"
              className="text-sm text-gray-600 font-medium"
              data-testid="link-features"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-600 font-medium"
              data-testid="link-pricing"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-500 text-white rounded-full px-6 text-sm"
              data-testid="button-start-demo"
            >
              Start the demo
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <a
            href="#how-it-works"
            className="block text-sm text-gray-600 font-medium py-2"
          >
            How it works
          </a>
          <a
            href="#features"
            className="block text-sm text-gray-600 font-medium py-2"
          >
            About Us
          </a>
          <a
            href="#features"
            className="block text-sm text-gray-600 font-medium py-2"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block text-sm text-gray-600 font-medium py-2"
          >
            Pricing
          </a>
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-500 text-white rounded-full text-sm"
          >
            Start the demo
          </Button>
        </div>
      )}
    </nav>
  );
}

function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mt-12 max-w-4xl mx-auto"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 rounded-3xl blur-2xl opacity-60" />

      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-800">TrendTide</span>
          <span className="text-xs text-gray-400 ml-2">Instant tracking</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              f
            </div>
            <div className="text-xs text-gray-500">Facebook</div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ig
            </div>
            <div className="text-xs text-gray-500">Instagram</div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              X
            </div>
            <div className="text-xs text-gray-500">Twitter</div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
              in
            </div>
            <div className="text-xs text-gray-500">LinkedIn</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Followers</p>
            <p className="text-lg font-bold text-gray-900">128,816</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Engagement</p>
            <p className="text-lg font-bold text-gray-900">2,440</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +8%
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Rating</p>
            <p className="text-lg font-bold text-gray-900">4.85</p>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-2">Audience Growth</p>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#heroGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Click Rate (CTR)</p>
            <p className="text-lg font-bold text-gray-900">2,420</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +5%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const [, navigate] = useLocation();
  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-6 text-xs text-gray-500 shadow-sm">
            <Zap className="w-3 h-3 text-blue-500" />
            Instant tracking
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto"
          data-testid="text-hero-title"
        >
          Track, Analyze, and Grow Your Social Media with Ease
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          Get real-time insights on audience growth, follower trends, and
          content performance, all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white rounded-full px-8 py-3 text-sm font-medium shadow-lg shadow-blue-200"
            data-testid="button-start-trial"
          >
            Start your free trial
          </Button>
        </motion.div>

        <HeroDashboardPreview />
      </div>
    </section>
  );
}

function TrustedBy() {
  const brands = ["Polymath", "Epicurious", "Acme Corp", "Bottshift"];
  return (
    <motion.section {...fadeUp} className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm text-gray-400 mb-6">Trusted by</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-gray-400 font-semibold text-sm tracking-wide"
              data-testid={`text-brand-${brand.toLowerCase()}`}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ValueProposition() {
  return (
    <motion.section {...fadeUp} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
          Whether you're aiming to grow your{" "}
          <span className="inline-flex items-center gap-1">
            <Users className="w-5 h-5 text-blue-500 inline" />
          </span>{" "}
          audience, identify new opportunities, or improve engagement, our
          dashboard delivers actionable metrics{" "}
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-blue-500 inline" />
          </span>{" "}
          that help you{" "}
          <strong className="text-gray-900">
            refine your strategy and achieve lasting success.
          </strong>
        </p>
      </div>
    </motion.section>
  );
}

function FeatureAudienceGrowth() {
  const [, navigate] = useLocation();
  return (
    <motion.section
      {...fadeUp}
      className="py-16 px-4 sm:px-6 lg:px-8"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-50 rounded-2xl p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs text-blue-500 font-medium mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Know your followers better
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              data-testid="text-feature-audience"
            >
              Audience Growth & Analysis
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Track your Audience growth in real-time and analyze demographics,
              behaviors, and interests. Understand who your followers are and
              optimize your content to boost engagement and reach.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="rounded-full border-blue-200 text-blue-600 text-sm"
              data-testid="button-book-demo-audience"
            >
              Book a demo
            </Button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Audience Growth
            </p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={audienceData}>
                  <defs>
                    <linearGradient
                      id="audienceGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#audienceGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeatureEngagement() {
  const [, navigate] = useLocation();
  return (
    <motion.section {...fadeUp} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs text-blue-500 font-medium mb-2 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Drive deeper connections
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              data-testid="text-feature-engagement"
            >
              Improving Engagement with Metrics Analysis
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Enhance your social media performance with detailed metrics on
              likes, shares, and interactions. Discover which content resonates
              most with your audience and create more meaningful engagement.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="rounded-full border-blue-200 text-blue-600 text-sm"
              data-testid="button-book-demo-engagement"
            >
              Book a demo
            </Button>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Followers</p>
                  <p className="text-2xl font-bold text-gray-900">128,420</p>
                </div>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  +3%
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">66,816</p>
                </div>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  +5%
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    Click-through rate (CTR)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">2,420</p>
                </div>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  +2%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeatureMonetization() {
  const [, navigate] = useLocation();
  const activities = [
    {
      name: "Bruce Springsteen",
      action: "Clicked Ad",
      time: "2m ago",
      amount: "$12.50",
    },
    {
      name: "Sarah Johnson",
      action: "Purchase",
      time: "5m ago",
      amount: "$89.00",
    },
    { name: "Alex Chen", action: "Sign Up", time: "12m ago", amount: "$0.00" },
  ];

  return (
    <motion.section {...fadeUp} className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-50 rounded-2xl p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs text-blue-500 font-medium mb-2 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Turn followers into clients
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
              data-testid="text-feature-monetization"
            >
              Monetization and Advertising Management
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Manage your ad performance and maximize monetization
              opportunities. TrendTide helps you track ROI, optimize campaigns,
              and unlock the full revenue potential of your social platforms.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="rounded-full border-blue-200 text-blue-600 text-sm"
              data-testid="button-book-demo-monetization"
            >
              Book a demo
            </Button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Post Activity
            </p>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                      {a.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {a.name}
                      </p>
                      <p className="text-xs text-gray-400">{a.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {a.amount}
                    </p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function GetMoreValue() {
  const features = [
    {
      icon: DollarSign,
      title: "Monetization Tools",
      desc: "Track ad performance, manage monetization, manage campaigns, and maximize revenue potential across your social platforms.",
    },
    {
      icon: Layout,
      title: "User-Friendly Dashboard",
      desc: "Access all your analytics with a clean, intuitive interface. Your data is organized and ready at your fingertips.",
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      desc: "Get live data on your audience growth, engagement metrics, and content performance as they happen.",
    },
    {
      icon: Target,
      title: "Audience Deep-Dive",
      desc: "Analyze demographics, behaviors, and interests of your followers to refine your targeting and boost engagement.",
    },
  ];

  return (
    <motion.section
      {...fadeUp}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      id="features"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-blue-500 font-medium mb-2">Our Features</p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-features-title"
          >
            Get more value from your tools
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Connect your tools, automate your reports. With our real-app
            activity analytics tool, monitoring your team's favorite tools is
            just a click away.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className="p-6 bg-white border-gray-100 h-full"
                data-testid={`card-feature-${i}`}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Jordan Meyers",
      role: "Marketing Manager",
      text: "TrendTide helped me finally understand my social media performance clearly. Its data-driven insights help us optimize every campaign with ease. The platform's intuitive design makes data analysis enjoyable.",
      avatar: "JM",
    },
    {
      name: "Adrienne Yang",
      role: "Content Creator",
      text: "As a creator, TrendTide has been an invaluable tool for understanding my audience. The engagement metrics alone have increased my partnership opportunities. The Platform's clean design makes it a joy to use.",
      avatar: "AY",
    },
    {
      name: "Thomas Miller",
      role: "Agency Director",
      text: "Our team manages 15+ client social accounts. TrendTide's dashboard gives us a bird's-eye view of everything. The reporting features save us hours of manual work. I can't imagine going back.",
      avatar: "TM",
    },
  ];

  return (
    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-testimonials-title"
          >
            Customer testimonials
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className="p-6 bg-gray-50 border-gray-100 h-full flex flex-col"
                data-testid={`card-testimonial-${i}`}
              >
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      icon: Users,
      name: "Individual Creators",
      desc: "Track your followers, engagement and performance across your social media platforms.",
      price: "$10",
      features: [
        "Up to 5 social accounts",
        "Basic analytics",
        "Weekly reports",
        "Email support",
      ],
      cta: "Subscribe Now",
      highlight: false,
    },
    {
      icon: BarChart3,
      name: "Teams & Agencies",
      desc: "Designed for teams and agencies managing multiple accounts with advanced features.",
      price: "$10",
      features: [
        "Unlimited accounts",
        "Advanced analytics",
        "Real-time reports",
        "Priority support",
      ],
      cta: "Subscribe Now",
      highlight: false,
    },
    {
      icon: Target,
      name: "Custom Plan",
      desc: "Tailored solutions for large businesses with specific needs and requirements.",
      price: null,
      features: [
        "Custom integrations",
        "Dedicated manager",
        "SLA guarantee",
        "Custom reporting",
      ],
      cta: "Customize plan",
      highlight: true,
    },
  ];

  return (
    <motion.section
      {...fadeUp}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      id="pricing"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs text-blue-500 font-medium mb-2">Pricing</p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-pricing-title"
          >
            Flexible Plans for Every Need
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
            Whether you're a solo creator or managing assets, TrendTide offers
            pricing options tailored to your needs.
          </p>
          <div className="inline-flex items-center bg-white rounded-full border border-gray-200 p-1">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!isAnnual ? "bg-blue-500 text-white" : "text-gray-500"}`}
              onClick={() => setIsAnnual(false)}
              data-testid="button-monthly"
            >
              Monthly billing
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isAnnual ? "bg-blue-500 text-white" : "text-gray-500"}`}
              onClick={() => setIsAnnual(true)}
              data-testid="button-annual"
            >
              Annual billing
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className={`p-6 h-full flex flex-col ${plan.highlight ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-100"}`}
                data-testid={`card-plan-${i}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${plan.highlight ? "bg-white/20" : "bg-blue-100"}`}
                >
                  <plan.icon
                    className={`w-5 h-5 ${plan.highlight ? "text-white" : "text-blue-500"}`}
                  />
                </div>
                <h3
                  className={`text-lg font-semibold mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}
                >
                  {plan.desc}
                </p>
                {plan.price ? (
                  <div className="mb-6">
                    <span
                      className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-blue-100" : "text-gray-400"}`}
                    >
                      /mo
                    </span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-white">
                      Let's talk!
                    </span>
                  </div>
                )}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 ${plan.highlight ? "text-white" : "text-blue-500"}`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-blue-50" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full text-sm ${plan.highlight ? "bg-white text-blue-500" : "bg-blue-500 text-white"}`}
                  data-testid={`button-plan-${i}`}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CTASection() {
  const [, navigate] = useLocation();
  return (
    <motion.section {...fadeUp} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <p className="text-xs text-blue-200 font-medium mb-3">
              Know your followers better
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              data-testid="text-cta-title"
            >
              Let's Grow Your Social Media Together!
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["JM", "AY", "TM", "SC"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white/30"
                  >
                    {initials}
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-6 bg-white text-blue-500 rounded-full px-8 text-sm font-medium"
              data-testid="button-cta-start"
            >
              Start a demo
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-sm text-gray-300 mb-4">
              Get real-time insights on audience growth, follower trends, and
              potential clients, all in one place.
            </p>
            <div className="flex gap-3">
              {["f", "ig", "X", "in"].map((icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-xs cursor-pointer"
                  data-testid={`button-social-${i}`}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">How it works</h4>
            <ul className="space-y-2">
              {["About Us", "Features", "Pricing"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Features</h4>
            <ul className="space-y-2">
              {["Analytics", "Reports", "Integrations"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Subscribe</h4>
            <p className="text-xs text-gray-400 mb-3">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                data-testid="input-newsletter"
              />
              <Button
                className="bg-blue-500 text-white rounded-full px-4 text-sm"
                data-testid="button-subscribe"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-bold">TrendTide</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2024 TrendTide. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { CartesianGrid } from "recharts";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustedBy />
      <ValueProposition />
      <FeatureAudienceGrowth />
      <FeatureEngagement />
      <FeatureMonetization />
      <GetMoreValue />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
