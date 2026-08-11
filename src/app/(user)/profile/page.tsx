"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const fields = [
    { icon: User, label: "Full Name", value: user.name },
    { icon: Mail, label: "Email", value: user.email },
    { icon: Shield, label: "Role", value: <StatusBadge status={user.role} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-2">
        My Profile
      </h1>
      <p className="text-[#76777d] mb-8">Manage your account information</p>

      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        {/* Avatar header */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-8 py-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-bold text-white font-[family-name:var(--font-geist)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white font-[family-name:var(--font-geist)]">
              {user.name}
            </h2>
            <p className="text-white/60 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="divide-y divide-[#f0edef]">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-8 py-5">
              <div className="w-9 h-9 rounded-xl bg-[#f0edef] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#45464d]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-[#76777d] uppercase tracking-wide mb-1">
                  {label}
                </p>
                <div className="text-sm font-medium text-[#1b1b1d]">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
