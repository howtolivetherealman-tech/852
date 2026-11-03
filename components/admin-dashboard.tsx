'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  UserCheck,
  UserX,
  CreditCard,
  Newspaper,
  Flame,
  Tags,
  Map,
  MapPin,
  Navigation,
  Megaphone,
  DollarSign,
  Home,
  Palette,
  FileText,
  Phone,
  Share2,
  Globe,
  Mail,
  Shield,
  Lock,
  History,
  Download,
  LogOut,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit3,
  RefreshCw,
  Eye,
  Plus,
} from 'lucide-react';
import { usePortal } from '@/lib/portal-context';
import { getDistrictsForState } from '@/lib/india-locations';
import { ReporterIdCard } from './reporter-id-card';
import type { ReporterRecord } from '@/lib/portal-rules';
import { OFFICIAL_TRICOLOUR_LOGO_URL, type NewsArticleItem } from '@/lib/default-data';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

type AdminModuleId =
  | 'dashboard'
  | 'reporter-applications'
  | 'approved-reporters'
  | 'expired-reporters'
  | 'reporter-id-cards'
  | 'news-management'
  | 'breaking-news'
  | 'categories'
  | 'states'
  | 'districts'
  | 'mandals'
  | 'private-ads'
  | 'google-adsense'
  | 'homepage-management'
  | 'logo-branding'
  | 'website-pages'
  | 'contact-details'
  | 'social-media'
  | 'seo-settings'
  | 'email-notifications'
  | 'admin-users'
  | 'security-settings'
  | 'audit-logs'
  | 'backup-export';

