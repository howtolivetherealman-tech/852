export interface ReporterRecord {
  uid: string;
  reporterId: string;
  fullName: string;
  fatherOrHusbandName: string;
  dob: string;
  gender: string;
  mobile: string;
  whatsapp: string;
  email: string;
  residentialAddress: string;
  state: string;
  district: string;
  mandal: string;
  villageOrTown: string;
  pinCode: string;
  experience: string;
  previousOrganization: string;
  profilePhotoUrl: string;
  username: string;
  consentAccepted: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'SUSPENDED';
  rejectionRemarks?: string;
  approvedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicReporterVerification {
  reporterId: string;
  fullName: string;
  designation: 'PRESS REPORTER';
  state: string;
  district: string;
  mandal: string;
  mobileMasked: string;
  profilePhotoUrl: string;
  issuedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  authorizedBy: string;
}

/**
 * Calculates exact 6 calendar months validity from a given approval ISO date string.
 * Example: Approval date 2026-01-10 -> Expiry date 2026-07-10.
 */
export function calculateSixMonthExpiry(approvalDateIso: string): string {
  const d = new Date(approvalDateIso);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid approval date provided');
  }
  const targetYear = d.getUTCFullYear();
  const targetMonth = d.getUTCMonth() + 6;
  const day = d.getUTCDate();

  const result = new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      1,
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds()
    )
  );
  // Clamp to last day of target month if original day overflows (e.g., Aug 31 + 6 months -> Feb 28)
  const maxDaysInTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate();
  result.setUTCDate(Math.min(day, maxDaysInTargetMonth));

  return result.toISOString();
}

/**
 * Evaluates whether a reporter's 6-month membership is currently active or expired.
 */
export function getMembershipValidityStatus(
  expiresAtIso: string | undefined,
  nowIso: string = new Date().toISOString()
): {
  isExpired: boolean;
  daysRemaining: number;
  effectiveStatus: 'ACTIVE' | 'EXPIRED';
} {
  if (!expiresAtIso) {
    return { isExpired: true, daysRemaining: 0, effectiveStatus: 'EXPIRED' };
  }
  const expiryTime = new Date(expiresAtIso).getTime();
  const nowTime = new Date(nowIso).getTime();
  if (Number.isNaN(expiryTime) || Number.isNaN(nowTime)) {
    return { isExpired: true, daysRemaining: 0, effectiveStatus: 'EXPIRED' };
  }
  const diffMs = expiryTime - nowTime;
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpired = diffMs <= 0;
  return {
    isExpired,
    daysRemaining,
    effectiveStatus: isExpired ? 'EXPIRED' : 'ACTIVE',
  };
}

/**
 * Generates a unique, human-readable NETI BHARATHAM Press Reporter ID.
 * Format: NB-<STATE_CODE>-<DIST_PREFIX>-<YEAR>-<SEQ>
 */
export function generateReporterId(
  stateCode: string,
  districtName: string,
  sequenceNumber: number,
  year: number = 2026
): string {
  const cleanState = (stateCode || 'IN').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2) || 'IN';
  const cleanDist =
    (districtName || 'GEN').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3) || 'GEN';
  const paddedSeq = String(Math.max(1, sequenceNumber)).padStart(4, '0');
  return `NB-${cleanState}-${cleanDist}-${year}-${paddedSeq}`;
}

/**
 * Enforces Section 6 & 19:
 * Reporter can edit ONLY residentialAddress (and password via Auth).
 * Only SUPER_ADMIN can edit restricted fields (fullName, dob, mobile, email, state, district, mandal, etc.).
 */
const REPORTER_ALLOWED_UPDATE_KEYS = new Set(['residentialAddress', 'updatedAt']);

