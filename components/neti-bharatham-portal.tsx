'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Share2,
  Video,
  ExternalLink,
  MapPin,
  ShieldCheck,
  UserPlus,
  LogIn,
  Settings,
  X,
  Copy,
  Check,
  Eye,
  UserCheck,
  Download,
} from 'lucide-react';
import { usePortal } from '@/lib/portal-context';
import { getDistrictsForState, getMandalsForDistrict } from '@/lib/india-locations';
import { buildArticleShareData } from '@/lib/portal-rules';
import { PWAInstallButton, OfflineIndicator } from './pwa-install-banner';
import { ReporterPortal } from './reporter-portal';
import { AdminDashboard } from './admin-dashboard';
import type { NewsArticleItem } from '@/lib/default-data';

type PortalSurface =
  | 'public-home'
  | 'reporter-login'
  | 'reporter-register'
  | 'reporter-dashboard'
  | 'reporter-verify'
  | 'super-admin'
  | 'about-us'
  | 'contact-us'
  | 'privacy-policy'
  | 'terms'
  | 'disclaimer';

export const NetiBharathamPortal: React.FC<{ initialArticleSlug?: string; initialVerifyId?: string }> = ({
  initialArticleSlug,
  initialVerifyId,
}) => {
  const {
    states,
    districts,
    mandals,
    categories,
    news,
    advertisements,
    websiteSettings,
    adSenseSettings,
    currentReporter,
    incrementArticleViews,
  } = usePortal();

  const [surface, setSurface] = useState<PortalSurface>(
    initialVerifyId ? 'reporter-verify' : 'public-home'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedMandal, setSelectedMandal] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [activeArticle, setActiveArticle] = useState<NewsArticleItem | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [liveDateTime, setLiveDateTime] = useState<string>(
    'సోమవారం, 2 నవంబర్ 2026 • Hyderabad, IST'
  );

  // Open initial article if route slug provided
  useEffect(() => {
    if (initialArticleSlug) {
      const found = news.find((n) => n.slug === initialArticleSlug && n.status === 'PUBLISHED');
      if (found) setActiveArticle(found);
    }
  }, [initialArticleSlug, news]);

  // Live Indian Standard Time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLiveDateTime(`${formatted} IST • హైదరాబాద్`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Only APPROVED/PUBLISHED news can appear publicly
  const publishedNews = useMemo(
    () => news.filter((n) => n.status === 'PUBLISHED'),
    [news]
  );

  const featuredSlides = useMemo(() => {
    const feat = publishedNews.filter((n) => n.isFeatured || n.isBreaking);
    return feat.length > 0 ? feat : publishedNews.slice(0, 4);
  }, [publishedNews]);

  const filteredNews = useMemo(() => {
    return publishedNews.filter((item) => {
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'Breaking News' && !item.isBreaking) return false;
        if (
          selectedCategory !== 'Breaking News' &&
          item.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }
      }
      if (selectedState !== 'ALL' && item.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
      if (selectedMandal !== 'ALL' && item.mandal !== selectedMandal) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = [
          item.headline,
          item.subheadline,
          item.content,
          item.category,
          item.state,
          item.district,
          item.mandal,
          item.reporterId,
          item.reporterName,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    publishedNews,
    selectedCategory,
    selectedState,
    selectedDistrict,
    selectedMandal,
    searchQuery,
  ]);

  const trendingNews = useMemo(
    () => publishedNews.filter((n) => n.isTrending).slice(0, 5),
    [publishedNews]
  );

  const mostReadNews = useMemo(
    () => [...publishedNews].sort((a, b) => b.views - a.views).slice(0, 5),
    [publishedNews]
  );

  const approvedAds = useMemo(
    () => advertisements.filter((a) => a.status === 'APPROVED'),
    [advertisements]
  );

  const availableDistricts = useMemo(
    () => (selectedState === 'ALL' ? [] : getDistrictsForState(districts, selectedState)),
    [districts, selectedState]
  );

  const availableMandals = useMemo(
    () => (selectedDistrict === 'ALL' ? [] : getMandalsForDistrict(mandals, selectedDistrict)),
    [mandals, selectedDistrict]
  );

  const copyTextToClipboard = (textToCopy: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    if (typeof document !== 'undefined') {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = textToCopy;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch {
        // Ignore fallback error
      }
    }
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 3000);
  };

  const getArticleLiveOrigin = () => {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return window.location.origin;
    }
    return websiteSettings.domain || 'https://netibhaaratham.com';
  };

  const handleOpenArticle = (article: NewsArticleItem) => {
    incrementArticleViews(article.id);
    setActiveArticle({ ...article, views: article.views + 1 });
    setCopiedSlug(false);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', `/news/${article.slug}`);
      } catch {
        // Ignore history pushState restriction if any
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', '/');
      } catch {
        // Ignore
      }
    }
  };

  const handleShareArticle = (
    article: NewsArticleItem,
    platform: 'whatsapp' | 'twitter' | 'facebook' | 'telegram' | 'native' | 'copy'
  ) => {
    const shareInfo = buildArticleShareData(
      article,
      getArticleLiveOrigin(),
      websiteSettings.siteName,
      websiteSettings.siteNameTelugu
    );

    if (platform === 'copy') {
      copyTextToClipboard(shareInfo.articleUrl);
    } else if (platform === 'native') {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        navigator
          .share({
            title: article.headline,
            text: shareInfo.shareText,
            url: shareInfo.articleUrl,
          })
          .catch(() => {
            copyTextToClipboard(shareInfo.articleUrl);
          });
      } else {
        copyTextToClipboard(shareInfo.articleUrl);
      }
    } else if (platform === 'whatsapp' && typeof window !== 'undefined') {
      window.location.href = shareInfo.whatsappUrl;
    } else if (platform === 'twitter' && typeof window !== 'undefined') {
      window.location.href = shareInfo.twitterUrl;
    } else if (platform === 'facebook' && typeof window !== 'undefined') {
      window.location.href = shareInfo.facebookUrl;
    } else if (platform === 'telegram' && typeof window !== 'undefined') {
      window.location.href = shareInfo.telegramUrl;
    }
  };

  if (surface === 'super-admin') {
    return <AdminDashboard onNavigateHome={() => setSurface('public-home')} />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-900 flex flex-col">
      <OfflineIndicator />

      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="bg-[#0A192F] text-white border-b-2 border-red-600 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-8">
          {/* Zone 1: Official Logo + Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setSurface('public-home');
              setSelectedCategory('ALL');
              setSelectedState('ALL');
              setSelectedDistrict('ALL');
              setSelectedMandal('ALL');
              setActiveArticle(null);
            }}
            className="inline-flex items-center gap-2.5 text-base sm:text-xl font-black tracking-tight text-white whitespace-nowrap shrink-0"
          >
            <img
              src={
                websiteSettings.logoUrl ||
                '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'
              }
              alt={`${websiteSettings.siteName} Logo`}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full bg-white p-0.5 object-contain border border-white/30 shadow-xs shrink-0"
            />
            <span>
              {websiteSettings.siteName} • {websiteSettings.siteNameTelugu}
            </span>
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-200"
          >
            <button
              type="button"
              onClick={() => {
                setSurface('public-home');
                setSelectedCategory('ALL');
                setSelectedState('ALL');
                setSelectedDistrict('ALL');
                setSelectedMandal('ALL');
                setActiveArticle(null);
              }}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setSurface('public-home');
                setSelectedCategory('National News');
                setActiveArticle(null);
              }}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              National News
            </button>
            <button
              type="button"
              onClick={() => {
                setSurface('public-home');
                setSelectedCategory('State News');
                setActiveArticle(null);
              }}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              State News
            </button>
            <button
              type="button"
              onClick={() => {
                setSurface('public-home');
                setSelectedCategory('District News');
                setActiveArticle(null);
              }}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              District News
            </button>
            <button
              type="button"
              onClick={() => {
                setSurface('reporter-verify');
                setActiveArticle(null);
              }}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Verify ID
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() =>
                setSurface(currentReporter ? 'reporter-dashboard' : 'reporter-register')
              }
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {currentReporter ? 'Reporter Desk' : 'Reporter Join'}
            </button>
          </div>
        </div>
      </header>

      {/* OPERATIONAL UTILITY STRIP: Live Date/Time + App Download + Reporter Login + Admin Console */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {liveDateTime}
            </span>
            <span aria-hidden="true">·</span>
            <span>{websiteSettings.tagline}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent App Download Button for Everyone */}
            <PWAInstallButton variant="header" />

            <button
              type="button"
              onClick={() => setSurface('reporter-login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-red-600" />
              <span>Reporter Login</span>
            </button>

            <button
              type="button"
              onClick={() => setSurface('reporter-register')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-900" />
              <span>Reporter Registration</span>
            </button>

            <button
              type="button"
              onClick={() => setSurface('super-admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* RED BREAKING NEWS TICKER */}
      <div className="bg-red-700 text-white border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3 overflow-hidden">
          <span className="bg-[#0A192F] text-white px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
            BREAKING NEWS • బ్రేకింగ్
          </span>
          <div className="text-xs sm:text-sm font-bold truncate">
            {websiteSettings.breakingNewsTickerText}
          </div>
        </div>
      </div>

      {/* SURFACE ROUTING */}
      {(surface === 'reporter-login' ||
        surface === 'reporter-register' ||
        surface === 'reporter-dashboard' ||
        surface === 'reporter-verify') && (
        <main className="flex-1">
          <ReporterPortal
            initialTab={
              surface === 'reporter-register'
                ? 'register'
                : surface === 'reporter-dashboard'
                ? 'dashboard'
                : surface === 'reporter-verify'
                ? 'verify'
                : 'login'
            }
            initialVerifyId={initialVerifyId}
            onNavigateHome={() => setSurface('public-home')}
          />
        </main>
      )}

      {/* STATIC CMS PAGES (About Us, Contact Us, Privacy Policy, Terms, Disclaimer) */}
      {(surface === 'about-us' ||
        surface === 'contact-us' ||
        surface === 'privacy-policy' ||
        surface === 'terms' ||
        surface === 'disclaimer') && (
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  OFFICIAL PORTAL INFORMATION
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {surface === 'about-us' && 'About Us • మా గురించి'}
                  {surface === 'contact-us' && 'Contact Us • సంప్రదించండి'}
                  {surface === 'privacy-policy' && 'Privacy Policy • గోప్యతా విధానం'}
                  {surface === 'terms' && 'Terms & Conditions • నియమ నిబంధనలు'}
                  {surface === 'disclaimer' && 'Disclaimer • నిరాకరణ'}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setSurface('public-home')}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                ← Back to Home
              </button>
            </div>

            {surface === 'about-us' && (
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {websiteSettings.aboutUsContent}
              </p>
            )}
            {surface === 'privacy-policy' && (
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {websiteSettings.privacyPolicyContent}
              </p>
            )}
            {surface === 'terms' && (
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {websiteSettings.termsContent}
              </p>
            )}
            {surface === 'disclaimer' && (
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {websiteSettings.disclaimerContent}
              </p>
            )}
            {surface === 'contact-us' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">NETI BHARATHAM Headquarters</p>
                  <p className="text-slate-700">Website: {websiteSettings.domain}</p>
                  <p className="text-slate-700">Email: {websiteSettings.contactEmail}</p>
                  <p className="text-slate-700">Location: {websiteSettings.locationAddress}</p>
                  <p className="text-slate-700">Phone: {websiteSettings.contactPhone}</p>
                  <p className="text-red-700 font-semibold">
                    Emergency Press Desk: {websiteSettings.emergencyContact}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900">Editorial &amp; Accreditation Inquiries</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    For news tips, district/mandal press accreditation inquiries, or private
                    advertisement bookings, write to{' '}
                    <strong>{websiteSettings.contactEmail}</strong> or apply directly via the
                    Reporter Registration portal.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* MAIN PUBLIC NEWS PORTAL VIEW */}
      {surface === 'public-home' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 w-full">
          {/* INDIA HIERARCHICAL LOCATION FILTER & SEARCH ENGINE BAR */}
          <section
            aria-label="India Location Filter and News Search"
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-extrabold text-slate-900">
                  తెలంగాణ (33 జిల్లాలు · 618+ మండలాలు) &amp; ఆంధ్రప్రదేశ్ (26 జిల్లాలు · 679 మండలాలు) డైరెక్టరీ:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState('Telangana');
                    setSelectedDistrict('ALL');
                    setSelectedMandal('ALL');
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                    selectedState === 'Telangana'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  తెలంగాణ (33 Districts)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState('Andhra Pradesh');
                    setSelectedDistrict('ALL');
                    setSelectedMandal('ALL');
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer transition-colors ${
                    selectedState === 'Andhra Pradesh'
                      ? 'bg-[#0A192F] text-white'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  ఆంధ్రప్రదేశ్ (26 Districts)
                </button>
                {selectedState !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedState('ALL');
                      setSelectedDistrict('ALL');
                      setSelectedMandal('ALL');
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    All India (అన్ని రాష్ట్రాలు)
                  </button>
                )}
              </div>

              <a
                href="/api/download-apk"
                download="neti-bharatham-official-v2.6.apk"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>నేటి భారతం APK ఆప్ డౌన్‌లోడ్ (Download APK)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
              {/* State Dropdown */}
              <div className="lg:col-span-3">
                <label
                  htmlFor="filter-state-select"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                >
                  1. Select Indian State / UT (రాష్ట్రం)
                </label>
                <select
                  id="filter-state-select"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('ALL');
                    setSelectedMandal('ALL');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="ALL">All India / National (దేశవ్యాప్త వార్తలు)</option>
                  {states
                    .filter((s) => s.active)
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.nameTelugu})
                      </option>
                    ))}
                </select>
              </div>

              {/* Dependent District Dropdown */}
              <div className="lg:col-span-3">
                <label
                  htmlFor="filter-district-select"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                >
                  2. Select District (జిల్లా)
                </label>
                <select
                  id="filter-district-select"
                  value={selectedDistrict}
                  disabled={selectedState === 'ALL'}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedMandal('ALL');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="ALL">
                    {selectedState === 'ALL'
                      ? 'Select a State First'
                      : `All Districts in ${selectedState}`}
                  </option>
                  {availableDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.nameTelugu})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dependent Mandal Dropdown */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="filter-mandal-select"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                >
                  3. Select Mandal (మండలం)
                </label>
                <select
                  id="filter-mandal-select"
                  value={selectedMandal}
                  disabled={selectedDistrict === 'ALL'}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="ALL">
                    {selectedDistrict === 'ALL'
                      ? 'Select District First'
                      : `All Mandals in ${selectedDistrict}`}
                  </option>
                  {availableMandals.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.nameTelugu})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search News Input */}
              <div className="lg:col-span-4">
                <label
                  htmlFor="portal-news-search"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                >
                  Search Headline, Content, Mandal or Reporter ID
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    id="portal-news-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="వార్తలు, జిల్లా, మండలం లేదా రిపోర్టర్ ID వెతకండి..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All News • అన్ని వార్తలు
              </button>
              {categories
                .filter((c) => c.active)
                .map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-[#0A192F] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.nameTelugu} ({cat.name})
                  </button>
                ))}
            </div>
          </section>

          {/* GOOGLE ADSENSE HEADER SLOT (Displayed ONLY when Admin enables & configures AdSense) */}
          {adSenseSettings.enabled && adSenseSettings.clientId && adSenseSettings.headerSlotId && (
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 text-center text-xs text-slate-600">
              Google AdSense Header Unit ({adSenseSettings.clientId} / Slot:{' '}
              {adSenseSettings.headerSlotId})
            </div>
          )}

          {/* ARTICLE READER VIEW (When a user clicks a headline) */}
          {activeArticle && (
            <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Schema.org NewsArticle JSON-LD */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'NewsArticle',
                    headline: activeArticle.headline,
                    description: activeArticle.seoDescription || activeArticle.subheadline,
                    image: [`${websiteSettings.domain}${activeArticle.featuredImageUrl}`],
                    datePublished: activeArticle.createdAt,
                    dateModified: activeArticle.updatedAt,
                    author: [
                      {
                        '@type': 'Person',
                        name: activeArticle.reporterName,
                        identifier: activeArticle.reporterId,
                      },
                    ],
                    publisher: {
                      '@type': 'Organization',
                      name: websiteSettings.siteName,
                      url: websiteSettings.domain,
                    },
                  }),
                }}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-bold text-red-600">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {activeArticle.mandal}, {activeArticle.district}, {activeArticle.state}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">
                    {new Date(activeArticle.createdAt).toLocaleString('en-IN')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{activeArticle.views} Views</span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseArticle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Article / వెనుకకు</span>
                </button>
              </div>

              <div className="space-y-3 max-w-3xl">
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {activeArticle.headline}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {activeArticle.subheadline}
                </p>
              </div>

              {/* Verified Reporter Attribution, View Count & Dedicated News Link Share Box */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900">
                          రిపోర్టర్ (Uploaded by Reporter): {activeArticle.reporterName}
                        </span>{' '}
                        <span className="font-mono font-semibold text-blue-900">
                          (ID: {activeArticle.reporterId})
                        </span>
                      </div>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">
                      |
                    </span>
                    <div className="inline-flex items-center gap-1.5 font-mono font-bold text-red-700 tabular-nums">
                      <Eye className="w-4 h-4" />
                      <span>
                        {activeArticle.views.toLocaleString('en-IN')} మంది చూశారు (
                        {activeArticle.views.toLocaleString('en-IN')} Views)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct News Link Copy & Social Share Bar */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="share-article-url-input"
                      className="font-extrabold text-slate-900 flex items-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4 text-red-600" />
                      <span>ఈ వార్త లింక్ షేర్ చేయండి • Share This News Story Link:</span>
                    </label>
                    {copiedSlug && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>లింక్ కాపీ అయింది! (News Link Copied!)</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      id="share-article-url-input"
                      type="text"
                      readOnly
                      value={`${getArticleLiveOrigin()}/news/${activeArticle.slug}`}
                      onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs text-slate-800 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'copy')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white font-bold cursor-pointer shrink-0"
                    >
                      {copiedSlug ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>లింక్ కాపీ అయింది! (Link Copied)</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>లింక్ కాపీ చేయండి (Copy News Link)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'whatsapp')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>వాట్సాప్‌లో షేర్ చేయండి (WhatsApp)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'facebook')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'twitter')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>X (Twitter)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'telegram')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'native')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-600 bg-white hover:bg-red-50 text-red-700 font-bold cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>షేర్ చేయండి (Share Link)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <figure className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-[460px] w-full">
                  <img
                    src={activeArticle.featuredImageUrl || '/news-art/secretariat.svg'}
                    alt={activeArticle.headline}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeArticle.imageCaption && (
                  <figcaption className="text-xs italic text-slate-500">
                    Fig. — {activeArticle.imageCaption}
                  </figcaption>
                )}
              </figure>

              {/* Full News Content */}
              <div className="max-w-2xl text-base text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              {/* Bottom Article Share Box */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-red-50/70 border border-red-200 rounded-xl p-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-extrabold text-slate-900">
                      ఈ వార్తను మీ మిత్రులతో షేర్ చేయండి • Share This News Story
                    </p>
                    <p className="text-[11px] font-mono text-slate-600 break-all">
                      {getArticleLiveOrigin()}/news/{activeArticle.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'copy')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                    >
                      {copiedSlug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>లింక్ కాపీ అయింది!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>లింక్ కాపీ చేయండి (Copy Link)</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareArticle(activeArticle, 'whatsapp')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp షేర్</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Canonical SEO URL: {websiteSettings.domain}/news/{activeArticle.slug}
                  </span>
                  <span>Tags: {activeArticle.tags.join(' · ')}</span>
                </div>
              </div>
            </article>
          )}

          {/* EDITORIAL 3-TIER FRONT PAGE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT / MAIN COLUMN (8 Cols): Featured News Slider + Latest Filtered News */}
            <div className="lg:col-span-8 space-y-8">
              {/* Tier 1: Large Featured News Image Slider */}
              {featuredSlides.length > 0 && (
                <section
                  aria-label="Featured News Slider"
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0A192F] text-white shadow-sm"
                >
                  {(() => {
                    const slide = featuredSlides[sliderIndex % featuredSlides.length];
                    return (
                      <div className="relative min-h-[380px] sm:min-h-[460px] w-full">
                        <img
                          src={slide.featuredImageUrl || '/news-art/secretariat.svg'}
                          alt={slide.headline}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover absolute inset-0"
                        />
                        {/* Measured Scrim for Guaranteed 4.5:1 Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5 sm:p-8 space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-red-300 font-semibold">
                            <span>{slide.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {slide.mandal}, {slide.district}, {slide.state}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">ID: {slide.reporterId}</span>
                          </div>

                          <h2
                            onClick={() => handleOpenArticle(slide)}
                            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug cursor-pointer hover:underline"
                            style={{ textWrap: 'balance' }}
                          >
                            {slide.headline}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl">
                            {slide.subheadline}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200 pt-1">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                              <UserCheck className="w-3.5 h-3.5" />
                              రిపోర్టర్: {slide.reporterName} ({slide.reporterId})
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-white tabular-nums">
                              <Eye className="w-3.5 h-3.5 text-red-400" />
                              {slide.views.toLocaleString('en-IN')} మంది చూశారు ({slide.views.toLocaleString('en-IN')} Views)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenArticle(slide)}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Read Full Story • పూర్తి వార్త చదవండి
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenArticle(slide);
                                  handleShareArticle(slide, 'copy');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share Link • లింక్ షేర్</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSliderIndex(
                                    (prev) =>
                                      (prev - 1 + featuredSlides.length) % featuredSlides.length
                                  )
                                }
                                aria-label="Previous Featured Story"
                                className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-mono tabular-nums text-slate-300">
                                {(sliderIndex % featuredSlides.length) + 1} /{' '}
                                {featuredSlides.length}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSliderIndex((prev) => (prev + 1) % featuredSlides.length)
                                }
                                aria-label="Next Featured Story"
                                className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </section>
              )}

              {/* Tier 2: Latest & Location-Filtered News Cards */}
              <section aria-label="Latest News Feed" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#0A192F] pb-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {selectedCategory === 'ALL'
                        ? 'తాజా వార్తలు • Latest Verified News'
                        : `${selectedCategory} Headlines`}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Location Filter:{' '}
                      <strong>
                        {selectedState === 'ALL' ? 'All India' : selectedState}
                        {selectedDistrict !== 'ALL' ? ` → ${selectedDistrict}` : ''}
                        {selectedMandal !== 'ALL' ? ` → ${selectedMandal}` : ''}
                      </strong>{' '}
                      ({filteredNews.length} articles)
                    </p>
                  </div>

                  {(selectedState !== 'ALL' ||
                    selectedCategory !== 'ALL' ||
                    searchQuery.trim() !== '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedState('ALL');
                        setSelectedDistrict('ALL');
                        setSelectedMandal('ALL');
                        setSearchQuery('');
                      }}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                {filteredNews.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">
                      No published news articles match your current filter.
                    </p>
                    <p className="text-xs text-slate-500">
                      Try clearing the Mandal/District filter or upload a story from the Reporter Dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedState('ALL');
                        setSelectedDistrict('ALL');
                        setSelectedMandal('ALL');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0A192F] text-white text-xs font-bold cursor-pointer"
                    >
                      Show All India News
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredNews.map((item) => (
                      <article
                        key={item.id}
                        onClick={() => handleOpenArticle(item)}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-colors flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <div className="aspect-16/9 w-full bg-slate-900 overflow-hidden">
                            <img
                              src={item.featuredImageUrl || '/news-art/secretariat.svg'}
                              alt={item.headline}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            {/* Zero-Pill Unboxed Metadata with · separators */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="font-bold text-red-600">{item.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>
                                {item.mandal}, {item.district}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{item.state}</span>
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                              {item.headline}
                            </h3>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {item.subheadline}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col gap-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 truncate">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="truncate">రిపోర్టర్: {item.reporterName}</span>
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-blue-900 shrink-0">
                              ID: {item.reporterId}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/70">
                            <span>
                              {item.mandal}, {item.district}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-red-700 tabular-nums">
                              <Eye className="w-3.5 h-3.5" />
                              {item.views.toLocaleString('en-IN')} మంది చూశారు ({item.views.toLocaleString('en-IN')} Views)
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenArticle(item);
                              }}
                              className="text-xs font-extrabold text-red-600 hover:underline cursor-pointer"
                            >
                              Read Full Story • పూర్తి వార్త →
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenArticle(item);
                                handleShareArticle(item, 'copy');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-[11px] font-bold cursor-pointer"
                            >
                              <Share2 className="w-3 h-3 text-red-600" />
                              <span>Share Link • షేర్</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* NATIONAL, STATE, DISTRICT & MANDAL QUICK DESK GRIDS */}
              <section
                aria-label="Regional News Desks"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      రాష్ట్ర &amp; జిల్లా వార్తలు • State &amp; District Desk
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedState('Telangana')}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Telangana →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {publishedNews
                      .filter(
                        (n) => n.state === 'Telangana' || n.state === 'Andhra Pradesh'
                      )
                      .slice(0, 4)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleOpenArticle(n)}
                          className="py-2.5 space-y-1 cursor-pointer hover:bg-slate-50 rounded px-1"
                        >
                          <div className="text-[11px] text-slate-500">
                            {n.state} · {n.district} · {n.mandal}
                          </div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-2">
                            {n.headline}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                            <span className="font-semibold text-slate-700 truncate">
                              రిపోర్టర్: {n.reporterName} ({n.reporterId})
                            </span>
                            <span className="font-mono font-bold text-red-700 tabular-nums shrink-0">
                              👁️ {n.views.toLocaleString('en-IN')} మంది చూశారు
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      జాతీయ &amp; ఉపాధి వార్తలు • National &amp; Jobs Desk
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('National News')}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {publishedNews
                      .filter(
                        (n) =>
                          n.category === 'National News' ||
                          n.category === 'Employment & Jobs' ||
                          n.category === 'Education'
                      )
                      .slice(0, 4)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleOpenArticle(n)}
                          className="py-2.5 space-y-1 cursor-pointer hover:bg-slate-50 rounded px-1"
                        >
                          <div className="text-[11px] text-slate-500">
                            {n.category} · {n.district}, {n.state}
                          </div>
                          <p className="text-xs font-bold text-slate-900 line-clamp-2">
                            {n.headline}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                            <span className="font-semibold text-slate-700 truncate">
                              రిపోర్టర్: {n.reporterName} ({n.reporterId})
                            </span>
                            <span className="font-mono font-bold text-red-700 tabular-nums shrink-0">
                              👁️ {n.views.toLocaleString('en-IN')} మంది చూశారు
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT / SIDEBAR COLUMN (4 Cols): APK Download Card, Trending, Most Read, Video News, Private Ads & Reporter CTA */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Homepage Direct Android APK Download Box */}
              <div className="bg-[#0A192F] text-white p-5 rounded-xl border-2 border-red-600 space-y-3 shadow-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  OFFICIAL ANDROID APK • నేటి భారతం యాప్
                </p>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  నేటి భారతం APK యాప్ డౌన్‌లోడ్ (Download Android APK)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  మీ మొబైల్‌లో నేటి భారతం APK ఇన్‌స్టాల్ చేసుకుని 33 తెలంగాణ జిల్లాలు &amp; 26 ఆంధ్రప్రదేశ్ జిల్లాల మండల స్థాయి వార్తలను వెంటనే పొందండి.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="/api/download-apk"
                    download="neti-bharatham-official-v2.6.apk"
                    className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ఆండ్రాయిడ్ APK డౌన్‌లోడ్ (v2.6.0)</span>
                  </a>
                </div>
              </div>

              {/* Trending News Section */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 border-b-2 border-red-600 pb-2">
                  ట్రెండింగ్ వార్తలు • Trending Now
                </h3>
                <div className="divide-y divide-slate-100">
                  {trendingNews.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenArticle(item)}
                      className="py-3 flex items-start gap-3 cursor-pointer group"
                    >
                      <span className="text-lg font-black font-mono text-red-600 tabular-nums shrink-0">
                        0{idx + 1}.
                      </span>
                      <div className="space-y-1 w-full">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-red-600 leading-snug">
                          {item.headline}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-700">
                          రిపోర్టర్: {item.reporterName} ({item.reporterId})
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>
                            {item.district}, {item.state}
                          </span>
                          <span className="font-mono font-bold text-red-700 tabular-nums">
                            👁️ {item.views.toLocaleString('en-IN')} మంది చూశారు
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Read News Section */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 border-b-2 border-[#0A192F] pb-2">
                  అత్యధికంగా చదివినవి • Most Read News
                </h3>
                <div className="divide-y divide-slate-100">
                  {mostReadNews.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenArticle(item)}
                      className="py-2.5 space-y-1 cursor-pointer hover:bg-slate-50 rounded px-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.category}</span>
                        <span className="font-mono font-bold text-red-700 tabular-nums">
                          👁️ {item.views.toLocaleString('en-IN')} మంది చూశారు
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-2">
                        {item.headline}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-600">
                        రిపోర్టర్: {item.reporterName} ({item.reporterId})
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video News Bulletin Section */}
              <div className="bg-[#0A192F] text-white p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-400" />
                    <span>వీడియో వార్తలు • Video News Desk</span>
                  </h3>
                </div>
                {publishedNews.slice(0, 2).map((vItem) => (
                  <div
                    key={vItem.id}
                    onClick={() => handleOpenArticle(vItem)}
                    className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 cursor-pointer hover:border-slate-600"
                  >
                    <div className="aspect-video rounded overflow-hidden bg-black relative">
                      <img
                        src={vItem.featuredImageUrl || '/news-art/secretariat.svg'}
                        alt={vItem.headline}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85"
                      />
                    </div>
                    <p className="text-xs font-bold text-white line-clamp-2">{vItem.headline}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>రిపోర్టర్: {vItem.reporterName}</span>
                      <span className="font-mono font-bold text-amber-300 tabular-nums">
                        👁️ {vItem.views.toLocaleString('en-IN')} మంది చూశారు
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Approved Private Advertisements Section */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    SPONSORED LOCAL ANNOUNCEMENTS
                  </span>
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-dashboard')}
                    className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Submit Ad →
                  </button>
                </div>

                {approvedAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {ad.image1Url && (
                        <img
                          src={ad.image1Url}
                          alt={ad.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                      )}
                      {ad.image2Url && (
                        <img
                          src={ad.image2Url}
                          alt={`${ad.title} secondary`}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                      )}
                    </div>
                    <p className="text-xs font-extrabold text-slate-900">{ad.title}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{ad.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span className="font-semibold text-slate-800">{ad.businessName}</span>
                      <span className="font-mono">Ph: {ad.contactNumber}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reporter Accreditation & ID Verification Card Callout */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  JOIN NETI BHARATHAM NETWORK
                </p>
                <h3 className="text-base font-extrabold text-slate-900">
                  Mandal, District &amp; State Press Reporter Registration
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apply online with your profile photo and Aadhaar verification. Approved reporters
                  receive an official 6-month Digital Press Reporter ID Card with QR verification.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-register')}
                    className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Apply for Reporter ID Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-verify')}
                    className="w-full py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Verify Reporter ID via QR Registry
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* PROFESSIONAL FOOTER WITH CONTACTS, POLICIES, SOCIAL LINKS & APP DOWNLOAD */}
      <footer className="bg-[#0A192F] text-white border-t-4 border-red-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Official Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    websiteSettings.logoUrl ||
                    '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'
                  }
                  alt="NETI BHARATHAM Logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full bg-white p-0.5 object-contain border border-white/30 shrink-0"
                />
                <div>
                  <p className="text-base font-black text-white">{websiteSettings.siteName}</p>
                  <p className="text-sm font-bold text-red-400">
                    {websiteSettings.siteNameTelugu}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{websiteSettings.tagline}</p>
              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <p>
                  <strong>Official Website:</strong> {websiteSettings.domain}
                </p>
                <p>
                  <strong>Email:</strong> {websiteSettings.contactEmail}
                </p>
                <p>
                  <strong>Location:</strong> {websiteSettings.locationAddress}
                </p>
              </div>
            </div>

            {/* Regional News Desks */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                Regional News Desks
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {[
                  { label: 'India / National News', cat: 'National News' },
                  { label: 'International News', cat: 'International News' },
                  { label: 'State News (Telangana & AP)', cat: 'State News' },
                  { label: 'District News', cat: 'District News' },
                  { label: 'Mandal News', cat: 'Mandal News' },
                  { label: 'Agriculture & Farmers', cat: 'Agriculture' },
                  { label: 'Employment & Education', cat: 'Employment & Jobs' },
                ].map((link) => (
                  <li key={link.cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setSurface('public-home');
                        setSelectedCategory(link.cat);
                        setActiveArticle(null);
                      }}
                      className="hover:text-white hover:underline cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reporter & Admin Portals */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                Press Reporter &amp; Legal Pages
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-register')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Reporter Registration (21 Fields)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-login')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Reporter Login &amp; Dashboard
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('reporter-verify')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Reporter ID Verification (QR)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('about-us')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('contact-us')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('privacy-policy')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('terms')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setSurface('disclaimer')}
                    className="hover:text-white hover:underline cursor-pointer"
                  >
                    Disclaimer
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile App Download & Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                Download App &amp; Connect
              </h4>
              <p className="text-xs text-slate-300">
                Install the official NETI BHARATHAM PWA on your Android, iPhone, or Desktop for
                instant breaking news alerts:
              </p>
              <PWAInstallButton variant="footer" />

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <a
                  href={websiteSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline"
                >
                  YouTube
                </a>
                <span>·</span>
                <a
                  href={websiteSettings.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline"
                >
                  X (Twitter)
                </a>
                <span>·</span>
                <a
                  href={websiteSettings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline"
                >
                  Facebook
                </a>
                <span>·</span>
                <a
                  href={websiteSettings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline"
                >
                  Instagram
                </a>
                <span>·</span>
                <a
                  href={websiteSettings.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} {websiteSettings.siteName} (
              {websiteSettings.siteNameTelugu}) — {websiteSettings.domain}. All Rights Reserved.
            </p>
            <p>
              Headquarters: {websiteSettings.locationAddress} · Email:{' '}
              {websiteSettings.contactEmail}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
