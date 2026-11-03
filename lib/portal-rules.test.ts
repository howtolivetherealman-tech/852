import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSixMonthExpiry,
  getMembershipValidityStatus,
  generateReporterId,
  validateReporterProfileUpdate,
  canReporterUploadNews,
  extractPublicVerificationData,
  validatePrivateAdSubmission,
  generateNewsSlug,
  generateQrMatrix,
  type ReporterRecord,
} from './portal-rules';

const sampleReporter: ReporterRecord = {
  uid: 'rep-101',
  reporterId: 'NB-TG-HYD-2026-0001',
  fullName: 'K. Venkatacharyulu',
  fatherOrHusbandName: 'K. Narasimha Rao',
  dob: '1990-05-14',
  gender: 'Male',
  mobile: '9848012345',
  whatsapp: '9848012345',
  email: 'venkat@netibhaaratham.com',
  residentialAddress: 'H.No 4-1-89, Banjara Hills, Hyderabad',
  state: 'Telangana',
  district: 'Hyderabad',
  mandal: 'Khairatabad',
  villageOrTown: 'Banjara Hills',
  pinCode: '500034',
  experience: '6 Years',
  previousOrganization: 'Telugu Vaartha Media',
  profilePhotoUrl: '/icon.svg',
  username: 'venkat_hyd',
  consentAccepted: true,
  status: 'APPROVED',
  approvedAt: '2026-01-10T00:00:00.000Z',
  expiresAt: '2026-07-10T00:00:00.000Z',
  createdAt: '2026-01-08T00:00:00.000Z',
  updatedAt: '2026-01-10T00:00:00.000Z',
};

test('Six-month validity calculation matches exact calendar months (10 Jan -> 10 Jul)', () => {
  const expiry = calculateSixMonthExpiry('2026-01-10T00:00:00.000Z');
  assert.equal(expiry, '2026-07-10T00:00:00.000Z');
});

test('Membership validity status detects active vs expired timestamps accurately', () => {
  const activeCheck = getMembershipValidityStatus(
    '2026-07-10T00:00:00.000Z',
    '2026-04-10T00:00:00.000Z'
  );
  assert.equal(activeCheck.isExpired, false);
  assert.equal(activeCheck.effectiveStatus, 'ACTIVE');
  assert.ok(activeCheck.daysRemaining > 80);

  const expiredCheck = getMembershipValidityStatus(
    '2026-07-10T00:00:00.000Z',
    '2026-07-11T00:00:00.000Z'
  );
  assert.equal(expiredCheck.isExpired, true);
  assert.equal(expiredCheck.effectiveStatus, 'EXPIRED');
  assert.equal(expiredCheck.daysRemaining, 0);
});

test('Reporter ID generator creates deterministic state and district formatted IDs', () => {
  const id = generateReporterId('TG', 'Hyderabad', 7, 2026);
  assert.equal(id, 'NB-TG-HYD-2026-0007');
});

test('Reporter profile edit lock allows residentialAddress change but blocks restricted fields', () => {
  const allowedResult = validateReporterProfileUpdate(
    sampleReporter,
    { residentialAddress: 'Plot 42, Jubilee Hills, Hyderabad - 500033' },
    'REPORTER'
  );
  assert.equal(allowedResult.allowed, true);
  assert.equal(
    allowedResult.sanitizedUpdate?.residentialAddress,
    'Plot 42, Jubilee Hills, Hyderabad - 500033'
  );

  const blockedNameResult = validateReporterProfileUpdate(
    sampleReporter,
    { fullName: 'Hacked Name' },
    'REPORTER'
  );
  assert.equal(blockedNameResult.allowed, false);

  const blockedMandalResult = validateReporterProfileUpdate(
    sampleReporter,
    { mandal: 'Secunderabad' },
    'REPORTER'
  );
  assert.equal(blockedMandalResult.allowed, false);

  const adminOverrideResult = validateReporterProfileUpdate(
    sampleReporter,
    { fullName: 'K. Venkata Charyulu', mandal: 'Ameerpet' },
    'SUPER_ADMIN'
  );
  assert.equal(adminOverrideResult.allowed, true);
  assert.equal(adminOverrideResult.sanitizedUpdate?.mandal, 'Ameerpet');
});

test('News upload eligibility blocks PENDING and EXPIRED reporters and allows active APPROVED reporters', () => {
  assert.equal(
    canReporterUploadNews(sampleReporter, '2026-03-15T00:00:00.000Z').allowed,
    true
  );
  assert.equal(
    canReporterUploadNews(
      { status: 'PENDING', expiresAt: '2026-07-10T00:00:00.000Z' },
      '2026-03-15T00:00:00.000Z'
    ).allowed,
    false
  );
  assert.equal(
    canReporterUploadNews(sampleReporter, '2026-08-01T00:00:00.000Z').allowed,
    false
  );
});

