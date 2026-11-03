import React, { useRef, useState } from 'react';
import { Printer, Download, ShieldCheck, ExternalLink, FileDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  generateQrMatrix,
  getMembershipValidityStatus,
  type ReporterRecord,
} from '@/lib/portal-rules';
import type { WebsiteSettingsItem } from '@/lib/default-data';

interface ReporterIdCardProps {
  reporter: ReporterRecord;
  websiteSettings: WebsiteSettingsItem;
  onVerifyClick?: (reporterId: string) => void;
}

export const ReporterIdCard: React.FC<ReporterIdCardProps> = ({
  reporter,
  websiteSettings,
  onVerifyClick,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const validity = getMembershipValidityStatus(reporter.expiresAt);
  const cardStatus =
    reporter.status === 'APPROVED' && !validity.isExpired ? 'ACTIVE' : 'EXPIRED';
  const verifyUrl = `${websiteSettings.domain}/verify?id=${encodeURIComponent(
    reporter.reporterId
  )}`;
  const qrMatrix = generateQrMatrix(verifyUrl);

  const formatDate = (iso?: string) => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardContainerRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const element = cardContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`NETI_BHARATHAM_ID_${reporter.reporterId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF, falling back to print:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPrintableHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="te">
<head>
<meta charset="UTF-8" />
<title>NETI BHARATHAM Press ID Card - ${reporter.reporterId}</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; background: #f1f5f9; padding: 32px; display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
  .card { width: 340px; min-height: 520px; background: #ffffff; border: 2px solid #0A192F; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.12); display: flex; flex-direction: column; justify-content: space-between; }
  .header { background: #0A192F; color: #ffffff; padding: 16px; text-align: center; border-bottom: 4px solid #DC2626; }
  .brand { font-size: 20px; font-weight: 900; letter-spacing: 1px; margin: 0; }
  .telugu { font-size: 16px; color: #FCA5A5; font-weight: 700; margin-top: 2px; }
  .press-bar { background: #DC2626; color: #ffffff; text-align: center; font-weight: 800; font-size: 13px; padding: 6px; letter-spacing: 2px; }
  .body { padding: 16px; font-size: 13px; color: #0f172a; }
  .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e2e8f0; }
  .label { color: #64748b; font-weight: 600; }
  .val { font-weight: 700; text-align: right; }
  .footer { background: #0A192F; color: #ffffff; padding: 12px 16px; font-size: 11px; text-align: center; }
  @media print { body { background: #fff; padding: 0; } }
</style>
</head>
<body onload="window.print()">
  <div class="card">
    <div>
      <div class="header">
        <img src="${
          websiteSettings.logoUrl ||
          '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'
        }" alt="Logo" style="width:52px;height:52px;border-radius:9999px;background:#fff;padding:2px;object-fit:contain;margin:0 auto 6px;display:block;" />
        <p class="brand">${websiteSettings.siteName}</p>
        <p class="telugu">${websiteSettings.siteNameTelugu}</p>
      </div>
      <div class="press-bar">PRESS REPORTER IDENTITY CARD</div>
      <div class="body">
        <p style="text-align:center;font-size:16px;font-weight:800;margin:8px 0;">${reporter.fullName}</p>
        <div class="row"><span class="label">Reporter ID</span><span class="val">${reporter.reporterId}</span></div>
        <div class="row"><span class="label">Designation</span><span class="val">PRESS REPORTER</span></div>
        <div class="row"><span class="label">State</span><span class="val">${reporter.state}</span></div>
        <div class="row"><span class="label">District</span><span class="val">${reporter.district}</span></div>
        <div class="row"><span class="label">Mandal</span><span class="val">${reporter.mandal}</span></div>
        <div class="row"><span class="label">Mobile</span><span class="val">${reporter.mobile}</span></div>
        <div class="row"><span class="label">Issue Date</span><span class="val">${formatDate(reporter.approvedAt)}</span></div>
        <div class="row"><span class="label">Expiry Date</span><span class="val">${formatDate(reporter.expiresAt)}</span></div>
        <div class="row"><span class="label">Status</span><span class="val">${cardStatus}</span></div>
      </div>
    </div>
    <div class="footer">Authorized Digital Signature • Chief Editor, NETI BHARATHAM</div>
  </div>
  <div class="card">
    <div>
      <div class="header">
        <p class="brand">TERMS &amp; VERIFICATION</p>
        <p class="telugu">${websiteSettings.domain}</p>
      </div>
      <div class="body">
        <div class="row"><span class="label">Website</span><span class="val">${websiteSettings.domain}</span></div>
        <div class="row"><span class="label">Official Email</span><span class="val">${websiteSettings.contactEmail}</span></div>
        <div class="row"><span class="label">Headquarters</span><span class="val">${websiteSettings.locationAddress}</span></div>
        <div class="row"><span class="label">Emergency Desk</span><span class="val">${websiteSettings.emergencyContact}</span></div>
        <p style="font-size:11px;line-height:1.5;color:#334155;margin-top:14px;">
          1. This card is valid for exactly 6 calendar months from date of issue.<br/>
          2. Scan the QR code or visit ${websiteSettings.domain}/verify?id=${reporter.reporterId} to verify active press accreditation.<br/>
          3. Misuse of press credentials results in immediate revocation.
        </p>
      </div>
    </div>
    <div class="footer">${websiteSettings.siteName} • ${websiteSettings.locationAddress}</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETI_BHARATHAM_ID_${reporter.reporterId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            NETI BHARATHAM Official Press Reporter Identity Card
          </h3>
          <p className="text-xs text-slate-600">
            Reporter ID: <strong className="font-mono">{reporter.reporterId}</strong> · Validity: 6 Calendar Months ({formatDate(reporter.approvedAt)} to {formatDate(reporter.expiresAt)})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {onVerifyClick && (
            <button
              type="button"
              onClick={() => onVerifyClick(reporter.reporterId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              <span>Test QR Verification</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A192F] hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Card</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPrintableHtml}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML Copy</span>
          </button>
        </div>
      </div>

      {/* Front and Back Side Press ID Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch" ref={cardContainerRef}>
        {/* FRONT SIDE */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl border-2 border-[#0A192F] overflow-hidden shadow-md flex flex-col justify-between">
          <div>
            {/* Top Press Masthead */}
            <div className="bg-[#0A192F] text-white px-5 py-4 flex items-center justify-between border-b-4 border-red-600">
              <div className="flex items-center gap-3">
                <img
                  src={
                    websiteSettings.logoUrl ||
                    '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'
                  }
                  alt="NETI BHARATHAM Logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-white/30 object-contain bg-white p-0.5 shrink-0"
                />
                <div>
                  <p className="text-base font-black tracking-wider text-white leading-tight">
                    {websiteSettings.siteName}
                  </p>
                  <p className="text-sm font-bold text-red-400 leading-tight">
                    {websiteSettings.siteNameTelugu}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300">
                FRONT SIDE
              </span>
            </div>

            {/* Red Press Ribbon */}
            <div className="bg-red-600 text-white text-center py-1.5 px-3 text-xs font-black tracking-widest uppercase">
              PRESS REPORTER • అక్రిడిటెడ్ రిపోర్టర్
            </div>

            {/* Reporter Photo + Core Identity */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-28 rounded-xl border-2 border-[#0A192F] overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  <img
                    src={reporter.profilePhotoUrl || '/icon.svg'}
                    alt={reporter.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                    DESIGNATION: PRESS REPORTER
                  </p>
                  <h4 className="text-lg font-extrabold text-slate-900 leading-snug break-words">
                    {reporter.fullName}
                  </h4>
                  <p className="text-xs font-mono font-bold text-blue-950">
                    ID: {reporter.reporterId}
                  </p>
                  <p className="text-xs font-semibold text-slate-600">
                    Status:{' '}
                    <span
                      className={
                        cardStatus === 'ACTIVE'
                          ? 'text-emerald-700 font-bold'
                          : 'text-red-600 font-bold'
                      }
                    >
                      {cardStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Location & Validity Details */}
              <dl className="divide-y divide-slate-200 border-t border-b border-slate-200 text-xs">
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">State / రాష్ట్రం</dt>
                  <dd className="font-bold text-slate-900 text-right">{reporter.state}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">District / జిల్లా</dt>
                  <dd className="font-bold text-slate-900 text-right">{reporter.district}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">Mandal / మండలం</dt>
                  <dd className="font-bold text-slate-900 text-right">{reporter.mandal}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">Mobile / మొబైల్</dt>
                  <dd className="font-mono font-bold text-slate-900 tabular-nums">
                    +91 {reporter.mobile}
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">Date of Issue</dt>
                  <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatDate(reporter.approvedAt)}
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-500 font-medium">Expiry Date (6 Months)</dt>
                  <dd className="font-mono font-bold text-red-700 tabular-nums">
                    {formatDate(reporter.expiresAt)}
                  </dd>
                </div>
              </dl>

              {/* QR Code + Authorized Digital Signature */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white border border-slate-300 rounded-lg shrink-0">
                    <svg
                      viewBox="0 0 21 21"
                      width="68"
                      height="68"
                      shapeRendering="crispEdges"
                      aria-label={`QR verification code for ${reporter.reporterId}`}
                    >
                      <rect width="21" height="21" fill="#FFFFFF" />
                      {qrMatrix.map((row, rIdx) =>
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
                  <div className="text-[11px] text-slate-600 leading-tight">
                    <p className="font-bold text-slate-900">Scan QR to Verify</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                      netibhaaratham.com/verify
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Digitally Signed</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                    Authorized Signatory
                  </p>
                  <p className="text-[10px] text-slate-500">Chief Editor, NETI BHARATHAM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A192F] text-white text-center py-2.5 px-4 text-[11px] font-medium">
            Official Press Identity • {websiteSettings.domain}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl border-2 border-[#0A192F] overflow-hidden shadow-md flex flex-col justify-between">
          <div>
            <div className="bg-[#0A192F] text-white px-5 py-4 flex items-center justify-between border-b-4 border-red-600">
              <div>
                <p className="text-sm font-black tracking-wider uppercase text-white">
                  OFFICIAL VERIFICATION &amp; TERMS
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {websiteSettings.siteName} ({websiteSettings.siteNameTelugu})
                </p>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300">
                BACK SIDE
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  OFFICIAL PORTAL &amp; HEADQUARTERS
                </p>
                <dl className="space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Official Website:</dt>
                    <dd className="font-semibold text-slate-900">netibhaaratham.com</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Contact Email:</dt>
                    <dd className="font-semibold text-slate-900">
                      {websiteSettings.contactEmail}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Head Office:</dt>
                    <dd className="font-semibold text-slate-900">
                      {websiteSettings.locationAddress}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Emergency Press Desk:</dt>
                    <dd className="font-semibold text-red-700">
                      {websiteSettings.emergencyContact}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  TERMS, CONDITIONS &amp; VALIDITY POLICY
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
                  <li>
                    This Press Identity Card remains the property of{' '}
                    <strong>NETI BHARATHAM (నేటి భారతం)</strong> and is valid strictly for{' '}
                    <strong>6 Calendar Months</strong> from the date of approval.
                  </li>
                  <li>
                    The holder is authorized to gather news and public-interest information within
                    their assigned jurisdiction ({reporter.mandal}, {reporter.district},{' '}
                    {reporter.state}).
                  </li>
                  <li>
                    Authorities and citizens may verify the live status of this card at any time by
                    scanning the QR code on the front side.
                  </li>
                  <li>
                    Public QR verification displays only approved press identity fields and never
                    exposes Aadhaar or confidential residential records.
                  </li>
                  <li>
                    If found, please return to NETI BHARATHAM Head Office, Hyderabad, Telangana or
                    email {websiteSettings.contactEmail}.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-[#0A192F] text-white text-center py-2.5 px-4 text-[11px] font-medium">
            {websiteSettings.siteName} • {websiteSettings.contactEmail} • Hyderabad, Telangana
          </div>
        </div>
      </div>
    </div>
  );
};