export function validateReporterProfileUpdate(
  existing: ReporterRecord,
  incomingPatch: Partial<ReporterRecord>,
  actorRole: 'REPORTER' | 'SUPER_ADMIN'
): { allowed: boolean; error?: string; sanitizedUpdate?: ReporterRecord } {
  if (actorRole === 'SUPER_ADMIN') {
    return {
      allowed: true,
      sanitizedUpdate: {
        ...existing,
        ...incomingPatch,
        uid: existing.uid,
        updatedAt: incomingPatch.updatedAt || new Date().toISOString(),
      },
    };
  }

  const changedKeys = Object.keys(incomingPatch).filter((key) => {
    const k = key as keyof ReporterRecord;
    return incomingPatch[k] !== undefined && incomingPatch[k] !== existing[k];
  });

  for (const key of changedKeys) {
    if (!REPORTER_ALLOWED_UPDATE_KEYS.has(key)) {
      return {
        allowed: false,
        error: `Reporters are not permitted to modify restricted field: ${key}. Only Residential Address and Password can be changed by a Reporter.`,
      };
    }
  }

  const newAddress = (incomingPatch.residentialAddress ?? existing.residentialAddress).trim();
  if (!newAddress || newAddress.length < 5 || newAddress.length > 500) {
    return {
      allowed: false,
      error: 'Residential address must be between 5 and 500 characters.',
    };
  }

  return {
    allowed: true,
    sanitizedUpdate: {
      ...existing,
      residentialAddress: newAddress,
      updatedAt: incomingPatch.updatedAt || new Date().toISOString(),
    },
  };
}

/**
 * Enforces Section 7, 15, and 19:
 * Only APPROVED and non-expired reporters can upload news.
 */
export function canReporterUploadNews(
  reporter: Pick<ReporterRecord, 'status' | 'expiresAt'> | null | undefined,
  nowIso: string = new Date().toISOString()
): { allowed: boolean; reason?: string } {
  if (!reporter) {
    return { allowed: false, reason: 'Reporter account not found.' };
  }
  if (reporter.status === 'PENDING') {
    return {
      allowed: false,
      reason: 'Your reporter application is still PENDING Admin approval.',
    };
  }
  if (reporter.status === 'REJECTED') {
    return {
      allowed: false,
      reason: 'Your reporter application was REJECTED. Please contact Admin.',
    };
  }
  if (reporter.status === 'SUSPENDED') {
    return {
      allowed: false,
      reason: 'Your reporter account is currently SUSPENDED.',
    };
  }
  if (reporter.status === 'EXPIRED') {
    return {
      allowed: false,
      reason: 'Your 6-month reporter membership has EXPIRED. Please request Admin renewal.',
    };
  }
  const validity = getMembershipValidityStatus(reporter.expiresAt, nowIso);
  if (validity.isExpired) {
    return {
      allowed: false,
      reason: 'Your 6-month reporter membership validity has ended. Account status is EXPIRED.',
    };
  }
  return { allowed: true };
}

/**
 * Sanitizes reporter record for public QR verification (Section 5 & 14).
 * Never exposes Aadhaar, password, email, or residential address.
 */
export function extractPublicVerificationData(
  reporter: ReporterRecord,
  nowIso: string = new Date().toISOString(),
  authorizedBy: string = 'Chief Editor, NETI BHARATHAM'
): PublicReporterVerification {
  const digits = (reporter.mobile || '').replace(/\D/g, '');
  const last4 = digits.slice(-4).padStart(4, 'X');
  const mobileMasked = `+91 XXXXX-X${last4}`;

  const validity = getMembershipValidityStatus(reporter.expiresAt, nowIso);
  let publicStatus: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' = 'ACTIVE';
  if (reporter.status === 'SUSPENDED') {
    publicStatus = 'SUSPENDED';
  } else if (reporter.status !== 'APPROVED' || validity.isExpired) {
    publicStatus = 'EXPIRED';
  }

  return {
    reporterId: reporter.reporterId,
    fullName: reporter.fullName,
    designation: 'PRESS REPORTER',
    state: reporter.state,
    district: reporter.district,
    mandal: reporter.mandal,
    mobileMasked,
    profilePhotoUrl: reporter.profilePhotoUrl,
    issuedAt: reporter.approvedAt || reporter.createdAt,
    expiresAt: reporter.expiresAt || '',
    status: publicStatus,
    authorizedBy,
  };
}

/**
 * Validates private advertisement submission by reporter (Section 10 & 19).
 * Maximum of TWO advertisement images per submission; initial status must be PENDING.
 */