test('Public QR verification sanitizer strips private PII and masks mobile number', () => {
  const pub = extractPublicVerificationData(sampleReporter, '2026-03-15T00:00:00.000Z');
  assert.equal(pub.reporterId, 'NB-TG-HYD-2026-0001');
  assert.equal(pub.mobileMasked, '+91 XXXXX-X2345');
  assert.equal(pub.status, 'ACTIVE');
  assert.equal('residentialAddress' in pub, false);
  assert.equal('email' in pub, false);
});

test('Private advertisement validator enforces maximum 2 images rule', () => {
  const validAd = validatePrivateAdSubmission({
    title: 'Sri Lakshmi Silks Grand Opening',
    businessName: 'Sri Lakshmi Silks',
    contactNumber: '9848011223',
    description: 'Festive discount on Pochampally & Gadwal handloom sarees',
    images: ['img1.png', 'img2.png'],
    targetState: 'Telangana',
    targetDistrict: 'Hyderabad',
    targetMandal: 'Ameerpet',
    startDate: '2026-11-01',
    expiryDate: '2026-12-01',
  });
  assert.equal(validAd.valid, true);

  const tooManyImages = validatePrivateAdSubmission({
    title: 'Sri Lakshmi Silks Grand Opening',
    businessName: 'Sri Lakshmi Silks',
    contactNumber: '9848011223',
    description: 'Festive discount',
    images: ['img1.png', 'img2.png', 'img3.png'],
    targetState: 'Telangana',
    targetDistrict: 'Hyderabad',
    targetMandal: 'Ameerpet',
    startDate: '2026-11-01',
    expiryDate: '2026-12-01',
  });
  assert.equal(tooManyImages.valid, false);
});

test('SEO slug and QR matrix generators produce valid deterministic outputs', () => {
  const slug = generateNewsSlug(
    'Telangana',
    'Hyderabad',
    'Metro Rail Phase II Expansion Approved by Cabinet'
  );
  assert.equal(
    slug,
    'telangana-hyderabad-metro-rail-phase-ii-expansion-approved-by-cabinet'
  );

  const qr = generateQrMatrix('https://netibhaaratham.com/verify?id=NB-TG-HYD-2026-0001');
  assert.equal(qr.length, 21);
  assert.equal(qr[0].length, 21);
  assert.equal(qr[0][0], true); // Top-left finder corner
});

test('Telangana (33 Districts) and Andhra Pradesh (26 Districts) directory is complete with all Mandals', async () => {
  const {
    INITIAL_INDIA_DISTRICTS,
    INITIAL_INDIA_MANDALS,
    getDistrictsForState,
    getMandalsForDistrict,
  } = await import('./india-locations');

  const tgDistricts = getDistrictsForState(INITIAL_INDIA_DISTRICTS, 'Telangana');
  const apDistricts = getDistrictsForState(INITIAL_INDIA_DISTRICTS, 'Andhra Pradesh');

  assert.equal(tgDistricts.length, 33, 'Telangana must have exactly 33 districts');
  assert.equal(apDistricts.length, 26, 'Andhra Pradesh must have exactly 26 districts');

  const tgMandals = INITIAL_INDIA_MANDALS.filter((m) => m.stateCode === 'TG');
  const apMandals = INITIAL_INDIA_MANDALS.filter((m) => m.stateCode === 'AP');

  assert.ok(tgMandals.length >= 615, `Expected 615+ Telangana mandals, got ${tgMandals.length}`);
  assert.ok(apMandals.length >= 675, `Expected 675+ AP mandals, got ${apMandals.length}`);

  // Verify legacy alias resolution for NTR (Vijayawada) -> NTR District
  const ntrMandals = getMandalsForDistrict(INITIAL_INDIA_MANDALS, 'NTR (Vijayawada)');
  assert.equal(ntrMandals.length, 20);
});

test('Article share link generator builds direct article URL and social share links', async () => {
  const { buildArticleShareData } = await import('./portal-rules');
  const share = buildArticleShareData(
    {
      slug: 'telangana-hyderabad-metro-phase-2',
      headline: 'హైదరాబాద్ మెట్రో రెండో దశకు క్యాబినెట్ ఆమోదం',
      district: 'Hyderabad',
      state: 'Telangana',
    },
    'https://netibhaaratham.com'
  );

  assert.equal(share.articleUrl, 'https://netibhaaratham.com/news/telangana-hyderabad-metro-phase-2');
  assert.ok(share.whatsappUrl.startsWith('https://wa.me/?text='));
  assert.ok(share.twitterUrl.includes('twitter.com/intent/tweet'));
  assert.ok(share.facebookUrl.includes('facebook.com/sharer/sharer.php'));
  assert.ok(share.telegramUrl.includes('t.me/share/url'));
});

test('Official Tricolour NETI BHARATHAM logo is configured as default website logo', async () => {
  const { OFFICIAL_TRICOLOUR_LOGO_URL, DEFAULT_WEBSITE_SETTINGS } = await import('./default-data');
  assert.equal(
    OFFICIAL_TRICOLOUR_LOGO_URL,
    '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'
  );
  assert.equal(DEFAULT_WEBSITE_SETTINGS.logoUrl, OFFICIAL_TRICOLOUR_LOGO_URL);
});



