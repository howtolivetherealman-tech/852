import type { ReporterRecord, PublicReporterVerification } from './portal-rules';

export interface NewsCategoryItem {
  id: string;
  name: string;
  nameTelugu: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface NewsArticleItem {
  id: string;
  slug: string;
  headline: string;
  subheadline: string;
  content: string;
  category: string;
  state: string;
  district: string;
  mandal: string;
  villageOrTown: string;
  featuredImageUrl: string;
  galleryImages: string[];
  imageCaption: string;
  videoUrl: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  language: 'Telugu' | 'English' | 'Bilingual';
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  reporterUid: string;
  reporterId: string;
  reporterName: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'UNPUBLISHED';
  rejectionRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateAdItem {
  id: string;
  title: string;
  businessName: string;
  contactNumber: string;
  description: string;
  image1Url: string;
  image2Url: string;
  linkUrl: string;
  targetState: string;
  targetDistrict: string;
  targetMandal: string;
  startDate: string;
  expiryDate: string;
  position: 'HEADER' | 'HOMEPAGE_BANNER' | 'SIDEBAR' | 'ARTICLE_INLINE' | 'FOOTER';
  priceAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'WAIVED';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  reporterUid: string;
  reporterId: string;
  createdAt: string;
}

export const OFFICIAL_TRICOLOUR_LOGO_URL =
  '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png';

export interface WebsiteSettingsItem {
  siteName: string;
  siteNameTelugu: string;
  domain: string;
  tagline: string;
  logoUrl: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  breakingNewsTickerText: string;
  contactEmail: string;
  contactPhone: string;
  emergencyContact: string;
  locationAddress: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  aboutUsContent: string;
  privacyPolicyContent: string;
  termsContent: string;
  disclaimerContent: string;
  updatedAt: string;
}

export interface AdSenseSettingsItem {
  enabled: boolean;
  publisherId: string;
  clientId: string;
  headerSlotId: string;
  homepageSlotId: string;
  articleSlotId: string;
  sidebarSlotId: string;
  footerSlotId: string;
  mobilePlacementEnabled: boolean;
  desktopPlacementEnabled: boolean;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  actorUid: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetCollection: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface MembershipRenewalItem {
  id: string;
  reporterUid: string;
  reporterId: string;
  previousExpiry: string;
  newExpiry: string;
  renewedByUid: string;
  remarks: string;
  renewedAt: string;
}

export interface NotificationItem {
  id: string;
  recipientUid: string;
  title: string;
  message: string;
  type: 'APPROVAL' | 'REJECTION' | 'EXPIRY_REMINDER' | 'NEWS_STATUS' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export const DEFAULT_NEWS_CATEGORIES: NewsCategoryItem[] = [
  { id: 'cat-1', name: 'Breaking News', nameTelugu: 'బ్రేకింగ్ న్యూస్', slug: 'breaking-news', order: 1, active: true },
  { id: 'cat-2', name: 'National News', nameTelugu: 'జాతీయ వార్తలు', slug: 'national-news', order: 2, active: true },
  { id: 'cat-3', name: 'International News', nameTelugu: 'అంతర్జాతీయ వార్తలు', slug: 'international-news', order: 3, active: true },
  { id: 'cat-4', name: 'State News', nameTelugu: 'రాష్ట్ర వార్తలు', slug: 'state-news', order: 4, active: true },
  { id: 'cat-5', name: 'Politics', nameTelugu: 'రాజకీయాలు', slug: 'politics', order: 5, active: true },
  { id: 'cat-6', name: 'Government', nameTelugu: 'ప్రభుత్వం', slug: 'government', order: 6, active: true },
  { id: 'cat-7', name: 'District News', nameTelugu: 'జిల్లా వార్తలు', slug: 'district-news', order: 7, active: true },
  { id: 'cat-8', name: 'Mandal News', nameTelugu: 'మండల వార్తలు', slug: 'mandal-news', order: 8, active: true },
  { id: 'cat-9', name: 'Crime', nameTelugu: 'క్రైమ్', slug: 'crime', order: 9, active: true },
  { id: 'cat-10', name: 'Education', nameTelugu: 'విద్య', slug: 'education', order: 10, active: true },
  { id: 'cat-11', name: 'Employment & Jobs', nameTelugu: 'ఉద్యోగాలు & ఉపాధి', slug: 'employment-jobs', order: 11, active: true },
  { id: 'cat-12', name: 'Business', nameTelugu: 'వ్యాపారం', slug: 'business', order: 12, active: true },
  { id: 'cat-13', name: 'Agriculture', nameTelugu: 'వ్యవసాయం', slug: 'agriculture', order: 13, active: true },
  { id: 'cat-14', name: 'Farmers', nameTelugu: 'రైతులు', slug: 'farmers', order: 14, active: true },
  { id: 'cat-15', name: 'Health', nameTelugu: 'ఆరోగ్యం', slug: 'health', order: 15, active: true },
  { id: 'cat-16', name: 'Technology', nameTelugu: 'టెక్నాలజీ', slug: 'technology', order: 16, active: true },
  { id: 'cat-17', name: 'Cinema', nameTelugu: 'సినిమా', slug: 'cinema', order: 17, active: true },
  { id: 'cat-18', name: 'Entertainment', nameTelugu: 'వినోదం', slug: 'entertainment', order: 18, active: true },
  { id: 'cat-19', name: 'Sports', nameTelugu: 'క్రీడలు', slug: 'sports', order: 19, active: true },
  { id: 'cat-20', name: 'Women', nameTelugu: 'మహిళలు', slug: 'women', order: 20, active: true },
  { id: 'cat-21', name: 'Youth', nameTelugu: 'యువత', slug: 'youth', order: 21, active: true },
  { id: 'cat-22', name: 'Devotional', nameTelugu: 'భక్తి', slug: 'devotional', order: 22, active: true },
  { id: 'cat-23', name: 'Spiritual', nameTelugu: 'ఆధ్యాత్మికం', slug: 'spiritual', order: 23, active: true },
  { id: 'cat-24', name: 'Social Issues', nameTelugu: 'సామాజిక అంశాలు', slug: 'social-issues', order: 24, active: true },
  { id: 'cat-25', name: 'Lifestyle', nameTelugu: 'జీవనశైలి', slug: 'lifestyle', order: 25, active: true },
  { id: 'cat-26', name: 'Special Stories', nameTelugu: 'ప్రత్యేక కథనాలు', slug: 'special-stories', order: 26, active: true },
  { id: 'cat-27', name: 'Interviews', nameTelugu: 'ఇంటర్వ్యూలు', slug: 'interviews', order: 27, active: true },
  { id: 'cat-28', name: 'Local News', nameTelugu: 'స్థానిక వార్తలు', slug: 'local-news', order: 28, active: true },
  { id: 'cat-29', name: 'Other News', nameTelugu: 'ఇతర వార్తలు', slug: 'other-news', order: 29, active: true },
];

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsItem = {
  siteName: 'NETI BHARATHAM',
  siteNameTelugu: 'నేటి భారతం',
  domain: 'https://netibhaaratham.com',
  tagline: 'సత్యం • నిష్పాక్షికత • ప్రజాగళం — Truth, Impartiality & Voice of the People',
  logoUrl: OFFICIAL_TRICOLOUR_LOGO_URL,
  logoText: 'NETI BHARATHAM • నేటి భారతం',
  primaryColor: '#DC2626',
  secondaryColor: '#0A192F',
  breakingNewsTickerText:
    'తెలంగాణ సచివాలయం నుంచి డిజిటల్ పాలనపై కీలక సమీక్ష • హైదరాబాద్ మెట్రో రెండో దశ విస్తరణ పనులకు వేగవంతమైన అనుమతులు • ఆంధ్రప్రదేశ్ పోలవరం మరియు రాజధాని అమరావతి మౌలిక సదుపాయాల పనులపై ప్రత్యేక నివేదిక • నేటి భారతం అఫీషియల్ మొబైల్ యాప్ ఇప్పుడు అందుబాటులో ఉంది - వెంటనే డౌన్‌లోడ్ చేసుకోండి!',
  contactEmail: 'netibhaarathamtelugu@gmail.com',
  contactPhone: '+91 40 2345 6789',
  emergencyContact: '+91 98480 10999 (24x7 Press Control Room)',
  locationAddress: 'Hyderabad, Telangana, India',
  facebookUrl: 'https://facebook.com/netibhaaratham',
  twitterUrl: 'https://x.com/netibhaaratham',
  youtubeUrl: 'https://youtube.com/@netibhaaratham',
  instagramUrl: 'https://instagram.com/netibhaaratham',
  telegramUrl: 'https://t.me/netibhaaratham',
  aboutUsContent:
    'NETI BHARATHAM (నేటి భారతం - https://netibhaaratham.com) is an independent Telugu digital news portal headquartered in Hyderabad, Telangana, India. Our grass-roots network of accredited Mandal, District, State, and National reporters delivers verified, real-time news across all Indian States and Union Territories.',
  privacyPolicyContent:
    'NETI BHARATHAM strictly protects reader and reporter privacy. Confidential reporter verification documents (such as Aadhaar uploads) are stored in an isolated encrypted collection accessible solely to the Super Admin for press credential verification and are never shared or exposed publicly.',
  termsContent:
    'All reporters accredited by NETI BHARATHAM must adhere to the Press Council of India norms of journalistic ethics. Press Reporter ID cards are valid for exactly 6 calendar months from approval date and are verifiable online via QR code.',
  disclaimerContent:
    'News articles published on NETI BHARATHAM undergo editorial verification before publication. Views expressed in interviews or opinion columns belong to the respective authors.',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const DEFAULT_ADSENSE_SETTINGS: AdSenseSettingsItem = {
  enabled: false,
  publisherId: '',
  clientId: '',
  headerSlotId: '',
  homepageSlotId: '',
  articleSlotId: '',
  sidebarSlotId: '',
  footerSlotId: '',
  mobilePlacementEnabled: true,
  desktopPlacementEnabled: true,
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const INITIAL_REPORTERS: ReporterRecord[] = [
  {
    uid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    fullName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    fatherOrHusbandName: 'K. Narasimha Rao',
    dob: '1988-06-15',
    gender: 'Male',
    mobile: '9848023456',
    whatsapp: '9848023456',
    email: 'venkat.hyd@netibhaaratham.com',
    residentialAddress: 'H.No. 6-3-112, Somajiguda, Khairatabad Mandal, Hyderabad - 500082',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Khairatabad',
    villageOrTown: 'Somajiguda',
    pinCode: '500082',
    experience: '8 Years in Electronic & Print Media',
    previousOrganization: 'Telangana Vaartha',
    profilePhotoUrl: '/icon.svg',
    username: 'venkat_hyd',
    consentAccepted: true,
    status: 'APPROVED',
    approvedAt: '2026-08-10T09:00:00.000Z',
    expiresAt: '2027-02-10T09:00:00.000Z',
    createdAt: '2026-08-08T10:00:00.000Z',
    updatedAt: '2026-08-10T09:00:00.000Z',
  },
  {
    uid: 'rep-vja-002',
    reporterId: 'NB-AP-NTR-2026-0002',
    fullName: 'దేవరకొండ పద్మావతి (D. Padmavathi)',
    fatherOrHusbandName: 'D. Suryanarayana',
    dob: '1992-11-22',
    gender: 'Female',
    mobile: '9440156789',
    whatsapp: '9440156789',
    email: 'padmavathi.vja@netibhaaratham.com',
    residentialAddress: 'D.No. 40-9-18, Benz Circle, Vijayawada Central, NTR District - 520010',
    state: 'Andhra Pradesh',
    district: 'NTR (Vijayawada)',
    mandal: 'Vijayawada Central',
    villageOrTown: 'Vijayawada',
    pinCode: '520010',
    experience: '5 Years in Digital Journalism',
    previousOrganization: 'Krishna Patrika Digital',
    profilePhotoUrl: '/icon.svg',
    username: 'padma_vja',
    consentAccepted: true,
    status: 'APPROVED',
    approvedAt: '2026-09-01T11:30:00.000Z',
    expiresAt: '2027-03-01T11:30:00.000Z',
    createdAt: '2026-08-29T14:20:00.000Z',
    updatedAt: '2026-09-01T11:30:00.000Z',
  },
  {
    uid: 'rep-wgl-003',
    reporterId: 'NB-TG-HAN-2026-0003',
    fullName: 'మల్లెల రాజేందర్ రెడ్డి (M. Rajender Reddy)',
    fatherOrHusbandName: 'M. Malla Reddy',
    dob: '1985-03-19',
    gender: 'Male',
    mobile: '9912345670',
    whatsapp: '9912345670',
    email: 'rajender.wgl@netibhaaratham.com',
    residentialAddress: 'H.No. 2-4-510, Subedari, Hanamkonda Mandal, Hanumakonda - 506001',
    state: 'Telangana',
    district: 'Hanumakonda',
    mandal: 'Hanamkonda',
    villageOrTown: 'Subedari',
    pinCode: '506001',
    experience: '10 Years Rural & Agriculture Reporting',
    previousOrganization: 'Kakatiya Bulletin',
    profilePhotoUrl: '/icon.svg',
    username: 'rajender_wgl',
    consentAccepted: true,
    status: 'EXPIRED',
    approvedAt: '2026-02-01T08:00:00.000Z',
    expiresAt: '2026-08-01T08:00:00.000Z',
    createdAt: '2026-01-28T08:00:00.000Z',
    updatedAt: '2026-08-02T08:00:00.000Z',
  },
  {
    uid: 'rep-pending-004',
    reporterId: 'PENDING',
    fullName: 'చింతలపూడి శ్రీనివాస రావు (C. Srinivasa Rao)',
    fatherOrHusbandName: 'C. Rama Rao',
    dob: '1995-07-08',
    gender: 'Male',
    mobile: '9701234890',
    whatsapp: '9701234890',
    email: 'srinivas.kmm@netibhaaratham.com',
    residentialAddress: 'H.No. 11-2-44, Wyra Road, Khammam Urban Mandal, Khammam - 507002',
    state: 'Telangana',
    district: 'Khammam',
    mandal: 'Khammam Urban',
    villageOrTown: 'Khammam',
    pinCode: '507002',
    experience: '3 Years Local News Desk',
    previousOrganization: 'Godavari Express',
    profilePhotoUrl: '/icon.svg',
    username: 'srinivas_kmm',
    consentAccepted: true,
    status: 'PENDING',
    createdAt: '2026-11-01T15:00:00.000Z',
    updatedAt: '2026-11-01T15:00:00.000Z',
  },
];

export const INITIAL_REPORTER_ID_CARDS: PublicReporterVerification[] = [
  {
    reporterId: 'NB-TG-HYD-2026-0001',
    fullName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    designation: 'PRESS REPORTER',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Khairatabad',
    mobileMasked: '+91 XXXXX-X3456',
    profilePhotoUrl: '/icon.svg',
    issuedAt: '2026-08-10T09:00:00.000Z',
    expiresAt: '2027-02-10T09:00:00.000Z',
    status: 'ACTIVE',
    authorizedBy: 'Chief Editor, NETI BHARATHAM',
  },
  {
    reporterId: 'NB-AP-NTR-2026-0002',
    fullName: 'దేవరకొండ పద్మావతి (D. Padmavathi)',
    designation: 'PRESS REPORTER',
    state: 'Andhra Pradesh',
    district: 'NTR (Vijayawada)',
    mandal: 'Vijayawada Central',
    mobileMasked: '+91 XXXXX-X6789',
    profilePhotoUrl: '/icon.svg',
    issuedAt: '2026-09-01T11:30:00.000Z',
    expiresAt: '2027-03-01T11:30:00.000Z',
    status: 'ACTIVE',
    authorizedBy: 'Chief Editor, NETI BHARATHAM',
  },
  {
    reporterId: 'NB-TG-HAN-2026-0003',
    fullName: 'మల్లెల రాజేందర్ రెడ్డి (M. Rajender Reddy)',
    designation: 'PRESS REPORTER',
    state: 'Telangana',
    district: 'Hanumakonda',
    mandal: 'Hanamkonda',
    mobileMasked: '+91 XXXXX-X5670',
    profilePhotoUrl: '/icon.svg',
    issuedAt: '2026-02-01T08:00:00.000Z',
    expiresAt: '2026-08-01T08:00:00.000Z',
    status: 'EXPIRED',
    authorizedBy: 'Chief Editor, NETI BHARATHAM',
  },
];

export const INITIAL_NEWS_ARTICLES: NewsArticleItem[] = [
  {
    id: 'news-101',
    slug: 'telangana-hyderabad-secretariat-digital-governance-mission-2026',
    headline: 'తెలంగాణ సచివాలయం నుంచి గ్రామ స్థాయి వరకు డిజిటల్ పాలన విస్తరణ: ప్రజలకు మరింత వేగంగా పౌర సేవలు',
    subheadline:
      'Telangana Secretariat launches unified Mandal-to-State real-time citizen grievance & digital service delivery dashboard across all 33 districts.',
    content:
      'హైదరాబాద్ (నేటి భారతం ప్రతినిధి): తెలంగాణ రాష్ట్ర వ్యాప్తంగా గ్రామ, మండల మరియు జిల్లా స్థాయిలో పౌర సేవలను మరింత పారదర్శకంగా, వేగవంతంగా అందించేందుకు రాష్ట్ర ప్రభుత్వం నూతన డిజిటల్ గవర్నెన్స్ కార్యాచరణను ప్రారంభించింది. డాక్టర్ బి.ఆర్. అంబేద్కర్ తెలంగాణ రాష్ట్ర సచివాలయంలో జరిగిన ఉన్నత స్థాయి సమీక్షా సమావేశంలో అన్ని జిల్లాల కలెక్టర్లు, మండల అధికారులకు కీలక ఆదేశాలు జారీ చేశారు.\n\nఈ నూతన విధానం ద్వారా భూ రికార్డులు, రైతు భరోసా, పెన్షన్లు, రేషన్ కార్డుల దరఖాస్తులు మరియు స్థానిక మౌలిక వసతుల ఫిర్యాదులను మండల కార్యాలయాల నుంచే రియల్-టైమ్ విధానంలో పరిష్కరించనున్నారు. ప్రతి మండల కేంద్రంలో ప్రత్యేక డిజిటల్ సేవా డెస్క్‌లను ఏర్పాటు చేస్తున్నట్లు అధికారులు వెల్లడించారు.',
    category: 'State News',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Khairatabad',
    villageOrTown: 'Secretariat, Hyderabad',
    featuredImageUrl: '/news-art/secretariat.svg',
    galleryImages: ['/news-art/secretariat.svg', '/news-art/metro.svg'],
    imageCaption: 'డా. బి.ఆర్. అంబేద్కర్ తెలంగాణ రాష్ట్ర సచివాలయం, హైదరాబాద్',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['Telangana', 'Hyderabad', 'Secretariat', 'DigitalGovernance', 'MandalNews'],
    seoTitle: 'Telangana Secretariat Digital Governance Mission | NETI BHARATHAM',
    seoDescription:
      'Telangana launches real-time Mandal and District citizen digital services from Hyderabad Secretariat.',
    language: 'Bilingual',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 4820,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PUBLISHED',
    createdAt: '2026-11-02T14:30:00.000Z',
    updatedAt: '2026-11-02T14:30:00.000Z',
  },
  {
    id: 'news-102',
    slug: 'telangana-rangareddy-hyderabad-metro-rail-phase-2-airport-corridor',
    headline: 'హైదరాబాద్ మెట్రో రెండో దశ: శంషాబాద్ ఎయిర్‌పోర్ట్ మరియు ఐటీ కారిడార్ అనుసంధానం వేగవంతం',
    subheadline:
      'Hyderabad Metro Phase-II expansion connecting Raidurg, Shamshabad Airport, and Hayathnagar enters fast-track execution.',
    content:
      'హైదరాబాద్ / రంగారెడ్డి (నేటి భారతం): రాజధాని హైదరాబాద్ మహానగర ప్రజా రవాణా వ్యవస్థలో కీలక మైలురాయిగా నిలవనున్న మెట్రో రైల్ రెండో దశ (Phase-II) విస్తరణ పనులపై ప్రభుత్వం ప్రత్యేక దృష్టి సారించింది. శేరిలింగంపల్లి, రాయదుర్గం ఐటీ కారిడార్ నుంచి శంషాబాద్ అంతర్జాతీయ విమానాశ్రయం వరకు మరియు నాగోల్ నుంచి ఎల్బీ నగర్, హయత్‌నగర్ వరకు నిర్మించనున్న నూతన కారిడార్ల భూసేకరణ, డిజైన్ ప్రక్రియ వేగంగా సాగుతోంది.\n\nఈ ప్రాజెక్ట్ పూర్తయితే రోజుకు అదనంగా 8 లక్షల మంది ప్రయాణికులకు ట్రాఫిక్ రహిత ప్రయాణ సౌకర్యం లభిస్తుందని అధికారులు తెలిపారు.',
    category: 'District News',
    state: 'Telangana',
    district: 'Rangareddy',
    mandal: 'Serilingampally',
    villageOrTown: 'HITEC City & Shamshabad',
    featuredImageUrl: '/news-art/metro.svg',
    galleryImages: ['/news-art/metro.svg'],
    imageCaption: 'హైదరాబాద్ మెట్రో రైల్ రెండో దశ కారిడార్ నమూనా',
    videoUrl: '',
    tags: ['HyderabadMetro', 'Rangareddy', 'Serilingampally', 'Shamshabad', 'Infrastructure'],
    seoTitle: 'Hyderabad Metro Phase 2 Shamshabad Airport Corridor | NETI BHARATHAM',
    seoDescription:
      'Fast-track approvals and ground works for Hyderabad Metro Phase 2 in Rangareddy and Hyderabad districts.',
    language: 'Bilingual',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 3690,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PUBLISHED',
    createdAt: '2026-11-02T12:15:00.000Z',
    updatedAt: '2026-11-02T12:15:00.000Z',
  },
  {
    id: 'news-103',
    slug: 'andhra-pradesh-ntr-vijayawada-krishna-delta-kharif-paddy-procurement',
    headline: 'ఆంధ్రప్రదేశ్‌లో ధాన్యం కొనుగోలు కేంద్రాలు ప్రారంభం: 48 గంటల్లోనే రైతుల ఖాతాల్లో మద్దతు ధర జమ',
    subheadline:
      'Farmers across Krishna, Guntur, and Godavari districts receive direct bank credit within 48 hours at Mandal Rythu Seva Kendras.',
    content:
      'విజయవాడ / గుంటూరు (నేటి భారతం): ఆంధ్రప్రదేశ్ వ్యాప్తంగా ఖరీఫ్ సీజన్ ధాన్యం కొనుగోళ్లను రైతు సేవా కేంద్రాల ద్వారా ప్రభుత్వం వేగవంతం చేసింది. ఎన్టీఆర్ జిల్లా విజయవాడ, ఇబ్రహీంపట్నం, మైలవరం మరియు గుంటూరు జిల్లా తెనాలి, మంగళగిరి మండలాల్లో ఏర్పాటు చేసిన కొనుగోలు కేంద్రాలను అధికారులు పరిశీలించారు.\n\nతేమ శాతం నిర్ధారణ వెంటనే పూర్తి చేసి, గోనె సంచులు మరియు రవాణా సదుపాయం కల్పించడంతో పాటు ధాన్యం విక్రయించిన 48 గంటల్లోనే రైతుల బ్యాంకు ఖాతాల్లో కనీస మద్దతు ధర (MSP) నేరుగా జమ చేస్తున్నట్లు పౌరసరఫరాల శాఖ ప్రకటించింది.',
    category: 'Agriculture',
    state: 'Andhra Pradesh',
    district: 'NTR (Vijayawada)',
    mandal: 'Vijayawada Central',
    villageOrTown: 'Vijayawada',
    featuredImageUrl: '/news-art/agriculture.svg',
    galleryImages: ['/news-art/agriculture.svg'],
    imageCaption: 'కృష్ణా డెల్టా పరిధిలో పచ్చని వరి పొలాలు మరియు సాగునీటి కాలువలు',
    videoUrl: '',
    tags: ['AndhraPradesh', 'Agriculture', 'Farmers', 'Vijayawada', 'MSP'],
    seoTitle: 'AP Kharif Paddy Procurement & MSP Direct Transfer | NETI BHARATHAM',
    seoDescription:
      'Direct 48-hour MSP bank transfer for farmers across NTR Vijayawada and Guntur mandals.',
    language: 'Bilingual',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    views: 2940,
    reporterUid: 'rep-vja-002',
    reporterId: 'NB-AP-NTR-2026-0002',
    reporterName: 'దేవరకొండ పద్మావతి (D. Padmavathi)',
    status: 'PUBLISHED',
    createdAt: '2026-11-02T10:00:00.000Z',
    updatedAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'news-104',
    slug: 'delhi-new-delhi-national-high-speed-rail-and-digital-india-budget-2026',
    headline: 'జాతీయ మౌలిక వసతులు మరియు గ్రామీణ బ్రాడ్‌బ్యాండ్ విస్తరణకు కేంద్ర క్యాబినెట్ ఆమోదం',
    subheadline:
      'Union Cabinet approves new high-speed regional rail corridors and BharatNet Phase-III optical fiber connectivity to all village panchayats.',
    content:
      'న్యూఢిల్లీ (నేటి భారతం నేషనల్ డెస్క్): దేశంలోని ద్వితీయ, తృతీయ శ్రేణి నగరాలను మెట్రోపాలిటన్ కేంద్రాలతో అనుసంధానించే హై-స్పీడ్ రైల్ కారిడార్లు మరియు ప్రతి గ్రామ పంచాయతీకి హై-స్పీడ్ ఆప్టికల్ ఫైబర్ ఇంటర్నెట్ అందించే భారత్‌నెట్ విస్తరణకు కేంద్ర మంత్రివర్గం ఆమోదం తెలిపింది.\n\nదక్షిణాది రాష్ట్రాల్లో హైదరాబాద్-బెంగళూరు, హైదరాబాద్-విజయవాడ-చెన్నై పారిశ్రామిక కారిడార్లలో రవాణా మరియు లాజిస్టిక్స్ సదుపాయాలు మరింత మెరుగుపడనున్నాయి.',
    category: 'National News',
    state: 'Delhi (NCT)',
    district: 'New Delhi',
    mandal: 'Parliament Street (Connaught Place)',
    villageOrTown: 'New Delhi',
    featuredImageUrl: '/news-art/national.svg',
    galleryImages: ['/news-art/national.svg'],
    imageCaption: 'న్యూఢిల్లీలోని కేంద్ర సచివాలయ భవన సముదాయం',
    videoUrl: '',
    tags: ['NationalNews', 'India', 'NewDelhi', 'Infrastructure', 'Cabinet'],
    seoTitle: 'Union Cabinet Approves High-Speed Rail & Rural Broadband | NETI BHARATHAM',
    seoDescription:
      'National infrastructure and BharatNet rural fiber connectivity approved in New Delhi.',
    language: 'Bilingual',
    isBreaking: true,
    isFeatured: false,
    isTrending: true,
    views: 3120,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PUBLISHED',
    createdAt: '2026-11-02T08:45:00.000Z',
    updatedAt: '2026-11-02T08:45:00.000Z',
  },
  {
    id: 'news-105',
    slug: 'telangana-hanumakonda-kazipet-railway-coach-factory-employment-drive',
    headline: 'కాజీపేట రైల్వే మాన్యుఫాక్చరింగ్ యూనిట్ నిర్మాణ పనులు వేగవంతం: స్థానిక యువతకు నైపుణ్య శిక్షణ',
    subheadline:
      'Kazipet Railway Coach & Wagon manufacturing hub in Hanumakonda schedules skill development and technical recruitment programs.',
    content:
      'హనుమకొండ / కాజీపేట (నేటి భారతం): ఉత్తర తెలంగాణ యువత ఎంతో కాలంగా ఎదురుచూస్తున్న కాజీపేట రైల్వే కోచ్ మరియు వ్యాగన్ తయారీ యూనిట్ పనులు తుది దశకు చేరుకున్నాయి. హనుమకొండ జిల్లా కాజీపేట మండల పరిధిలో నిర్మిస్తున్న ఈ భారీ పరిశ్రమ ద్వారా ప్రత్యక్షంగా, పరోక్షంగా వేలాది మంది ఐటీఐ, డిప్లొమా మరియు ఇంజనీరింగ్ అభ్యర్థులకు ఉపాధి అవకాశాలు లభించనున్నాయి.',
    category: 'Employment & Jobs',
    state: 'Telangana',
    district: 'Hanumakonda',
    mandal: 'Kazipet',
    villageOrTown: 'Kazipet',
    featuredImageUrl: '/news-art/metro.svg',
    galleryImages: ['/news-art/metro.svg'],
    imageCaption: 'కాజీపేట పారిశ్రామిక మరియు రైల్వే కారిడార్',
    videoUrl: '',
    tags: ['Hanumakonda', 'Kazipet', 'Employment', 'Jobs', 'Railways'],
    seoTitle: 'Kazipet Railway Coach Unit Youth Skill & Employment Drive | NETI BHARATHAM',
    seoDescription:
      'Employment and technical skill training updates from Kazipet Mandal, Hanumakonda District.',
    language: 'Bilingual',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 1980,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PUBLISHED',
    createdAt: '2026-11-01T18:20:00.000Z',
    updatedAt: '2026-11-01T18:20:00.000Z',
  },
  {
    id: 'news-106',
    slug: 'telangana-hyderabad-ameerpet-skill-university-ai-certifications',
    headline: 'తెలంగాణ యంగ్ ఇండియా స్కిల్స్ యూనివర్సిటీ ఆధ్వర్యంలో ఉచిత ఏఐ & క్లౌడ్ టెక్నాలజీ శిక్షణ',
    subheadline:
      'New batch registrations open for engineering and degree graduates across Hyderabad, Medchal, and Karimnagar.',
    content:
      'హైదరాబాద్ (నేటి భారతం): రాష్ట్రంలోని డిగ్రీ, ఇంజనీరింగ్ పూర్తి చేసిన యువతకు పరిశ్రమల అవసరాలకు అనుగుణంగా ఆధునిక సాంకేతిక నైపుణ్యాలను అందించేందుకు యంగ్ ఇండియా స్కిల్స్ యూనివర్సిటీ నూతన కోర్సులను ప్రారంభించింది. అమీర్‌పేట, కూకట్‌పల్లి మరియు గచ్చిబౌలి క్యాంపస్‌లలో రిజిస్ట్రేషన్లు ప్రారంభమయ్యాయి.',
    category: 'Education',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Ameerpet',
    villageOrTown: 'Ameerpet',
    featuredImageUrl: '/news-art/secretariat.svg',
    galleryImages: ['/news-art/secretariat.svg'],
    imageCaption: 'యువతకు సాంకేతిక నైపుణ్య శిక్షణ కార్యక్రమాలు',
    videoUrl: '',
    tags: ['Education', 'Ameerpet', 'Hyderabad', 'Youth', 'Technology'],
    seoTitle: 'Telangana Skills University Free Tech Courses in Hyderabad | NETI BHARATHAM',
    seoDescription:
      'Skill certification programs launched for students in Ameerpet and Kukatpally mandals.',
    language: 'Telugu',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    views: 2150,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PUBLISHED',
    createdAt: '2026-11-01T16:10:00.000Z',
    updatedAt: '2026-11-01T16:10:00.000Z',
  },
  {
    id: 'news-107',
    slug: 'telangana-nalgonda-nagarjuna-sagar-left-canal-ayacut-water-release',
    headline: 'నాగార్జున సాగర్ ఎడమ కాలువ కింద యాసంగి సాగుకు నీటి విడుదల షెడ్యూల్ ఖరారు',
    subheadline:
      'Irrigation officials review reservoir storage levels for Nalgonda, Suryapet, and Khammam ayacut mandals.',
    content:
      'నల్గొండ / సూర్యాపేట (నేటి భారతం): నాగార్జున సాగర్ జలాశయంలో పూర్తి స్థాయి నీటి మట్టం ఉండటంతో ఎడమ కాలువ ఆయకట్టు పరిధిలోని నల్గొండ, సూర్యాపేట, ఖమ్మం జిల్లాల రైతులకు యాసంగి పంటల సాగు నిమిత్తం వారబందీ విధానంలో నీటిని విడుదల చేసేందుకు సాగునీటి పారుదల శాఖ షెడ్యూల్ విడుదల చేసింది.',
    category: 'Mandal News',
    state: 'Telangana',
    district: 'Nalgonda',
    mandal: 'Nagarjuna Sagar',
    villageOrTown: 'Nandikonda',
    featuredImageUrl: '/news-art/agriculture.svg',
    galleryImages: ['/news-art/agriculture.svg'],
    imageCaption: 'నాగార్జున సాగర్ జలాశయం మరియు కాలువ నీటి విడుదల',
    videoUrl: '',
    tags: ['Nalgonda', 'NagarjunaSagar', 'Farmers', 'MandalNews'],
    seoTitle: 'Nagarjuna Sagar Left Canal Water Release Schedule | NETI BHARATHAM',
    seoDescription:
      'Irrigation schedule announced for Nalgonda and Suryapet mandals.',
    language: 'Telugu',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 1540,
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    reporterName: 'కొత్తపల్లి వెంకటాచార్యులు (K. Venkatacharyulu)',
    status: 'PENDING',
    createdAt: '2026-11-02T16:00:00.000Z',
    updatedAt: '2026-11-02T16:00:00.000Z',
  },
];

export const INITIAL_PRIVATE_ADS: PrivateAdItem[] = [
  {
    id: 'ad-201',
    title: 'శ్రీ లక్ష్మీ వెంకటేశ్వర హ్యాండ్లూమ్ సిల్క్స్ — పోచంపల్లి & గద్వాల్ పట్టు చీరల ప్రత్యేక ప్రదర్శన',
    businessName: 'Sri Lakshmi Venkateswara Handloom Silks',
    contactNumber: '9848099112',
    description:
      'అసలైన చేనేత పోచంపల్లి ఇక్కత్ మరియు గద్వాల్ పట్టు చీరలపై 25% పండుగ తగ్గింపు. హైదరాబాద్ అమీర్‌పేట మరియు కూకట్‌పల్లి షోరూమ్‌లలో లభించును.',
    image1Url: '/news-art/secretariat.svg',
    image2Url: '/news-art/metro.svg',
    linkUrl: 'https://netibhaaratham.com',
    targetState: 'Telangana',
    targetDistrict: 'Hyderabad',
    targetMandal: 'Ameerpet',
    startDate: '2026-10-15',
    expiryDate: '2027-01-15',
    position: 'HOMEPAGE_BANNER',
    priceAmount: 4500,
    paymentStatus: 'PAID',
    status: 'APPROVED',
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'ad-202',
    title: 'కాకతీయ అగ్రి టెక్ & డ్రిప్ ఇరిగేషన్ సిస్టమ్స్ — రైతులకు సబ్సిడీపై ఆధునిక పరికరాలు',
    businessName: 'Kakatiya Agri-Tech Solutions',
    contactNumber: '9440188223',
    description:
      'వరంగల్, కరీంనగర్, ఖమ్మం మరియు నల్గొండ జిల్లాల రైతులకు డ్రిప్ ఇరిగేషన్, సోలార్ పంప్ సెట్లపై ప్రత్యేక సర్వీస్ మరియు ఉచిత ఇన్‌స్టాలేషన్.',
    image1Url: '/news-art/agriculture.svg',
    image2Url: '',
    linkUrl: 'https://netibhaaratham.com',
    targetState: 'Telangana',
    targetDistrict: 'Hanumakonda',
    targetMandal: 'Hanamkonda',
    startDate: '2026-10-20',
    expiryDate: '2027-02-20',
    position: 'SIDEBAR',
    priceAmount: 3000,
    paymentStatus: 'PAID',
    status: 'APPROVED',
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    createdAt: '2026-10-20T12:00:00.000Z',
  },
  {
    id: 'ad-203',
    title: 'అమరావతి ఎడ్యుకేషన్ అకాడమీ — గ్రూప్-1, గ్రూప్-2 & డీఎస్సీ ప్రత్యేక బ్యాచ్‌లు ప్రారంభం',
    businessName: 'Amaravati Education Academy, Vijayawada',
    contactNumber: '9490122334',
    description:
      'అనుభవజ్ఞులైన అధ్యాపకులచే తెలుగు మరియు ఇంగ్లీష్ మీడియంలో ఆన్‌లైన్ & ఆఫ్‌లైన్ కోచింగ్.',
    image1Url: '/news-art/national.svg',
    image2Url: '/news-art/secretariat.svg',
    linkUrl: 'https://netibhaaratham.com',
    targetState: 'Andhra Pradesh',
    targetDistrict: 'NTR (Vijayawada)',
    targetMandal: 'Vijayawada Central',
    startDate: '2026-11-01',
    expiryDate: '2027-01-31',
    position: 'SIDEBAR',
    priceAmount: 2500,
    paymentStatus: 'PENDING',
    status: 'PENDING',
    reporterUid: 'rep-vja-002',
    reporterId: 'NB-AP-NTR-2026-0002',
    createdAt: '2026-11-01T14:00:00.000Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    actorUid: 'admin-bootstrap',
    actorName: 'Super Admin (Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'APPROVE_REPORTER',
    targetCollection: 'reporters',
    targetId: 'rep-hyd-001',
    details: 'Approved reporter K. Venkatacharyulu and issued ID NB-TG-HYD-2026-0001 (6 months validity).',
    createdAt: '2026-08-10T09:00:00.000Z',
  },
  {
    id: 'log-2',
    actorUid: 'admin-bootstrap',
    actorName: 'Super Admin (Admin)',
    actorRole: 'SUPER_ADMIN',
    action: 'PUBLISH_NEWS',
    targetCollection: 'news',
    targetId: 'news-101',
    details: 'Verified and published breaking news article: Telangana Secretariat Digital Governance.',
    createdAt: '2026-11-02T14:35:00.000Z',
  },
];

export const INITIAL_RENEWALS: MembershipRenewalItem[] = [
  {
    id: 'ren-1',
    reporterUid: 'rep-hyd-001',
    reporterId: 'NB-TG-HYD-2026-0001',
    previousExpiry: '2026-08-10T09:00:00.000Z',
    newExpiry: '2027-02-10T09:00:00.000Z',
    renewedByUid: 'admin-bootstrap',
    remarks: 'Renewed for 6 calendar months based on active Hyderabad Secretariat reporting.',
    renewedAt: '2026-08-10T09:00:00.000Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientUid: 'rep-hyd-001',
    title: 'Press Reporter ID Approved (NB-TG-HYD-2026-0001)',
    message:
      'Your NETI BHARATHAM Press Reporter application has been approved. Your Digital Press ID Card is active until 10 Feb 2027.',
    type: 'APPROVAL',
    read: false,
    createdAt: '2026-08-10T09:00:00.000Z',
  },
  {
    id: 'notif-2',
    recipientUid: 'rep-wgl-003',
    title: '6-Month Reporter Validity Expired',
    message:
      'Your Press Reporter ID (NB-TG-HAN-2026-0003) 6-month membership expired on 01 Aug 2026. News upload permissions are paused until Super Admin renewal.',
    type: 'EXPIRY_REMINDER',
    read: false,
    createdAt: '2026-08-01T09:00:00.000Z',
  },
];
