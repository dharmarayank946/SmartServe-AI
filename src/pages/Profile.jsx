import React, { useState } from 'react';
import { User, Building2, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function Profile() {
  const [profile, setProfile] = useState({
    managerName: 'Chef Rahul Sharma',
    role: 'Head Chef & Kitchen Operations Manager',
    email: 'rahul.sharma@smartservebistro.com',
    phone: '+91 98765 43210',
    location: 'SmartServe Bistro, Gachibowli, Hyderabad, TS',
    certifications: ['HACCP Certified Food Safety', 'AI Kitchen Workflow Specialist']
  });

  const config = apiService.getConfig();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#112a12] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] text-white flex items-center justify-center font-bold text-2xl border-2 border-emerald-400/40 shadow-xl">
            RS
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">{profile.managerName}</h2>
            <p className="text-xs text-emerald-300 font-medium">{profile.role} • {config.name}</p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#d4af37]" /> Verified Commercial License
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1b4332]" /> Contact Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 lg:col-span-2">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1b4332]" /> Branch Operational Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
              <span className="text-gray-500 font-semibold block">Branch ID</span>
              <span className="text-lg font-bold font-heading text-gray-900">{config.branchId}</span>
            </div>
            <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
              <span className="text-gray-500 font-semibold block">Capacity</span>
              <span className="text-lg font-bold font-heading text-gray-900">{config.capacitySeats} Seats</span>
            </div>
            <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 col-span-2 sm:col-span-1">
              <span className="text-gray-500 font-semibold block">Avg Daily Orders</span>
              <span className="text-lg font-bold font-heading text-[#1b4332]">{config.avgDailyOrders} Orders</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Certifications & Accreditations</h4>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-50 text-[#1b4332] border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
