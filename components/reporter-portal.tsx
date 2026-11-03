'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  ShieldAlert,
  Lock,
  Upload,
  FileText,
  Megaphone,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  Search,
  KeyRound,
  MapPin,
} from 'lucide-react';
import { usePortal } from '@/lib/portal-context';
import { getDistrictsForState, getMandalsForDistrict } from '@/lib/india-locations';
import {
  canReporterUploadNews,
  getMembershipValidityStatus,
  generateQrMatrix,
} from '@/lib/portal-rules';
import { ReporterIdCard } from './reporter-id-card';

interface ReporterPortalProps {
  initialTab?: 'login' | 'register' | 'dashboard' | 'verify';
  initialVerifyId?: string;
  onNavigateHome: () => void;
}

export const ReporterPortal: React.FC<ReporterPortalProps> = ({
  initialTab = 'login',
  initialVerifyId = 'NB-TG-HYD-2026-0001',
  onNavigateHome,
}) => {
  const {
    currentReporter,
    loginAsReporter,
    logoutReporter,
    registerReporter,
    states,
    districts,
    mandals,
    categories,
    news,
    advertisements,
    reporterIdCards,
    websiteSettings,
    submitNewsArticle,
    submitPrivateAd,
    updateReporterProfile,
    changeReporterPassword,
  } = usePortal();

  const [activeView, setActiveView] = useState<'login' | 'register' | 'dashboard' | 'verify'>(
    currentReporter && initialTab === 'login' ? 'dashboard' : initialTab
  );

  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Registration 21 Fields State
  const [regForm, setRegForm] = useState({
    fullName: '',
    fatherOrHusbandName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    whatsapp: '',
    email: '',
    residentialAddress: '',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Khairatabad',
    villageOrTown: '',
    pinCode: '',
    experience: '',
    previousOrganization: '',
    profilePhotoUrl: '/icon.svg',
    aadhaarDocumentUrl: '',
    aadhaarFileName: '',
    aadhaarFileType: '',
    username: '',
    password: '',
    confirmPassword: '',
    consentAccepted: false,
  });
  const [regFeedback, setRegFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Dashboard Sub-Tab State
  const [dashTab, setDashTab] = useState<
    'overview' | 'idcard' | 'upload-news' | 'my-news' | 'private-ads' | 'profile-edit'
  >('overview');

  // News Upload 18 Fields State
  const [newsForm, setNewsForm] = useState({
    headline: '',
    subheadline: '',
    content: '',
    category: 'State News',
    state: currentReporter?.state || 'Telangana',
    district: currentReporter?.district || 'Hyderabad',
    mandal: currentReporter?.mandal || 'Khairatabad',
    villageOrTown: currentReporter?.villageOrTown || '',
    featuredImageUrl: '/news-art/secretariat.svg',
    galleryImages: ['/news-art/secretariat.svg'] as string[],
    imageCaption: '',
    videoUrl: '',
    tagsInput: 'Telangana, LocalNews',
    seoTitle: '',
    seoDescription: '',
    language: 'Bilingual' as 'Telugu' | 'English' | 'Bilingual',
    isBreaking: false,
  });
  const [newsFeedback, setNewsFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Private Ad Submission State (Max 2 images)
  const [adForm, setAdForm] = useState({
    title: '',
    businessName: '',
    contactNumber: '',
    description: '',
    image1Url: '/news-art/secretariat.svg',
    image2Url: '',
    linkUrl: '',
    targetState: currentReporter?.state || 'Telangana',
    targetDistrict: currentReporter?.district || 'Hyderabad',
    targetMandal: currentReporter?.mandal || 'Khairatabad',
    startDate: '2026-11-02',
    expiryDate: '2026-12-02',
  });
  const [adFeedback, setAdFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Profile Edit State (Only Residential Address & Password allowed)
  const [editAddress, setEditAddress] = useState(currentReporter?.residentialAddress || '');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [profileFeedback, setProfileFeedback] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  // Public QR Verification Search State
  const [verifyQueryId, setVerifyQueryId] = useState(initialVerifyId);

  const handleFileUploadToDataUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (dataUrl: string, file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 450 * 1024) {
      onLoaded('/icon.svg', file);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result, file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReporterLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsReporter(loginUsername, loginPassword);
    if (res.ok) {
      setLoginMessage({ type: 'ok', text: res.message });
      setActiveView('dashboard');
    } else {
      setLoginMessage({ type: 'err', text: res.message });
    }
  };

  const handleQuickRoleSwitch = (username: string) => {
    const res = loginAsReporter(username, 'Reporter@123');
    if (res.ok) {
      setLoginMessage({ type: 'ok', text: res.message });
      setActiveView('dashboard');
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegFeedback(null);

    if (!regForm.fullName.trim() || !regForm.fatherOrHusbandName.trim() || !regForm.dob) {
      setRegFeedback({
        type: 'err',
        text: 'Please fill in Full Name, Father/Husband Name, and Date of Birth.',
      });
      return;
    }
    const cleanMob = regForm.mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMob)) {
      setRegFeedback({
        type: 'err',
        text: 'Please enter a valid 10-digit Indian Mobile Number.',
      });
      return;
    }
    if (!regForm.email.includes('@')) {
      setRegFeedback({ type: 'err', text: 'Please enter a valid Email Address.' });
      return;
    }
    if (!regForm.state || !regForm.district || !regForm.mandal || !regForm.villageOrTown.trim()) {
      setRegFeedback({
        type: 'err',
        text: 'Please select State, District, Mandal, and enter Village/Town.',
      });
      return;
    }
    if (!/^\d{6}$/.test(regForm.pinCode.trim())) {
      setRegFeedback({ type: 'err', text: 'Please enter a valid 6-digit PIN Code.' });
      return;
    }
    if (!regForm.aadhaarDocumentUrl) {
      setRegFeedback({
        type: 'err',
        text: 'Please upload your Aadhaar document (JPG, PNG, or PDF) for identity verification.',
      });
      return;
    }
    if (regForm.password.length < 6) {
      setRegFeedback({ type: 'err', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegFeedback({ type: 'err', text: 'Password and Confirm Password do not match.' });
      return;
    }
    if (!regForm.consentAccepted) {
      setRegFeedback({
        type: 'err',
        text: 'You must accept the Terms and Privacy Consent.',
      });
      return;
    }

    const res = registerReporter({
      fullName: regForm.fullName,
      fatherOrHusbandName: regForm.fatherOrHusbandName,
      dob: regForm.dob,
      gender: regForm.gender,
      mobile: cleanMob,
      whatsapp: regForm.whatsapp || cleanMob,
      email: regForm.email,
      residentialAddress: regForm.residentialAddress,
      state: regForm.state,
      district: regForm.district,
      mandal: regForm.mandal,
      villageOrTown: regForm.villageOrTown,
      pinCode: regForm.pinCode,
      experience: regForm.experience || 'Fresher',
      previousOrganization: regForm.previousOrganization || 'Independent',
      profilePhotoUrl: regForm.profilePhotoUrl || '/icon.svg',
      aadhaarDocumentUrl: regForm.aadhaarDocumentUrl,
      aadhaarFileName: regForm.aadhaarFileName || 'aadhaar_document.jpg',
      aadhaarFileType: regForm.aadhaarFileType || 'image/jpeg',
      username: regForm.username,
      password: regForm.password,
      consentAccepted: regForm.consentAccepted,
    });

    if (res.ok) {
      setRegFeedback({ type: 'ok', text: res.message });
      setActiveView('dashboard');
    } else {
      setRegFeedback({ type: 'err', text: res.message });
    }
  };

  const handleNewsUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReporter) return;
    setNewsFeedback(null);

    const tags = newsForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    const res = submitNewsArticle({
      headline: newsForm.headline,
      subheadline: newsForm.subheadline,
      content: newsForm.content,
      category: newsForm.category,
      state: newsForm.state,
      district: newsForm.district,
      mandal: newsForm.mandal,
      villageOrTown: newsForm.villageOrTown || currentReporter.villageOrTown,
      featuredImageUrl: newsForm.featuredImageUrl || '/news-art/secretariat.svg',
      galleryImages: newsForm.galleryImages,
      imageCaption: newsForm.imageCaption,
      videoUrl: newsForm.videoUrl,
      tags,
      seoTitle: newsForm.seoTitle || newsForm.headline.slice(0, 160),
      seoDescription:
        newsForm.seoDescription || newsForm.subheadline || newsForm.content.slice(0, 200),
      language: newsForm.language,
      isBreaking: newsForm.isBreaking,
      isFeatured: false,
      isTrending: false,
      reporterUid: currentReporter.uid,
      reporterId: currentReporter.reporterId,
      reporterName: currentReporter.fullName,
    });

    if (res.ok) {
      setNewsFeedback({ type: 'ok', text: res.message });
      setNewsForm((prev) => ({
        ...prev,
        headline: '',
        subheadline: '',
        content: '',
        imageCaption: '',
        videoUrl: '',
        seoTitle: '',
        seoDescription: '',
        isBreaking: false,
      }));
    } else {
      setNewsFeedback({ type: 'err', text: res.message });
    }
  };

  const handlePrivateAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReporter) return;
    setAdFeedback(null);

    const res = submitPrivateAd({
      title: adForm.title,
      businessName: adForm.businessName,
      contactNumber: adForm.contactNumber,
      description: adForm.description,
      image1Url: adForm.image1Url,
      image2Url: adForm.image2Url,
      linkUrl: adForm.linkUrl,
      targetState: adForm.targetState,
      targetDistrict: adForm.targetDistrict,
      targetMandal: adForm.targetMandal,
      startDate: adForm.startDate,
      expiryDate: adForm.expiryDate,
      position: 'SIDEBAR',
      priceAmount: 2500,
      paymentStatus: 'PENDING',
      reporterUid: currentReporter.uid,
      reporterId: currentReporter.reporterId,
    });

    if (res.ok) {
      setAdFeedback({ type: 'ok', text: res.message });
      setAdForm((prev) => ({
        ...prev,
        title: '',
        businessName: '',
        contactNumber: '',
        description: '',
      }));
    } else {
      setAdFeedback({ type: 'err', text: res.message });
    }
  };

  const handleAddressSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReporter) return;
    const res = updateReporterProfile(
      currentReporter.uid,
      { residentialAddress: editAddress },
      'REPORTER'
    );
    setProfileFeedback({ type: res.ok ? 'ok' : 'err', text: res.message });
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReporter) return;
    if (newPass !== confirmNewPass) {
      setProfileFeedback({ type: 'err', text: 'New password and confirmation do not match.' });
      return;
    }
    const res = changeReporterPassword(currentReporter.uid, newPass);
    setProfileFeedback({ type: res.ok ? 'ok' : 'err', text: res.message });
    if (res.ok) {
      setNewPass('');
      setConfirmNewPass('');
    }
  };

  const regDistricts = getDistrictsForState(districts, regForm.state);
  const regMandals = getMandalsForDistrict(mandals, regForm.district);

  const newsDistricts = getDistrictsForState(districts, newsForm.state);
  const newsMandals = getMandalsForDistrict(mandals, newsForm.district);

  const adDistricts = getDistrictsForState(districts, adForm.targetState);
  const adMandals = getMandalsForDistrict(mandals, adForm.targetDistrict);

  const verifiedCardRecord = reporterIdCards.find(
    (c) => c.reporterId.toLowerCase() === verifyQueryId.trim().toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('login')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'login'
                ? 'bg-[#0A192F] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Reporter Login / లాగిన్
          </button>
          <button
            type="button"
            onClick={() => setActiveView('register')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'register'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Reporter Registration / కొత్త రిపోర్టర్ నమోదు
          </button>
          <button
            type="button"
            onClick={() => setActiveView('verify')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'verify'
                ? 'bg-[#0A192F] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Verify Reporter ID (QR) / ఐడి ధృవీకరణ
          </button>
          {currentReporter && (
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Reporter Dashboard ({currentReporter.username})
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
        >
          ← Back to News Portal
        </button>
      </div>

      {/* 1. REPORTER LOGIN VIEW */}
      {activeView === 'login' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                ACCREDITED PRESS PORTAL
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Reporter Login • రిపోర్టర్ లాగిన్
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Sign in with your unique NETI BHARATHAM Reporter Username and Password.
              </p>
            </div>

            {loginMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold border ${
                  loginMessage.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {loginMessage.text}
              </div>
            )}

            <form onSubmit={handleReporterLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="rep-login-user"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Username / యూజర్‌నేమ్
                </label>
                <input
                  id="rep-login-user"
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g., venkat_hyd"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>
              <div>
                <label
                  htmlFor="rep-login-pass"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Password / పాస్‌వర్డ్
                </label>
                <input
                  id="rep-login-pass"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Sign In to Reporter Dashboard
              </button>
            </form>
          </div>

          {/* Quick Role Verification Switcher */}
          <div className="lg:col-span-6 bg-[#0A192F] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                INSTANT ROLE TESTING &amp; AUDIT
              </p>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Test Reporter Account States (Approved / Pending / Expired)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Verify how NETI BHARATHAM enforces 6-month membership validity, news upload permissions, and profile edit restrictions across reporter statuses:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-emerald-400">
                    1. APPROVED &amp; ACTIVE REPORTER (Hyderabad)
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    K. Venkatacharyulu (ID: NB-TG-HYD-2026-0001)
                  </p>
                  <p className="text-xs text-slate-400">
                    Can upload news &amp; ads · Has downloadable Press ID Card · Restricted profile edit
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSwitch('venkat_hyd')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Open Approved Account
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-amber-400">
                    2. PENDING REPORTER (Khammam)
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    C. Srinivasa Rao (Status: PENDING)
                  </p>
                  <p className="text-xs text-slate-400">
                    Cannot upload news before Super Admin approval
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSwitch('srinivas_kmm')}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Open Pending Account
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-red-400">
                    3. EXPIRED REPORTER (Hanumakonda)
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    M. Rajender Reddy (ID: NB-TG-HAN-2026-0003)
                  </p>
                  <p className="text-xs text-slate-400">
                    6-month validity expired · News upload disabled until Admin renewal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickRoleSwitch('rajender_wgl')}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Open Expired Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REPORTER REGISTRATION VIEW (All 21 Required Fields) */}
      {activeView === 'register' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              OFFICIAL PRESS ACCREDITATION APPLICATION
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              NETI BHARATHAM Reporter Registration • రిపోర్టర్ రిజిస్ట్రేషన్ ఫారమ్
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Complete all 21 mandatory fields below. Upon Super Admin verification and approval, your unique Reporter ID and 6-month Digital Press Identity Card will be generated automatically.
            </p>
          </div>

          {regFeedback && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold border ${
                regFeedback.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {regFeedback.text}
            </div>
          )}

          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Full Name (పూర్తి పేరు) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Enter full legal name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Father / Husband Name (తండ్రి / భర్త పేరు) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.fatherOrHusbandName}
                  onChange={(e) =>
                    setRegForm({ ...regForm, fatherOrHusbandName: e.target.value })
                  }
                  placeholder="Father or Husband Name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Date of Birth (పుట్టిన తేదీ) *
                </label>
                <input
                  type="date"
                  required
                  value={regForm.dob}
                  onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Gender (లింగం) *
                </label>
                <select
                  value={regForm.gender}
                  onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Male">Male / పురుషుడు</option>
                  <option value="Female">Female / స్త్రీ</option>
                  <option value="Other">Other / ఇతర</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. Mobile Number (మొబైల్ నంబర్) *
                </label>
                <input
                  type="tel"
                  required
                  value={regForm.mobile}
                  onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6. WhatsApp Number (వాట్సాప్ నంబర్) *
                </label>
                <input
                  type="tel"
                  required
                  value={regForm.whatsapp}
                  onChange={(e) => setRegForm({ ...regForm, whatsapp: e.target.value })}
                  placeholder="10-digit WhatsApp number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  7. Email Address (ఇమెయిల్ చిరునామా) *
                </label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="reporter@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  8. Complete Residential Address (పూర్తి నివాస చిరునామా) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.residentialAddress}
                  onChange={(e) =>
                    setRegForm({ ...regForm, residentialAddress: e.target.value })
                  }
                  placeholder="House No, Street, Landmark, Area"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* Hierarchical Location Dropdowns: State -> District -> Mandal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  9. State / Union Territory (రాష్ట్రం) *
                </label>
                <select
                  value={regForm.state}
                  onChange={(e) => {
                    const nextState = e.target.value;
                    const dList = getDistrictsForState(districts, nextState);
                    const firstDist = dList[0]?.name || '';
                    const mList = getMandalsForDistrict(mandals, firstDist);
                    setRegForm({
                      ...regForm,
                      state: nextState,
                      district: firstDist,
                      mandal: mList[0]?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {states
                    .filter((s) => s.active)
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.nameTelugu})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10. District (జిల్లా) *
                </label>
                <select
                  value={regForm.district}
                  onChange={(e) => {
                    const nextDist = e.target.value;
                    const mList = getMandalsForDistrict(mandals, nextDist);
                    setRegForm({
                      ...regForm,
                      district: nextDist,
                      mandal: mList[0]?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {regDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.nameTelugu})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  11. Mandal / Tehsil / Taluk (మండలం) *
                </label>
                <select
                  value={regForm.mandal}
                  onChange={(e) => setRegForm({ ...regForm, mandal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {regMandals.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.nameTelugu})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  12. Village / Town (గ్రామం / పట్టణం) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.villageOrTown}
                  onChange={(e) => setRegForm({ ...regForm, villageOrTown: e.target.value })}
                  placeholder="Enter Village or Town"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  13. PIN Code (పిన్ కోడ్) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={regForm.pinCode}
                  onChange={(e) => setRegForm({ ...regForm, pinCode: e.target.value })}
                  placeholder="6-digit PIN Code"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  14. Reporter Experience (అనుభవం) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.experience}
                  onChange={(e) => setRegForm({ ...regForm, experience: e.target.value })}
                  placeholder="e.g., 3 Years in Print/Digital Media"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  15. Previous Media Organization (గత మీడియా సంస్థ) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.previousOrganization}
                  onChange={(e) =>
                    setRegForm({ ...regForm, previousOrganization: e.target.value })
                  }
                  placeholder="Previous newspaper/channel or Independent"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  16. Profile Photograph (ప్రొఫైల్ ఫోటో - Camera/Gallery) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) =>
                    handleFileUploadToDataUrl(e, (url) =>
                      setRegForm((prev) => ({ ...prev, profilePhotoUrl: url }))
                    )
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  17. Aadhaar Document Upload (ఆధార్ డాక్యుమెంట్ - JPG/PNG/PDF) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) =>
                    handleFileUploadToDataUrl(e, (url, file) =>
                      setRegForm((prev) => ({
                        ...prev,
                        aadhaarDocumentUrl: url,
                        aadhaarFileName: file.name,
                        aadhaarFileType: file.type || 'application/octet-stream',
                      }))
                    )
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Stored in encrypted private collection; never visible publicly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  18. Unique Username (యూజర్‌నేమ్) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  placeholder="Choose a unique username"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  19. Password (పాస్‌వర్డ్) *
                </label>
                <input
                  type="password"
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  20. Confirm Password (పాస్‌వర్డ్ నిర్ధారణ) *
                </label>
                <input
                  type="password"
                  required
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                id="reg-consent"
                type="checkbox"
                checked={regForm.consentAccepted}
                onChange={(e) => setRegForm({ ...regForm, consentAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 accent-red-600"
              />
              <label htmlFor="reg-consent" className="text-xs text-slate-700 leading-relaxed">
                <strong>21. Terms and Privacy Consent:</strong> I hereby declare that all details and
                documents submitted above are true and accurate. I agree to abide by the journalistic
                ethics and guidelines of <strong>NETI BHARATHAM (నేటి భారతం)</strong> and understand
                that my Press Reporter ID card is valid for 6 calendar months from approval date.
              </label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Submit Reporter Application (status: PENDING)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. PUBLIC QR REPORTER ID VERIFICATION PAGE */}
      {activeView === 'verify' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                PUBLIC QR CODE IDENTITY VERIFICATION
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Verify NETI BHARATHAM Press Reporter ID • రిపోర్టర్ ఐడి ఆన్‌లైన్ ధృవీకరణ
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Displays only approved public press identity details. Confidential Aadhaar documents, passwords, and private residential addresses are strictly isolated and never exposed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={verifyQueryId}
                onChange={(e) => setVerifyQueryId(e.target.value)}
                placeholder="Enter Reporter ID (e.g. NB-TG-HYD-2026-0001)"
                aria-label="Enter Reporter ID to Verify"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sample IDs:</span>
              {reporterIdCards.map((c) => (
                <button
                  key={c.reporterId}
                  type="button"
                  onClick={() => setVerifyQueryId(c.reporterId)}
                  className={`px-3 py-1.5 rounded-md font-mono font-semibold border cursor-pointer ${
                    verifyQueryId === c.reporterId
                      ? 'bg-[#0A192F] text-white border-[#0A192F]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.reporterId} ({c.status})
                </button>
              ))}
            </div>
          </div>

          {verifiedCardRecord ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="lg:col-span-4 flex flex-col items-center text-center bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <img
                  src={verifiedCardRecord.profilePhotoUrl || '/icon.svg'}
                  alt={verifiedCardRecord.fullName}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-[#0A192F]"
                />
                <h3 className="text-lg font-extrabold text-slate-900">
                  {verifiedCardRecord.fullName}
                </h3>
                <p className="text-xs font-mono font-bold text-blue-900">
                  {verifiedCardRecord.reporterId}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${
                    verifiedCardRecord.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {verifiedCardRecord.status === 'ACTIVE' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>VERIFIED STATUS: {verifiedCardRecord.status}</span>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      PUBLIC ACCREDITATION RECORD
                    </p>
                    <h4 className="text-base font-bold text-slate-900">
                      NETI BHARATHAM (నేటి భారతం) Official Verification
                    </h4>
                  </div>
                  <div className="p-1.5 border border-slate-200 rounded-lg">
                    <svg viewBox="0 0 21 21" width="52" height="52" shapeRendering="crispEdges">
                      <rect width="21" height="21" fill="#FFFFFF" />
                      {generateQrMatrix(verifiedCardRecord.reporterId).map((row, rIdx) =>
                        row.map((cell, cIdx) =>
                          cell ? (
                            <rect
                              key={`${rIdx}-${cIdx}`}
                              x={cIdx}
                              y={rIdx}
                              width={1}
                              height={1}
                              fill="#0A192F"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">Designation</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">
                      {verifiedCardRecord.designation}
                    </dd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">Assigned State</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{verifiedCardRecord.state}</dd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">Assigned District</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">
                      {verifiedCardRecord.district}
                    </dd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">Assigned Mandal</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{verifiedCardRecord.mandal}</dd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">Registered Mobile (Masked)</dt>
                    <dd className="font-mono font-bold text-slate-900 mt-0.5">
                      {verifiedCardRecord.mobileMasked}
                    </dd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <dt className="text-slate-500">6-Month Validity Period</dt>
                    <dd className="font-mono font-bold text-slate-900 mt-0.5">
                      {new Date(verifiedCardRecord.issuedAt).toLocaleDateString('en-IN')} →{' '}
                      {new Date(verifiedCardRecord.expiresAt).toLocaleDateString('en-IN')}
                    </dd>
                  </div>
                </dl>

                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Privacy Protection Notice: In compliance with security rules, Aadhaar numbers,
                  private residential addresses, and authentication credentials are never displayed on
                  this public verification page.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-bold text-slate-800">
                No Approved Reporter ID found matching &ldquo;{verifyQueryId}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Please verify the Reporter ID printed on the NETI BHARATHAM Press Card.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. SECURE REPORTER DASHBOARD */}
      {activeView === 'dashboard' && currentReporter && (
        <div className="space-y-6">
          {/* Reporter Header Banner */}
          <div className="bg-[#0A192F] text-white p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentReporter.profilePhotoUrl || '/icon.svg'}
                alt={currentReporter.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border-2 border-red-500 bg-slate-900 shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-red-400">
                    ID: {currentReporter.reporterId}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-slate-300">
                    {currentReporter.mandal}, {currentReporter.district}, {currentReporter.state}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  {currentReporter.fullName}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Account Status:{' '}
                  <strong
                    className={
                      currentReporter.status === 'APPROVED'
                        ? 'text-emerald-400'
                        : currentReporter.status === 'PENDING'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }
                  >
                    {currentReporter.status}
                  </strong>
                  {currentReporter.expiresAt && (
                    <>
                      {' '}
                      · 6-Month Validity Countdown:{' '}
                      <strong className="font-mono text-white">
                        {
                          getMembershipValidityStatus(currentReporter.expiresAt)
                            .daysRemaining
                        }{' '}
                        days remaining
                      </strong>{' '}
                      (Expires{' '}
                      {new Date(currentReporter.expiresAt).toLocaleDateString('en-IN')})
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditAddress(currentReporter.residentialAddress);
                  setDashTab('upload-news');
                }}
                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                + Upload News Article
              </button>
              <button
                type="button"
                onClick={() => {
                  logoutReporter();
                  setActiveView('login');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'overview', label: 'Overview & Stats', icon: UserCheck },
              { id: 'idcard', label: 'Digital Press ID Card', icon: CreditCard },
              { id: 'upload-news', label: 'Upload News', icon: Upload },
              { id: 'my-news', label: 'My News Articles', icon: FileText },
              { id: 'private-ads', label: 'Private Advertisements', icon: Megaphone },
              { id: 'profile-edit', label: 'Address & Password', icon: Lock },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setEditAddress(currentReporter.residentialAddress);
                    setDashTab(t.id as typeof dashTab);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    dashTab === t.id
                      ? 'bg-[#0A192F] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & STATS */}
          {dashTab === 'overview' && (
            <div className="space-y-6">
              {(() => {
                const myNews = news.filter((n) => n.reporterUid === currentReporter.uid);
                const pubCount = myNews.filter((n) => n.status === 'PUBLISHED').length;
                const pendCount = myNews.filter((n) => n.status === 'PENDING').length;
                const rejCount = myNews.filter((n) => n.status === 'REJECTED').length;
                const myAds = advertisements.filter((a) => a.reporterUid === currentReporter.uid);
                const eligibility = canReporterUploadNews(currentReporter);

                return (
                  <>
                    {!eligibility.allowed && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-sm">
                            News Upload Restricted ({currentReporter.status})
                          </p>
                          <p>{eligibility.reason}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Total Uploaded News</p>
                        <p className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1">
                          {myNews.length}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Published News</p>
                        <p className="text-2xl font-black text-emerald-700 font-mono tabular-nums mt-1">
                          {pubCount}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Pending Review</p>
                        <p className="text-2xl font-black text-amber-600 font-mono tabular-nums mt-1">
                          {pendCount}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Rejected News</p>
                        <p className="text-2xl font-black text-red-600 font-mono tabular-nums mt-1">
                          {rejCount}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500">Ad Submissions</p>
                        <p className="text-2xl font-black text-blue-900 font-mono tabular-nums mt-1">
                          {myAds.length}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 2: DIGITAL PRESS ID CARD */}
          {dashTab === 'idcard' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              {currentReporter.status === 'PENDING' || currentReporter.status === 'REJECTED' ? (
                <div className="p-8 text-center space-y-2">
                  <Clock className="w-10 h-10 text-amber-600 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Press Reporter ID Card Pending Approval
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your application status is currently <strong>{currentReporter.status}</strong>.
                    Once Super Admin approves your application, your unique Reporter ID and 6-month
                    Digital Press Identity Card will appear here for download and printing.
                  </p>
                </div>
              ) : (
                <ReporterIdCard
                  reporter={currentReporter}
                  websiteSettings={websiteSettings}
                  onVerifyClick={(id) => {
                    setVerifyQueryId(id);
                    setActiveView('verify');
                  }}
                />
              )}
            </div>
          )}

          {/* TAB 3: UNLIMITED NEWS UPLOAD SYSTEM (18 Required Fields) */}
          {dashTab === 'upload-news' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  REPORTER NEWS DESK • UNLIMITED ARTICLE UPLOAD
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Submit News Article for Admin Review • వార్తను అప్‌లోడ్ చేయండి
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Reporter ID <strong className="font-mono">{currentReporter.reporterId}</strong> is
                  assigned automatically. Submitted news defaults to <strong>PENDING</strong> until
                  Super Admin approval.
                </p>
              </div>

              {newsFeedback && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold border ${
                    newsFeedback.type === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {newsFeedback.text}
                </div>
              )}

              {!canReporterUploadNews(currentReporter).allowed ? (
                <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2">
                  <p className="font-bold text-sm">
                    News Upload Locked — Account Status: {currentReporter.status}
                  </p>
                  <p className="text-xs">{canReporterUploadNews(currentReporter).reason}</p>
                </div>
              ) : (
                <form onSubmit={handleNewsUploadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        1. News Headline (వార్త శీర్షిక) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newsForm.headline}
                        onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                        placeholder="Enter compelling Telugu or English headline"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. Subheadline (ఉప శీర్షిక) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newsForm.subheadline}
                        onChange={(e) => setNewsForm({ ...newsForm, subheadline: e.target.value })}
                        placeholder="Concise summary deck"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        3. Full News Content (పూర్తి వార్త వివరాలు) *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        placeholder="Write complete verified news story..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4. News Category (విభాగం) *
                      </label>
                      <select
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        {categories
                          .filter((c) => c.active)
                          .map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.nameTelugu})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        5. State (రాష్ట్రం) *
                      </label>
                      <select
                        value={newsForm.state}
                        onChange={(e) => {
                          const st = e.target.value;
                          const dList = getDistrictsForState(districts, st);
                          const firstDist = dList[0]?.name || '';
                          const mList = getMandalsForDistrict(mandals, firstDist);
                          setNewsForm({
                            ...newsForm,
                            state: st,
                            district: firstDist,
                            mandal: mList[0]?.name || '',
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        {states
                          .filter((s) => s.active)
                          .map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({s.nameTelugu})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        6. District (జిల్లా) *
                      </label>
                      <select
                        value={newsForm.district}
                        onChange={(e) => {
                          const dist = e.target.value;
                          const mList = getMandalsForDistrict(mandals, dist);
                          setNewsForm({
                            ...newsForm,
                            district: dist,
                            mandal: mList[0]?.name || '',
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        {newsDistricts.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} ({d.nameTelugu})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        7. Mandal (మండలం) *
                      </label>
                      <select
                        value={newsForm.mandal}
                        onChange={(e) => setNewsForm({ ...newsForm, mandal: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        {newsMandals.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.nameTelugu})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        8. Village / Town (గ్రామం / పట్టణం) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newsForm.villageOrTown}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, villageOrTown: e.target.value })
                        }
                        placeholder="Village or Town"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        9. Featured Image (ప్రధాన ఫోటో - Camera/Gallery)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUploadToDataUrl(e, (url) =>
                            setNewsForm((prev) => ({ ...prev, featuredImageUrl: url }))
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10. Multiple News Images (అదనపు ఫోటోలు)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleFileUploadToDataUrl(e, (url) =>
                            setNewsForm((prev) => ({
                              ...prev,
                              galleryImages: [...prev.galleryImages, url].slice(0, 5),
                            }))
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        11. Image Caption (ఫోటో క్యాప్షన్)
                      </label>
                      <input
                        type="text"
                        value={newsForm.imageCaption}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, imageCaption: e.target.value })
                        }
                        placeholder="Describe the photograph"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        12. Video URL (వీడియో లింక్ - Optional)
                      </label>
                      <input
                        type="url"
                        value={newsForm.videoUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        13. News Tags (ట్యాగ్స్ - Comma separated)
                      </label>
                      <input
                        type="text"
                        value={newsForm.tagsInput}
                        onChange={(e) => setNewsForm({ ...newsForm, tagsInput: e.target.value })}
                        placeholder="Telangana, Hyderabad, Breaking"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        14. SEO Title (SEO శీర్షిక)
                      </label>
                      <input
                        type="text"
                        value={newsForm.seoTitle}
                        onChange={(e) => setNewsForm({ ...newsForm, seoTitle: e.target.value })}
                        placeholder="SEO Meta Title"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        15. SEO Description (SEO వివరణ)
                      </label>
                      <input
                        type="text"
                        value={newsForm.seoDescription}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, seoDescription: e.target.value })
                        }
                        placeholder="SEO Meta Description"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        16. News Language (భాష)
                      </label>
                      <select
                        value={newsForm.language}
                        onChange={(e) =>
                          setNewsForm({
                            ...newsForm,
                            language: e.target.value as 'Telugu' | 'English' | 'Bilingual',
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                      >
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Bilingual">Bilingual (తెలుగు + English)</option>
                        <option value="English">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        18. Assigned Reporter ID (Auto-Assigned)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentReporter.reporterId}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-sm font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      id="news-breaking-opt"
                      type="checkbox"
                      checked={newsForm.isBreaking}
                      onChange={(e) => setNewsForm({ ...newsForm, isBreaking: e.target.checked })}
                      className="w-4 h-4 accent-red-600"
                    />
                    <label htmlFor="news-breaking-opt" className="text-xs font-bold text-slate-800">
                      17. Request Breaking News Ticker Priority (బ్రేకింగ్ న్యూస్ ఎంపిక)
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer"
                    >
                      Submit News Article (Status: PENDING)
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: MY NEWS ARTICLES */}
          {dashTab === 'my-news' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    My Submitted News Articles ({news.filter((n) => n.reporterUid === currentReporter.uid).length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Published articles are locked from reporter editing or deletion without Super Admin permission.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {news
                  .filter((n) => n.reporterUid === currentReporter.uid)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-bold text-slate-900">{item.category}</span>
                          <span>·</span>
                          <span>
                            {item.mandal}, {item.district}, {item.state}
                          </span>
                          <span>·</span>
                          <span className="font-mono">
                            {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{item.headline}</h4>
                        {item.rejectionRemarks && (
                          <p className="text-xs text-red-600">
                            Admin Remarks: {item.rejectionRemarks}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-bold ${
                            item.status === 'PUBLISHED'
                              ? 'text-emerald-700'
                              : item.status === 'PENDING'
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          Status: {item.status}
                        </span>
                        {item.status === 'PUBLISHED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <Lock className="w-3.5 h-3.5" />
                            Locked (Published)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRIVATE ADVERTISEMENT SUBMISSION (Max 2 Images) */}
          {dashTab === 'private-ads' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  REPORTER PRIVATE ADVERTISEMENT DESK
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Submit Local Business / Organization Advertisement (Max 2 Images)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Private advertisements require Super Admin review and approval before public display.
                </p>
              </div>

              {adFeedback && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold border ${
                    adFeedback.type === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {adFeedback.text}
                </div>
              )}

              <form onSubmit={handlePrivateAdSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Advertisement Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={adForm.title}
                      onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                      placeholder="e.g., Grand Festive Offer"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adForm.businessName}
                      onChange={(e) => setAdForm({ ...adForm, businessName: e.target.value })}
                      placeholder="Business Name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={adForm.contactNumber}
                      onChange={(e) => setAdForm({ ...adForm, contactNumber: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Advertisement Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={adForm.description}
                      onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                      placeholder="Offer details, address, and highlights..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Advertisement Image 1 (Slot 1 of 2) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUploadToDataUrl(e, (url) =>
                          setAdForm((prev) => ({ ...prev, image1Url: url }))
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Advertisement Image 2 (Slot 2 of 2 - Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUploadToDataUrl(e, (url) =>
                          setAdForm((prev) => ({ ...prev, image2Url: url }))
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Advertisement Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={adForm.linkUrl}
                      onChange={(e) => setAdForm({ ...adForm, linkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target State *
                    </label>
                    <select
                      value={adForm.targetState}
                      onChange={(e) => {
                        const st = e.target.value;
                        const dList = getDistrictsForState(districts, st);
                        const firstDist = dList[0]?.name || '';
                        const mList = getMandalsForDistrict(mandals, firstDist);
                        setAdForm({
                          ...adForm,
                          targetState: st,
                          targetDistrict: firstDist,
                          targetMandal: mList[0]?.name || '',
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {states
                        .filter((s) => s.active)
                        .map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target District *
                    </label>
                    <select
                      value={adForm.targetDistrict}
                      onChange={(e) => {
                        const dist = e.target.value;
                        const mList = getMandalsForDistrict(mandals, dist);
                        setAdForm({
                          ...adForm,
                          targetDistrict: dist,
                          targetMandal: mList[0]?.name || '',
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {adDistricts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Mandal *
                    </label>
                    <select
                      value={adForm.targetMandal}
                      onChange={(e) => setAdForm({ ...adForm, targetMandal: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {adMandals.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={adForm.startDate}
                      onChange={(e) => setAdForm({ ...adForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={adForm.expiryDate}
                      onChange={(e) => setAdForm({ ...adForm, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Submit Advertisement for Admin Approval
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: REPORTER EDITING PERMISSIONS (ONLY Password & Residential Address) */}
          {dashTab === 'profile-edit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Locked Profile Fields */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      SUPER ADMIN LOCKED FIELDS
                    </p>
                    <h3 className="text-base font-bold text-slate-900">
                      Verified Reporter Identity (Read-Only)
                    </h3>
                  </div>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-600">
                  Per NETI BHARATHAM security rules, Reporters cannot modify Full Name, Date of Birth,
                  Mobile Number, Email, State, District, Mandal, Aadhaar Document, Profile Photo, or
                  Reporter ID. Only Super Admin can edit these fields.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Full Name (Locked)</span>
                    <strong className="text-slate-900">{currentReporter.fullName}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Reporter ID (Locked)</span>
                    <strong className="font-mono text-slate-900">
                      {currentReporter.reporterId}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Date of Birth (Locked)</span>
                    <strong className="text-slate-900">{currentReporter.dob}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Mobile Number (Locked)</span>
                    <strong className="font-mono text-slate-900">{currentReporter.mobile}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Email Address (Locked)</span>
                    <strong className="text-slate-900">{currentReporter.email}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500 block">Jurisdiction (Locked)</span>
                    <strong className="text-slate-900">
                      {currentReporter.mandal}, {currentReporter.district}, {currentReporter.state}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Allowed Edits: Residential Address & Password ONLY */}
              <div className="lg:col-span-6 space-y-6">
                {profileFeedback && (
                  <div
                    className={`p-4 rounded-xl text-xs font-semibold border ${
                      profileFeedback.type === 'ok'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    {profileFeedback.text}
                  </div>
                )}

                <form
                  onSubmit={handleAddressSave}
                  className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <h4 className="text-base font-bold text-slate-900">
                      1. Update Residential Address (నివాస చిరునామా మార్పు)
                    </h4>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Residential Address
                  </button>
                </form>

                <form
                  onSubmit={handlePasswordChangeSubmit}
                  className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-red-600" />
                    <h4 className="text-base font-bold text-slate-900">
                      2. Change Account Password (పాస్‌వర్డ్ మార్పు)
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <input
                      type="password"
                      required
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