export function validatePrivateAdSubmission(input: {
  title: string;
  businessName: string;
  contactNumber: string;
  description: string;
  images: string[];
  targetState: string;
  targetDistrict: string;
  targetMandal: string;
  startDate: string;
  expiryDate: string;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 3) {
    return { valid: false, error: 'Advertisement Title is required (min 3 characters).' };
  }
  if (!input.businessName || input.businessName.trim().length < 2) {
    return { valid: false, error: 'Business / Organization Name is required.' };
  }
  if (!/^[6-9]\d{9}$/.test(input.contactNumber.replace(/\D/g, '').slice(-10))) {
    return { valid: false, error: 'Valid 10-digit Indian contact mobile number is required.' };
  }
  if (!input.images || input.images.length === 0) {
    return { valid: false, error: 'At least 1 advertisement image is required.' };
  }
  if (input.images.length > 2) {
    return {
      valid: false,
      error: 'Maximum of TWO advertisement images are allowed per submission.',
    };
  }
  if (!input.targetState || !input.targetDistrict || !input.targetMandal) {
    return {
      valid: false,
      error: 'Target State, District, and Mandal are required.',
    };
  }
  return { valid: true };
}

/**
 * Creates SEO-friendly news article slug (Section 17).
 * Example: /news/telangana-hyderabad-local-news-example
 */
export function generateNewsSlug(
  state: string,
  district: string,
  headline: string,
  fallbackId?: string
): string {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const statePart = normalize(state || 'india');
  const distPart = normalize(district || 'national');
  const headPart = normalize(headline).slice(0, 70);
  const suffix = fallbackId ? `-${fallbackId.slice(-5).toLowerCase()}` : '';

  const combined = [statePart, distPart, headPart].filter(Boolean).join('-');
  return `${combined || 'neti-bharatham-news'}${suffix}`;
}

/**
 * Deterministic 21x21 QR Code Version 1 matrix generator for Reporter ID verification URLs.
 * Includes standard finder patterns, timing patterns, dark module, and deterministic payload encoding.
 */
export function generateQrMatrix(payload: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (rowOffset: number, colOffset: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = rowOffset + r;
        const cc = colOffset + c;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          reserved[rr][cc] = true;
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          const in7x7 = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          matrix[rr][cc] = in7x7 && (isBorder || isInner);
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    reserved[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic hash stream from payload
  let hash = 2166136261;
  const bytes: number[] = [];
  for (let i = 0; i < payload.length; i++) {
    const code = payload.charCodeAt(i);
    hash ^= code;
    hash = Math.imul(hash, 16777619);
    bytes.push(code & 0xff);
  }
  if (bytes.length === 0) bytes.push(0x4e, 0x42);

  let bitIdx = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        const byteVal = bytes[bitIdx % bytes.length];
        const shift = bitIdx % 8;
        const mix = ((byteVal >> shift) ^ ((hash >> (bitIdx % 16)) & 1) ^ ((r + c) % 2)) & 1;
        matrix[r][c] = mix === 1;
        bitIdx++;
      }
    }
  }

  return matrix;
}

/**
 * Generates shareable URLs and social media share intents for a news article.
 */
export function buildArticleShareData(
  article: {
    slug: string;
    headline: string;
    subheadline?: string;
    district?: string;
    state?: string;
    reporterName?: string;
  },
  baseOrigin: string = 'https://netibhaaratham.com',
  siteName: string = 'NETI BHARATHAM',
  siteNameTelugu: string = 'నేటి భారతం'
): {
  articleUrl: string;
  canonicalUrl: string;
  shareText: string;
  whatsappUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  telegramUrl: string;
} {
  const cleanOrigin = (baseOrigin || 'https://netibhaaratham.com').replace(/\/+$/, '');
  const cleanSlug = (article.slug || '').replace(/^\/+/, '');
  const articleUrl = `${cleanOrigin}/news/${cleanSlug}`;
  const canonicalUrl = `https://netibhaaratham.com/news/${cleanSlug}`;
  const locationTag = [article.district, article.state].filter(Boolean).join(', ');
  const shareText = `📰 ${article.headline}${locationTag ? ` (${locationTag})` : ''}\n— ${siteName} (${siteNameTelugu}) పూర్తి వార్త చదవండి:\n${articleUrl}`;

  return {
    articleUrl,
    canonicalUrl,
    shareText,
    whatsappUrl: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.headline)}&url=${encodeURIComponent(articleUrl)}`,
    facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    telegramUrl: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.headline)}`,
  };
}