const SIDEBAR_MODULES: { id: AdminModuleId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reporter-applications', label: 'Reporter Applications', icon: UserPlus },
  { id: 'approved-reporters', label: 'Approved Reporters', icon: UserCheck },
  { id: 'expired-reporters', label: 'Expired Reporters', icon: UserX },
  { id: 'reporter-id-cards', label: 'Reporter ID Cards', icon: CreditCard },
  { id: 'news-management', label: 'News Management', icon: Newspaper },
  { id: 'breaking-news', label: 'Breaking News', icon: Flame },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'states', label: 'States', icon: Map },
  { id: 'districts', label: 'Districts', icon: MapPin },
  { id: 'mandals', label: 'Mandals', icon: Navigation },
  { id: 'private-ads', label: 'Private Advertisements', icon: Megaphone },
  { id: 'google-adsense', label: 'Google AdSense', icon: DollarSign },
  { id: 'homepage-management', label: 'Homepage Management', icon: Home },
  { id: 'logo-branding', label: 'Logo and Branding', icon: Palette },
  { id: 'website-pages', label: 'Website Pages', icon: FileText },
  { id: 'contact-details', label: 'Contact Details', icon: Phone },
  { id: 'social-media', label: 'Social Media', icon: Share2 },
  { id: 'seo-settings', label: 'SEO Settings', icon: Globe },
  { id: 'email-notifications', label: 'Email Notifications', icon: Mail },
  { id: 'admin-users', label: 'Admin User Management', icon: Shield },
  { id: 'security-settings', label: 'Security Settings', icon: Lock },
  { id: 'audit-logs', label: 'Audit Logs', icon: History },
  { id: 'backup-export', label: 'Backup and Export', icon: Download },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const {
    isSuperAdmin,
    adminUsername,
    loginAsAdmin,
    loginWithGoogleAdmin,
    logoutAdmin,
    states,
    districts,
    mandals,
    categories,
    news,
    reporters,
    privateAadhaarDocs,
    advertisements,
    websiteSettings,
    adSenseSettings,
    auditLogs,
    renewals,
    notifications,
    approveReporter,
    rejectReporter,
    renewReporterMembership,
    suspendOrReactivateReporter,
    deleteReporterAccount,
    updateReporterProfile,
    changeReporterPassword,
    updateNewsStatus,
    updateNewsArticle,
    deleteNewsArticle,
    updatePrivateAd,
    deletePrivateAd,
    saveCategory,
    deleteCategory,
    saveStateLocation,
    deleteStateLocation,
    saveDistrictLocation,
    deleteDistrictLocation,
    saveMandalLocation,
    deleteMandalLocation,
    updateWebsiteSettings,
    updateAdSenseSettings,
  } = usePortal();

  const [activeModule, setActiveModule] = useState<AdminModuleId>('dashboard');
  const [adminUserField, setAdminUserField] = useState('Admin');
  const [adminPassField, setAdminPassField] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Selected items for modals / editors
  const [selectedCardReporterUid, setSelectedCardReporterUid] = useState<string>('rep-hyd-001');
  const [inspectingAadhaarUid, setInspectingAadhaarUid] = useState<string | null>(null);
  const [editingReporter, setEditingReporter] = useState<ReporterRecord | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticleItem | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    title: string;
    onConfirm: () => void;
  } | null>(null);

  // Location & Category Add Form States
  const [newCatName, setNewCatName] = useState('');
  const [newCatTelugu, setNewCatTelugu] = useState('');
  const [newStateCode, setNewStateCode] = useState('');
  const [newStateName, setNewStateName] = useState('');
  const [newStateTelugu, setNewStateTelugu] = useState('');
  const [selectedStateForDist, setSelectedStateForDist] = useState('Telangana');
  const [newDistName, setNewDistName] = useState('');
  const [newDistTelugu, setNewDistTelugu] = useState('');
  const [selectedStateForMandal, setSelectedStateForMandal] = useState('Telangana');
  const [selectedDistForMandal, setSelectedDistForMandal] = useState('Hyderabad');
  const [newMandalName, setNewMandalName] = useState('');
  const [newMandalTelugu, setNewMandalTelugu] = useState('');

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG, SVG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateWebsiteSettings({ logoUrl: reader.result });
        showToast('New website logo uploaded and applied across the portal!');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              RESTRICTED SUPER ADMIN CONSOLE
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              NETI BHARATHAM Super Admin Authentication
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Only Super Admin can access this management system. Sign in via the initial bootstrap account (Username: <strong className="font-mono">Admin</strong>) or verified Google Admin account.
            </p>
          </div>

          {authFeedback && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-900">
              {authFeedback}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = loginAsAdmin(adminUserField, adminPassField);
              if (!res.ok) setAuthFeedback(res.message);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="admin-username-input"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Admin Username (Default: Admin)
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                value={adminUserField}
                onChange={(e) => setAdminUserField(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Super Admin Setup / Session Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={adminPassField}
                onChange={(e) => setAdminPassField(e.target.value)}
                placeholder="Enter private admin password (min 6 chars)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
            >
              Sign In as Super Admin
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={async () => {
                const res = await loginWithGoogleAdmin();
                if (!res.ok) setAuthFeedback(res.message);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Sign In with Google Admin (brkr1042@gmail.com)
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Return to Public News Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingReporters = reporters.filter((r) => r.status === 'PENDING');
  const approvedReporters = reporters.filter((r) => r.status === 'APPROVED');
  const rejectedReporters = reporters.filter((r) => r.status === 'REJECTED');
  const expiredReporters = reporters.filter((r) => r.status === 'EXPIRED');

  const pendingNews = news.filter((n) => n.status === 'PENDING');
  const publishedNews = news.filter((n) => n.status === 'PUBLISHED');
  const rejectedNews = news.filter((n) => n.status === 'REJECTED');

  const pendingAds = advertisements.filter((a) => a.status === 'PENDING');
  const activeAds = advertisements.filter((a) => a.status === 'APPROVED');

  const handleExportBackupJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      portal: 'NETI BHARATHAM (https://netibhaaratham.com)',
      websiteSettings,
      adSenseSettings,
      statesCount: states.length,
      districtsCount: districts.length,
      mandalsCount: mandals.length,
      categories,
      reporters,
      news,
      advertisements,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neti-bharatham-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Complete portal JSON backup exported.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* 25-MODULE SIDEBAR */}
      <aside className="w-full lg:w-72 bg-[#0A192F] text-white shrink-0 border-r border-slate-800 flex flex-col justify-between">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <img
              src={websiteSettings.logoUrl || OFFICIAL_TRICOLOUR_LOGO_URL}
              alt="NETI BHARATHAM Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full bg-white p-0.5 object-contain border border-white/30 shrink-0"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                SUPER ADMIN CMS
              </p>
              <h2 className="text-base font-black text-white">
                NETI BHARATHAM • నేటి భారతం
              </h2>
              <p className="text-[11px] text-slate-400">Logged in: {adminUsername}</p>
            </div>
          </div>

          <nav
            aria-label="Super Admin Sidebar Navigation"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1 max-h-[70vh] overflow-y-auto pr-1"
          >
            {SIDEBAR_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
          >
            ← Public News Website
          </button>
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              onNavigateHome();
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-700 hover:bg-red-800 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>25. Logout Super Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {actionToast && (
          <div className="p-3.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-between">
            <span>{actionToast}</span>
            <button
              type="button"
              onClick={() => setActionToast(null)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* MODULE 1: DASHBOARD STATISTICS */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  EXECUTIVE COMMAND CENTER
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Super Admin Dashboard Overview
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule('logo-branding')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-red-600 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-extrabold cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Change Logo / లోగో మార్చండి</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('reporter-applications')}
                  className="px-3.5 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Review Pending Reporters ({pendingReporters.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('news-management')}
                  className="px-3.5 py-2 rounded-lg bg-[#0A192F] text-white text-xs font-bold cursor-pointer"
                >
                  Review Pending News ({pendingNews.length})
                </button>
              </div>
            </div>

            {/* 13 Core Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Reporters', val: reporters.length, tone: 'text-slate-900' },
                { label: 'Pending Applications', val: pendingReporters.length, tone: 'text-amber-600' },
                { label: 'Approved Reporters', val: approvedReporters.length, tone: 'text-emerald-700' },
                { label: 'Rejected Reporters', val: rejectedReporters.length, tone: 'text-red-600' },
                { label: 'Expired Reporters', val: expiredReporters.length, tone: 'text-rose-700' },
                { label: 'Total News Articles', val: news.length, tone: 'text-slate-900' },
                { label: 'Pending News', val: pendingNews.length, tone: 'text-amber-600' },
                { label: 'Published News', val: publishedNews.length, tone: 'text-emerald-700' },
                { label: 'Rejected News', val: rejectedNews.length, tone: 'text-red-600' },
                { label: 'Total Advertisements', val: advertisements.length, tone: 'text-slate-900' },
                { label: 'Pending Ads', val: pendingAds.length, tone: 'text-amber-600' },
                { label: 'Active Approved Ads', val: activeAds.length, tone: 'text-emerald-700' },
                { label: 'Active Categories', val: categories.filter((c) => c.active).length, tone: 'text-blue-900' },
                { label: 'Indian States & UTs', val: states.length, tone: 'text-slate-900' },
                { label: 'Districts & Mandals', val: `${districts.length} / ${mandals.length}`, tone: 'text-slate-900' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className={`text-2xl font-black font-mono tabular-nums mt-1 ${stat.tone}`}>
                    {stat.val}
                  </p>
                </div>
              ))}
            </div>

            {/* State-wise, District-wise & Mandal-wise Reporter Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  State-wise Reporter Statistics
                </h3>
                <div className="space-y-2 text-xs">
                  {Array.from(new Set(reporters.map((r) => r.state))).map((st) => (
                    <div key={st} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{st}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {reporters.filter((r) => r.state === st).length} Reporters
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  District-wise Reporter Statistics
                </h3>
                <div className="space-y-2 text-xs">
                  {Array.from(new Set(reporters.map((r) => r.district))).map((dist) => (
                    <div key={dist} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{dist}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {reporters.filter((r) => r.district === dist).length} Reporters
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Mandal-wise Reporter Statistics
                </h3>
                <div className="space-y-2 text-xs">
                  {Array.from(new Set(reporters.map((r) => r.mandal))).map((m) => (
                    <div key={m} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{m}</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {reporters.filter((r) => r.mandal === m).length} Reporters
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2, 3, 4: REPORTER APPLICATIONS, APPROVED REPORTERS, EXPIRED REPORTERS */}
        {(activeModule === 'reporter-applications' ||
          activeModule === 'approved-reporters' ||
          activeModule === 'expired-reporters') && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeModule === 'reporter-applications' &&
                    'Reporter Applications (Pending & All Applications)'}
                  {activeModule === 'approved-reporters' &&
                    'Approved & Active Press Reporters'}
                  {activeModule === 'expired-reporters' &&
                    'Expired Reporters & 6-Month Validity Renewal'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Super Admin has full access to inspect isolated Aadhaar documents, approve/reject applications, renew 6-month validity, and edit any profile field.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {reporters
                .filter((r) => {
                  if (activeModule === 'approved-reporters') return r.status === 'APPROVED';
                  if (activeModule === 'expired-reporters') return r.status === 'EXPIRED';
                  return true;
                })
                .map((rep) => {
                  const aadhaarDoc = privateAadhaarDocs[rep.uid];
                  return (
                    <div key={rep.uid} className="py-5 space-y-3">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={rep.profilePhotoUrl || '/icon.svg'}
                            alt={rep.fullName}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-mono font-bold text-blue-900">
                                ID: {rep.reporterId}
                              </span>
                              <span>·</span>
                              <span className="font-bold text-slate-800">
                                Status: {rep.status}
                              </span>
                              <span>·</span>
                              <span className="text-slate-500">Username: {rep.username}</span>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              {rep.fullName}
                            </h3>
                            <p className="text-xs text-slate-600">
                              Father/Husband: {rep.fatherOrHusbandName} · DOB: {rep.dob} · Gender:{' '}
                              {rep.gender} · Mobile: {rep.mobile} · Email: {rep.email}
                            </p>
                            <p className="text-xs text-slate-600">
                              Location: <strong>{rep.mandal}</strong> Mandal,{' '}
                              <strong>{rep.district}</strong> District,{' '}
                              <strong>{rep.state}</strong> ({rep.villageOrTown} - {rep.pinCode})
                            </p>
                            <p className="text-xs text-slate-500">
                              Residential Address: {rep.residentialAddress} · Experience:{' '}
                              {rep.experience} ({rep.previousOrganization})
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setInspectingAadhaarUid(
                                inspectingAadhaarUid === rep.uid ? null : rep.uid
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Aadhaar (Private)</span>
                          </button>

                          {rep.status !== 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => {
                                const res = approveReporter(rep.uid);
                                showToast(res.message);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve &amp; Issue ID</span>
                            </button>
                          )}

                          {rep.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => {
                                const res = rejectReporter(
                                  rep.uid,
                                  'Incomplete Aadhaar or residential proof verification.'
                                );
                                showToast(res.message);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const res = renewReporterMembership(rep.uid);
                              showToast(res.message);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew +6 Months</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingReporter(rep)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Full Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDeleteModal({
                                title: `Delete reporter account "${rep.fullName}"?`,
                                onConfirm: () => {
                                  const res = deleteReporterAccount(rep.uid);
                                  showToast(res.message);
                                  setConfirmDeleteModal(null);
                                },
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {inspectingAadhaarUid === rep.uid && (
                        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-400">
                              CONFIDENTIAL AADHAAR RECORD (reporterPrivateDocuments/{rep.uid})
                            </span>
                            <span className="font-mono text-slate-400">
                              Access Level: SUPER_ADMIN ONLY
                            </span>
                          </div>
                          <p>
                            File: <strong>{aadhaarDoc?.aadhaarFileName || 'aadhaar_verified.pdf'}</strong>{' '}
                            ({aadhaarDoc?.aadhaarFileType || 'application/pdf'}) · Notes:{' '}
                            {aadhaarDoc?.residentialProofNotes || 'Verified'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* MODULE 5: REPORTER ID CARDS GENERATOR */}
        {activeModule === 'reporter-id-cards' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Press Reporter ID Card Generator &amp; Registry
                </h2>
                <p className="text-xs text-slate-500">
                  Select any approved reporter to preview, print, or download their high-resolution Front &amp; Back Press Reporter Identity Card.
                </p>
              </div>
              <select
                value={selectedCardReporterUid}
                onChange={(e) => setSelectedCardReporterUid(e.target.value)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              >
                {reporters
                  .filter((r) => r.reporterId !== 'PENDING')
                  .map((r) => (
                    <option key={r.uid} value={r.uid}>
                      {r.fullName} ({r.reporterId} - {r.status})
                    </option>
                  ))}
              </select>
            </div>

            {(() => {
              const targetRep =
                reporters.find((r) => r.uid === selectedCardReporterUid) || reporters[0];
              return targetRep ? (
                <ReporterIdCard reporter={targetRep} websiteSettings={websiteSettings} />
              ) : null;
            })()}
          </div>
        )}

        {/* MODULE 6 & 7: NEWS MANAGEMENT & BREAKING NEWS */}
        {(activeModule === 'news-management' || activeModule === 'breaking-news') && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-3">
              <h2 className="text-xl font-extrabold text-slate-900">
                {activeModule === 'breaking-news'
                  ? 'Breaking News Ticker & Priority Headlines'
                  : 'Complete News Articles Management'}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={websiteSettings.breakingNewsTickerText}
                  onChange={(e) =>
                    updateWebsiteSettings({ breakingNewsTickerText: e.target.value })
                  }
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="Breaking News scrolling ticker text..."
                />
                <button
                  type="button"
                  onClick={() => showToast('Breaking news ticker updated live!')}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Save Breaking Ticker
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-900">{item.category}</span>
                      <span>·</span>
                      <span>
                        {item.mandal}, {item.district}, {item.state}
                      </span>
                      <span>·</span>
                      <span className="font-mono">Reporter: {item.reporterId}</span>
                      <span>·</span>
                      <span
                        className={`font-bold ${
                          item.status === 'PUBLISHED'
                            ? 'text-emerald-700'
                            : item.status === 'PENDING'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        Status: {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.headline}</h3>
                    <p className="text-xs text-slate-500">Slug: /news/{item.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {item.status !== 'PUBLISHED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const res = updateNewsStatus(item.id, 'PUBLISHED');
                          showToast(res.message);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Approve &amp; Publish
                      </button>
                    )}
                    {item.status === 'PUBLISHED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const res = updateNewsStatus(item.id, 'UNPUBLISHED');
                          showToast(res.message);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        updateNewsArticle(item.id, { isBreaking: !item.isBreaking });
                        showToast('Updated Breaking News flag.');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                        item.isBreaking
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {item.isBreaking ? 'Breaking: ON' : 'Breaking: OFF'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNews(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDeleteModal({
                          title: `Delete news article "${item.headline.slice(0, 50)}..."?`,
                          onConfirm: () => {
                            const res = deleteNewsArticle(item.id);
                            showToast(res.message);
                            setConfirmDeleteModal(null);
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 8: CATEGORIES MANAGEMENT */}
        {activeModule === 'categories' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              News Categories Management ({categories.length} Categories)
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCatName.trim()) return;
                saveCategory({
                  id: `cat-${Date.now()}`,
                  name: newCatName.trim(),
                  nameTelugu: newCatTelugu.trim() || newCatName.trim(),
                  slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  order: categories.length + 1,
                  active: true,
                });
                setNewCatName('');
                setNewCatTelugu('');
                showToast('Added new category.');
              }}
              className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
            >
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category English Name"
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                value={newCatTelugu}
                onChange={(e) => setNewCatTelugu(e.target.value)}
                placeholder="Category Telugu Name (తెలుగు పేరు)"
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {cat.order}. {cat.name}
                    </p>
                    <p className="text-xs text-slate-500">{cat.nameTelugu}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveCategory({ ...cat, active: !cat.active })}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                        cat.active
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      aria-label={`Delete category ${cat.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 9, 10, 11: INDIA LOCATION MANAGEMENT (STATES, DISTRICTS, MANDALS) */}
        {(activeModule === 'states' ||
          activeModule === 'districts' ||
          activeModule === 'mandals') && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  India Location Hierarchy Management ({activeModule.toUpperCase()})
                </h2>
                <p className="text-xs text-slate-500">
                  Country (India) → {states.length} States/UTs → {districts.length} Districts →{' '}
                  {mandals.length} Mandals / Tehsils / Taluks / Blocks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule('states')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeModule === 'states' ? 'bg-[#0A192F] text-white' : 'bg-slate-100'
                  }`}
                >
                  States ({states.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('districts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeModule === 'districts' ? 'bg-[#0A192F] text-white' : 'bg-slate-100'
                  }`}
                >
                  Districts ({districts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('mandals')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeModule === 'mandals' ? 'bg-[#0A192F] text-white' : 'bg-slate-100'
                  }`}
                >
                  Mandals ({mandals.length})
                </button>
              </div>
            </div>

            {activeModule === 'states' && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newStateName.trim()) return;
                    saveStateLocation({
                      id: `state-${Date.now()}`,
                      code: newStateCode.toUpperCase() || 'IN',
                      name: newStateName.trim(),
                      nameTelugu: newStateTelugu.trim() || newStateName.trim(),
                      type: 'STATE',
                      divisionLabel: 'Mandal',
                      active: true,
                    });
                    setNewStateCode('');
                    setNewStateName('');
                    setNewStateTelugu('');
                    showToast('Added State / UT location.');
                  }}
                  className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newStateCode}
                    onChange={(e) => setNewStateCode(e.target.value)}
                    placeholder="Code (e.g. TG)"
                    className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="State Name"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newStateTelugu}
                    onChange={(e) => setNewStateTelugu(e.target.value)}
                    placeholder="Telugu Name (తెలంగాణ)"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                  >
                    + Add State
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {states.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          [{st.code}] {st.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {st.nameTelugu} · {st.divisionLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => saveStateLocation({ ...st, active: !st.active })}
                          className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            st.active
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {st.active ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteStateLocation(st.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeModule === 'districts' && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDistName.trim()) return;
                    const stObj = states.find((s) => s.name === selectedStateForDist);
                    saveDistrictLocation({
                      id: `dist-${Date.now()}`,
                      stateCode: stObj?.code || 'IN',
                      stateName: selectedStateForDist,
                      name: newDistName.trim(),
                      nameTelugu: newDistTelugu.trim() || newDistName.trim(),
                      active: true,
                    });
                    setNewDistName('');
                    setNewDistTelugu('');
                    showToast(`Added district to ${selectedStateForDist}.`);
                  }}
                  className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <select
                    value={selectedStateForDist}
                    onChange={(e) => setSelectedStateForDist(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                  >
                    {states.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.nameTelugu})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newDistName}
                    onChange={(e) => setNewDistName(e.target.value)}
                    placeholder="New District Name"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newDistTelugu}
                    onChange={(e) => setNewDistTelugu(e.target.value)}
                    placeholder="District Telugu Name"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                  >
                    + Add District
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {districts
                    .filter((d) => d.stateName === selectedStateForDist)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{d.name}</p>
                          <p className="text-xs text-slate-500">
                            {d.nameTelugu} · {d.stateName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteDistrictLocation(d.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}

            {activeModule === 'mandals' && (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMandalName.trim()) return;
                    const stObj = states.find((s) => s.name === selectedStateForMandal);
                    saveMandalLocation({
                      id: `mandal-${Date.now()}`,
                      stateCode: stObj?.code || 'IN',
                      districtName: selectedDistForMandal,
                      name: newMandalName.trim(),
                      nameTelugu: newMandalTelugu.trim() || newMandalName.trim(),
                      divisionType: stObj?.divisionLabel || 'Mandal',
                      active: true,
                    });
                    setNewMandalName('');
                    setNewMandalTelugu('');
                    showToast(`Added mandal to ${selectedDistForMandal}.`);
                  }}
                  className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <select
                    value={selectedStateForMandal}
                    onChange={(e) => {
                      const st = e.target.value;
                      setSelectedStateForMandal(st);
                      const dList = getDistrictsForState(districts, st, true);
                      setSelectedDistForMandal(dList[0]?.name || '');
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                  >
                    {states.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedDistForMandal}
                    onChange={(e) => setSelectedDistForMandal(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                  >
                    {getDistrictsForState(districts, selectedStateForMandal, true).map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newMandalName}
                    onChange={(e) => setNewMandalName(e.target.value)}
                    placeholder="New Mandal / Tehsil Name"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newMandalTelugu}
                    onChange={(e) => setNewMandalTelugu(e.target.value)}
                    placeholder="Telugu Name"
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                  >
                    + Add Mandal
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mandals
                    .filter((m) => m.districtName === selectedDistForMandal)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-500">
                            {m.nameTelugu} · {m.districtName} ({m.divisionType})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteMandalLocation(m.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* MODULE 12: PRIVATE ADVERTISEMENTS MANAGEMENT */}
        {activeModule === 'private-ads' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Private Advertisements Management ({advertisements.length})
            </h2>
            <div className="divide-y divide-slate-200">
              {advertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-900">{ad.businessName}</span>
                      <span>·</span>
                      <span>
                        Target: {ad.targetMandal}, {ad.targetDistrict}, {ad.targetState}
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        ₹{ad.priceAmount} ({ad.paymentStatus})
                      </span>
                      <span>·</span>
                      <span className="font-bold text-blue-900">Status: {ad.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{ad.title}</h3>
                    <p className="text-xs text-slate-600">{ad.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        updatePrivateAd(ad.id, { status: 'APPROVED', paymentStatus: 'PAID' });
                        showToast('Advertisement approved for display.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Approve Ad
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updatePrivateAd(ad.id, { status: 'REJECTED' });
                        showToast('Advertisement rejected.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deletePrivateAd(ad.id);
                        showToast('Advertisement deleted.');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 13: GOOGLE ADSENSE SETTINGS */}
        {activeModule === 'google-adsense' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Google AdSense Integration Settings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure Publisher ID, Client ID, and Ad Slot IDs. Ads are hidden publicly until enabled and configured by Super Admin.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <input
                id="adsense-enable-toggle"
                type="checkbox"
                checked={adSenseSettings.enabled}
                onChange={(e) => updateAdSenseSettings({ enabled: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="adsense-enable-toggle" className="text-sm font-bold text-slate-900">
                Enable Google AdSense Globally Across Website
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Publisher ID</label>
                <input
                  type="text"
                  value={adSenseSettings.publisherId}
                  onChange={(e) => updateAdSenseSettings({ publisherId: e.target.value })}
                  placeholder="pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ad Client ID</label>
                <input
                  type="text"
                  value={adSenseSettings.clientId}
                  onChange={(e) => updateAdSenseSettings({ clientId: e.target.value })}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Header Ad Slot ID</label>
                <input
                  type="text"
                  value={adSenseSettings.headerSlotId}
                  onChange={(e) => updateAdSenseSettings({ headerSlotId: e.target.value })}
                  placeholder="Slot ID for Header"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homepage Ad Slot ID</label>
                <input
                  type="text"
                  value={adSenseSettings.homepageSlotId}
                  onChange={(e) => updateAdSenseSettings({ homepageSlotId: e.target.value })}
                  placeholder="Slot ID for Homepage"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  News Article Ad Slot ID
                </label>
                <input
                  type="text"
                  value={adSenseSettings.articleSlotId}
                  onChange={(e) => updateAdSenseSettings({ articleSlotId: e.target.value })}
                  placeholder="Slot ID for Article Body"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sidebar Ad Slot ID</label>
                <input
                  type="text"
                  value={adSenseSettings.sidebarSlotId}
                  onChange={(e) => updateAdSenseSettings({ sidebarSlotId: e.target.value })}
                  placeholder="Slot ID for Sidebar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Footer Ad Slot ID</label>
                <input
                  type="text"
                  value={adSenseSettings.footerSlotId}
                  onChange={(e) => updateAdSenseSettings({ footerSlotId: e.target.value })}
                  placeholder="Slot ID for Footer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Google AdSense configuration saved!')}
              className="px-5 py-2.5 rounded-lg bg-[#0A192F] text-white text-xs font-bold cursor-pointer"
            >
              Save AdSense Configuration
            </button>
          </div>
        )}

        {/* MODULES 14, 15, 16, 17, 18, 19: WEBSITE CMS & BRANDING SETTINGS */}
        {(activeModule === 'homepage-management' ||
          activeModule === 'logo-branding' ||
          activeModule === 'website-pages' ||
          activeModule === 'contact-details' ||
          activeModule === 'social-media' ||
          activeModule === 'seo-settings') && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Website Settings, Logo Change, Branding, Contact &amp; CMS Pages ({activeModule})
            </h2>

            {/* DEDICATED WEBSITE LOGO UPLOAD & MANAGEMENT PANEL */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                    OFFICIAL PORTAL LOGO MANAGEMENT • వెబ్‌సైట్ లోగో మార్పు
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    Upload or Change NETI BHARATHAM Website Logo
                  </h3>
                  <p className="text-xs text-slate-600">
                    Changes immediately update the Website Header, Footer, and Press Reporter ID Cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateWebsiteSettings({ logoUrl: OFFICIAL_TRICOLOUR_LOGO_URL });
                    showToast('Restored official NETI BHARATHAM Tricolour Logo!');
                  }}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Restore Official Tricolour Logo
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Live Logo Previews */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
                    <img
                      src={websiteSettings.logoUrl || OFFICIAL_TRICOLOUR_LOGO_URL}
                      alt="Logo Preview on Light Background"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 object-contain"
                    />
                    <span className="text-[11px] font-bold text-slate-600">
                      Light Surface Preview
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A192F] border border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                    <img
                      src={websiteSettings.logoUrl || OFFICIAL_TRICOLOUR_LOGO_URL}
                      alt="Logo Preview on Dark Header"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full bg-white p-1 object-contain border border-white/30"
                    />
                    <span className="text-[11px] font-bold text-slate-200">
                      Header &amp; ID Card Preview
                    </span>
                  </div>
                </div>

                {/* Upload File Input + Direct Logo URL Input */}
                <div className="lg:col-span-7 space-y-4 text-xs">
                  <div>
                    <label
                      htmlFor="admin-logo-file-upload"
                      className="block font-extrabold text-slate-900 mb-1.5"
                    >
                      1. Upload New Logo Image File (PNG, JPG, JPEG, SVG, WebP) — లోగో ఫైల్ అప్‌లోడ్ చేయండి:
                    </label>
                    <input
                      id="admin-logo-file-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      onChange={handleLogoFileUpload}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="admin-logo-url-input"
                      className="block font-extrabold text-slate-900 mb-1.5"
                    >
                      2. Or Enter Logo Image URL / Path Directly:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="admin-logo-url-input"
                        type="text"
                        value={websiteSettings.logoUrl || ''}
                        onChange={(e) => updateWebsiteSettings({ logoUrl: e.target.value })}
                        placeholder="/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => showToast('Website logo updated and saved live!')}
                        className="px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white font-bold cursor-pointer shrink-0"
                      >
                        Apply Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Website Brand Name</label>
                <input
                  type="text"
                  value={websiteSettings.siteName}
                  onChange={(e) => updateWebsiteSettings({ siteName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Website Telugu Title (తెలుగు పేరు)
                </label>
                <input
                  type="text"
                  value={websiteSettings.siteNameTelugu}
                  onChange={(e) => updateWebsiteSettings({ siteNameTelugu: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Domain</label>
                <input
                  type="text"
                  value={websiteSettings.domain}
                  onChange={(e) => updateWebsiteSettings({ domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={websiteSettings.contactEmail}
                  onChange={(e) => updateWebsiteSettings({ contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  value={websiteSettings.locationAddress}
                  onChange={(e) => updateWebsiteSettings({ locationAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emergency Contact (Printed on Press ID Card Back)
                </label>
                <input
                  type="text"
                  value={websiteSettings.emergencyContact}
                  onChange={(e) => updateWebsiteSettings({ emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">About Us Content</label>
                <textarea
                  rows={3}
                  value={websiteSettings.aboutUsContent}
                  onChange={(e) => updateWebsiteSettings({ aboutUsContent: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Privacy Policy Content
                </label>
                <textarea
                  rows={3}
                  value={websiteSettings.privacyPolicyContent}
                  onChange={(e) => updateWebsiteSettings({ privacyPolicyContent: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Terms &amp; Conditions Content
                </label>
                <textarea
                  rows={3}
                  value={websiteSettings.termsContent}
                  onChange={(e) => updateWebsiteSettings({ termsContent: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Website settings & CMS pages saved live!')}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
            >
              Save All Website Settings
            </button>
          </div>
        )}

        {/* MODULES 20, 21, 22, 23, 24: NOTIFICATIONS, ADMIN USERS, SECURITY, AUDIT LOGS, BACKUP */}
        {(activeModule === 'email-notifications' ||
          activeModule === 'admin-users' ||
          activeModule === 'security-settings' ||
          activeModule === 'audit-logs' ||
          activeModule === 'backup-export') && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Security, Audit Logs, Notifications &amp; Database Backup ({activeModule})
                </h2>
                <p className="text-xs text-slate-500">
                  All Admin and Reporter actions are logged chronologically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackupJson}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A192F] text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Portal JSON Backup</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                Immutable Audit Trail ({auditLogs.length} Events)
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-red-700">{log.action}</span> ·{' '}
                      <span className="font-semibold text-slate-900">{log.actorName}</span> (
                      {log.actorRole})
                      <p className="text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                6-Month Membership Renewal History ({renewals.length}) &amp; Notifications (
                {notifications.length})
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {renewals.map((ren) => (
                  <div key={ren.id} className="p-3 bg-slate-50 text-xs flex justify-between">
                    <span>
                      Reporter <strong>{ren.reporterId}</strong> renewed until{' '}
                      <strong>{new Date(ren.newExpiry).toLocaleDateString('en-IN')}</strong> —{' '}
                      {ren.remarks}
                    </span>
                    <span className="font-mono text-slate-500">
                      {new Date(ren.renewedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL REPORTER PROFILE EDITOR MODAL (SUPER ADMIN ONLY) */}
      {editingReporter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Super Admin Full Reporter Editor — {editingReporter.fullName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingReporter.fullName}
                  onChange={(e) =>
                    setEditingReporter({ ...editingReporter, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editingReporter.mobile}
                  onChange={(e) =>
                    setEditingReporter({ ...editingReporter, mobile: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">State</label>
                <input
                  type="text"
                  value={editingReporter.state}
                  onChange={(e) =>
                    setEditingReporter({ ...editingReporter, state: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">District</label>
                <input
                  type="text"
                  value={editingReporter.district}
                  onChange={(e) =>
                    setEditingReporter({ ...editingReporter, district: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1">Mandal</label>
                <input
                  type="text"
                  value={editingReporter.mandal}
                  onChange={(e) =>
                    setEditingReporter({ ...editingReporter, mandal: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingReporter(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = updateReporterProfile(
                    editingReporter.uid,
                    editingReporter,
                    'SUPER_ADMIN'
                  );
                  showToast(res.message);
                  setEditingReporter(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
              >
                Save Reporter Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEWS EDITOR MODAL */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit News Article</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Headline</label>
                <input
                  type="text"
                  value={editingNews.headline}
                  onChange={(e) => setEditingNews({ ...editingNews, headline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Content</label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingNews(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = updateNewsArticle(editingNews.id, editingNews);
                  showToast(res.message);
                  setEditingNews(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR DESTRUCTIVE ACTIONS */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Destructive Action</h3>
            <p className="text-xs text-slate-600">{confirmDeleteModal.title}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteModal.onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
