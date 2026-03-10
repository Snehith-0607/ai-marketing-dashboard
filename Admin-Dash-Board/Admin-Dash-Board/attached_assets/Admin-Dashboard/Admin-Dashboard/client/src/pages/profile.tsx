import { motion } from "framer-motion";
import { Camera, Edit, Facebook, Linkedin, Github, Dribbble } from "lucide-react";
import { RiTwitterXFill } from "react-icons/ri";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1C2434]">Profile</h2>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#465FFF] font-medium">Profile</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" data-testid="card-profile">
        <div className="h-48 bg-gradient-to-r from-[#465FFF] via-[#7B8AFF] to-[#465FFF] relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTE2aC0ydi00aDJ2NHptLTE2IDE2aC0ydi00aDJ2NHptMC0xNmgtMnYtNGgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <button
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#465FFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3A50E0] transition-colors"
            data-testid="button-edit-cover"
          >
            <Camera className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="px-6 pb-8 text-center -mt-16 relative">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              M
            </div>
            <button
              className="absolute bottom-1 right-1 w-8 h-8 bg-[#465FFF] rounded-full flex items-center justify-center text-white border-2 border-white"
              data-testid="button-edit-avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-[#1C2434] mt-4" data-testid="text-profile-name">Musharof Chowdhury</h3>
          <p className="text-sm text-[#64748B]">Ui/Ux Designer</p>

          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="text-center px-4 py-2 border border-[#E2E8F0] rounded-lg">
              <span className="text-lg font-bold text-[#1C2434]">259</span>
              <span className="text-sm text-[#64748B] ml-1">Posts</span>
            </div>
            <div className="text-center px-4 py-2 border border-[#E2E8F0] rounded-lg">
              <span className="text-lg font-bold text-[#1C2434]">129K</span>
              <span className="text-sm text-[#64748B] ml-1">Followers</span>
            </div>
            <div className="text-center px-4 py-2 border border-[#E2E8F0] rounded-lg">
              <span className="text-lg font-bold text-[#1C2434]">2K</span>
              <span className="text-sm text-[#64748B] ml-1">Following</span>
            </div>
          </div>

          <div className="max-w-xl mx-auto mt-6">
            <h4 className="text-lg font-semibold text-[#1C2434] mb-2">About Me</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu
              condimentum mauris tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies. Sed
              vel aliquet libero. Nunc a augue fermentum, pharetra ligula sed, aliquam lacus.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-[#1C2434] mb-3">Follow me on</h4>
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: Facebook, color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
                { icon: RiTwitterXFill, color: "text-[#1C2434]", bg: "bg-[#F1F5F9]" },
                { icon: Linkedin, color: "text-[#0A66C2]", bg: "bg-[#0A66C2]/10" },
                { icon: Dribbble, color: "text-[#EA4C89]", bg: "bg-[#EA4C89]/10" },
                { icon: Github, color: "text-[#333]", bg: "bg-[#F1F5F9]" },
              ].map((social, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-lg ${social.bg} flex items-center justify-center ${social.color} hover:opacity-80 transition-opacity`}
                  data-testid={`button-social-${i}`}
                >
                  <social.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
