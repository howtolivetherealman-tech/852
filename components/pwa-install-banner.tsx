'use client';

import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share2, Monitor, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '@/hooks/use-pwa-install';

interface PWAInstallControlsProps {
  variant?: 'header' | 'banner' | 'footer';
}

export const PWAInstallButton: React.FC<PWAInstallControlsProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [apkDownloading, setApkDownloading] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
        return;
      }
    }
    setShowModal(true);
  };

  const handleApkDownload = () => {
    setApkDownloading(true);
    setTimeout(() => setApkDownloading(false), 3000);
  };

  if (isInstalled && variant === 'header') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5" />
        యాప్ ఇన్‌స్టాల్ అయింది
      </span>
    );
  }

  return (
    <>
      {variant === 'header' && (
        <div className="inline-flex flex-wrap items-center gap-2">
          <a
            href="/api/download-apk"
            download="neti-bharatham-official-v2.6.apk"
            onClick={handleApkDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            aria-label="Download NETI BHARATHAM Android APK (ఆండ్రాయిడ్ APK డౌన్‌లోడ్)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {apkDownloading
                ? 'APK డౌన్‌లోడ్ అవుతోంది...'
                : 'APK యాప్ డౌన్‌లోడ్ / Download APK'}
            </span>
          </a>

          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Install NETI BHARATHAM App (యాప్ ఇన్‌స్టాల్)"
          >
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span>Install App</span>
          </button>
        </div>
      )}

      {variant === 'banner' && (
        <div className="bg-[#0A192F] text-white rounded-2xl p-5 sm:p-6 border-2 border-red-600/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-widest text-red-400 font-bold">
              OFFICIAL ANDROID APK &amp; MOBILE APP • నేటి భారతం అఫీషియల్ యాప్
            </p>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              నేటి భారతం APK యాప్‌ను మీ మొబైల్‌లో ఉచితంగా డౌన్‌లోడ్ చేసుకోండి!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              తెలంగాణ (33 జిల్లాలు, 618+ మండలాలు) మరియు ఆంధ్రప్రదేశ్ (26 జిల్లాలు, 679 మండలాలు) సహా దేశవ్యాప్త బ్రేకింగ్ న్యూస్ మరియు రిపోర్టర్ ఐడి కార్డు సేవల కోసం ఆండ్రాయిడ్ APK డౌన్‌లోడ్ చేసుకోండి.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/api/download-apk"
              download="neti-bharatham-official-v2.6.apk"
              onClick={handleApkDownload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>
                {apkDownloading
                  ? 'Downloading APK (v2.6)...'
                  : 'ఆండ్రాయిడ్ APK డౌన్‌లోడ్ (Download APK v2.6)'}
              </span>
            </a>
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>One-Click Web App Install</span>
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Monitor className="w-4 h-4" />
              <span>డౌన్‌లోడ్ గైడ్ (APK Guide)</span>
            </button>
          </div>
        </div>
      )}

      {variant === 'footer' && (
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/download-apk"
            download="neti-bharatham-official-v2.6.apk"
            onClick={handleApkDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>నేటి భారతం APK డౌన్‌లోడ్ (Download APK)</span>
          </a>
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-red-400" />
            <span>Install Web App</span>
          </button>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white text-slate-900 p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  OFFICIAL ANDROID APK &amp; PWA APPLICATION
                </p>
                <h3 id="pwa-modal-title" className="text-xl font-bold text-slate-900 mt-0.5">
                  NETI BHARATHAM – నేటి భారతం APK &amp; యాప్ డౌన్‌లోడ్
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Close App Download Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {installSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
                <p className="font-bold">యాప్ విజయవంతంగా ఇన్‌స్టాల్ చేయబడింది!</p>
                <p className="text-xs mt-1">
                  మీ హోమ్ స్క్రీన్ నుండి నేటి భారతం యాప్‌ను నేరుగా ఓపెన్ చేయవచ్చు.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-700">
                {/* Direct Android APK Download Box */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-red-950">
                      Direct Android APK Package (v2.6.0)
                    </p>
                    <p className="text-xs text-red-800 mt-0.5">
                      ఆండ్రాయిడ్ ఫోన్లలో నేరుగా <strong>neti-bharatham-official-v2.6.apk</strong> ఫైల్ డౌన్‌లోడ్ చేసుకోండి.
                    </p>
                  </div>
                  <a
                    href="/api/download-apk"
                    download="neti-bharatham-official-v2.6.apk"
                    onClick={handleApkDownload}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download APK</span>
                  </a>
                </div>

                {isInstallable && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-emerald-950">One-Click Instant App Install Ready</p>
                      <p className="text-xs text-emerald-800">
                        మీ డివైజ్‌లో ఒకే క్లిక్‌తో నేటి భారతం యాప్‌ను ఇన్‌స్టాల్ చేసుకోండి.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={install}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Install Now
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Smartphone className="w-4 h-4 text-red-600" />
                      <span>Android మొబైల్ (APK / Chrome)</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed">
                      <li>పైనున్న <strong>Download APK</strong> బటన్ నొక్కి APK డౌన్‌లోడ్ చేయండి.</li>
                      <li>లేదా బ్రౌజర్ <strong>⋮ (Three Dots)</strong> మెనూలో <strong>&ldquo;Install App&rdquo;</strong> ఎంచుకోండి.</li>
                      <li>హోమ్ స్క్రీన్‌పై <strong>NETI BHARATHAM</strong> యాప్ ఐకాన్ వస్తుంది.</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Share2 className="w-4 h-4 text-blue-700" />
                      <span>iPhone / iPad (iOS Safari)</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 leading-relaxed">
                      <li>Safari దిగువన ఉన్న <strong>Share (షేర్)</strong> బటన్‌పై నొక్కండి.</li>
                      <li>కిందికి స్క్రోల్ చేసి <strong>&ldquo;Add to Home Screen&rdquo;</strong> ఎంచుకోండి.</li>
                      <li>కుడి పైభాగంలో <strong>Add</strong> నొక్కి యాప్‌ను ఓపెన్ చేయండి.</li>
                    </ol>
                  </div>
                </div>

                {isIOS && (
                  <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    మీరు iOS డివైజ్ ఉపయోగిస్తున్నారు: Safari మెనూలో <strong>Share → Add to Home Screen</strong> ద్వారా ఇన్‌స్టాల్ చేసుకోండి.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Official Domain: https://netibhaaratham.com
              </span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                Close / మూసివేయి
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>ఆఫ్‌లైన్ మోడ్ (Offline Mode) — సేవ్ చేసిన వార్తలు అందుబాటులో ఉన్నాయి</span>
    </div>
  );
};
