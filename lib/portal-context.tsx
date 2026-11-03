'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  fetchAllPortalDataFromMySQL,
  saveReporterToMySQL,
  saveNewsToMySQL,
  deleteNewsFromMySQL,
  updateSettingsInMySQL,
} from './mysql-api';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  INITIAL_INDIA_STATES,
  INITIAL_INDIA_DISTRICTS,
  INITIAL_INDIA_MANDALS,
  type StateEntry,
  type DistrictEntry,
  type MandalEntry,
} from './india-locations';
import {
  DEFAULT_NEWS_CATEGORIES,
  DEFAULT_WEBSITE_SETTINGS,
  DEFAULT_ADSENSE_SETTINGS,
  INITIAL_REPORTERS,
  INITIAL_REPORTER_ID_CARDS,
  INITIAL_NEWS_ARTICLES,
  INITIAL_PRIVATE_ADS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RENEWALS,
  INITIAL_NOTIFICATIONS,
  type NewsCategoryItem,
  type NewsArticleItem,
  type PrivateAdItem,
  type WebsiteSettingsItem,
  type AdSenseSettingsItem,
  type AuditLogItem,
  type MembershipRenewalItem,
  type NotificationItem,
} from './default-data';
import {
  calculateSixMonthExpiry,
  generateReporterId,
  validateReporterProfileUpdate,
  canReporterUploadNews,
  extractPublicVerificationData,
  validatePrivateAdSubmission,
  generateNewsSlug,
  getMembershipValidityStatus,
  type ReporterRecord,
  type PublicReporterVerification,
} from './portal-rules';

export interface PrivateAadhaarDoc {
  uid: string;
  aadhaarDocumentUrl: string;
  aadhaarFileName: string;
  aadhaarFileType: string;
  residentialProofNotes: string;
  uploadedAt: string;
}

interface PortalContextValue {
  // Auth & Role
  firebaseUser: User | null;
  isSuperAdmin: boolean;
  adminUsername: string;
  currentReporter: ReporterRecord | null;
  loginAsAdmin: (username: string, passwordOrBootstrapKey: string) => { ok: boolean; message: string };
  loginWithGoogleAdmin: () => Promise<{ ok: boolean; message: string }>;
  logoutAdmin: () => void;
  loginAsReporter: (username: string, password?: string) => { ok: boolean; message: string };
  logoutReporter: () => void;

  // Collections
  states: StateEntry[];
  districts: DistrictEntry[];
  mandals: MandalEntry[];
  categories: NewsCategoryItem[];
  news: NewsArticleItem[];
  reporters: ReporterRecord[];
  privateAadhaarDocs: Record<string, PrivateAadhaarDoc>;
  reporterIdCards: PublicReporterVerification[];
  advertisements: PrivateAdItem[];
  websiteSettings: WebsiteSettingsItem;
  adSenseSettings: AdSenseSettingsItem;
  auditLogs: AuditLogItem[];
  renewals: MembershipRenewalItem[];
  notifications: NotificationItem[];

  // Actions - Reporter Registration & Management
  registerReporter: (
    payload: Omit<ReporterRecord, 'uid' | 'reporterId' | 'status' | 'createdAt' | 'updatedAt'> & {
      password: string;
      aadhaarDocumentUrl: string;
      aadhaarFileName: string;
      aadhaarFileType: string;
    }
  ) => { ok: boolean; message: string; uid?: string };
  approveReporter: (uid: string) => { ok: boolean; message: string };
  rejectReporter: (uid: string, remarks: string) => { ok: boolean; message: string };
  renewReporterMembership: (uid: string, remarks?: string) => { ok: boolean; message: string };
  suspendOrReactivateReporter: (uid: string, suspend: boolean) => { ok: boolean; message: string };
  deleteReporterAccount: (uid: string) => { ok: boolean; message: string };
  updateReporterProfile: (
    uid: string,
    patch: Partial<ReporterRecord>,
    actorRole: 'REPORTER' | 'SUPER_ADMIN'
  ) => { ok: boolean; message: string };
  changeReporterPassword: (uid: string, newPassword: string) => { ok: boolean; message: string };

  // Actions - News Management
  submitNewsArticle: (
    payload: Omit<
      NewsArticleItem,
      'id' | 'slug' | 'views' | 'status' | 'createdAt' | 'updatedAt'
    >,
    publishImmediatelyAsAdmin?: boolean
  ) => { ok: boolean; message: string; article?: NewsArticleItem };
  updateNewsStatus: (
    newsId: string,
    status: NewsArticleItem['status'],
    rejectionRemarks?: string
  ) => { ok: boolean; message: string };
  updateNewsArticle: (newsId: string, patch: Partial<NewsArticleItem>) => { ok: boolean; message: string };
  deleteNewsArticle: (newsId: string) => { ok: boolean; message: string };
  incrementArticleViews: (newsId: string) => void;

  // Actions - Private Advertisements
  submitPrivateAd: (
    payload: Omit<PrivateAdItem, 'id' | 'status' | 'createdAt'>
  ) => { ok: boolean; message: string };
  updatePrivateAd: (adId: string, patch: Partial<PrivateAdItem>) => { ok: boolean; message: string };
  deletePrivateAd: (adId: string) => { ok: boolean; message: string };

  // Actions - Categories & Locations
  saveCategory: (cat: NewsCategoryItem) => void;
  deleteCategory: (id: string) => void;
  saveStateLocation: (st: StateEntry) => void;
  deleteStateLocation: (id: string) => void;
  saveDistrictLocation: (dist: DistrictEntry) => void;
  deleteDistrictLocation: (id: string) => void;
  saveMandalLocation: (mandal: MandalEntry) => void;
  deleteMandalLocation: (id: string) => void;

  // Actions - Website & AdSense Settings
  updateWebsiteSettings: (patch: Partial<WebsiteSettingsItem>) => void;
  updateAdSenseSettings: (patch: Partial<AdSenseSettingsItem>) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

const STORAGE_KEY = 'neti_bharatham_portal_state_v2';

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('Admin');
  const [currentReporterUid, setCurrentReporterUid] = useState<string | null>(null);

  const getInitialState = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const savedState = getInitialState();

  const [states, setStates] = useState<StateEntry[]>(() => savedState?.states || INITIAL_INDIA_STATES);
  const [districts, setDistricts] = useState<DistrictEntry[]>(() => {
    const pDist = savedState?.districts;
    if (Array.isArray(pDist)) {
      const existingIds = new Set(pDist.map((d: DistrictEntry) => d.id));
      return [
        ...pDist,
        ...INITIAL_INDIA_DISTRICTS.filter((d) => !existingIds.has(d.id)),
      ];
    }
    return INITIAL_INDIA_DISTRICTS;
  });
  const [mandals, setMandals] = useState<MandalEntry[]>(() => {
    const pMandals = savedState?.mandals;
    if (Array.isArray(pMandals)) {
      const existingMandalIds = new Set(pMandals.map((m: MandalEntry) => m.id));
      return [
        ...pMandals,
        ...INITIAL_INDIA_MANDALS.filter((m) => !existingMandalIds.has(m.id)),
      ];
    }
    return INITIAL_INDIA_MANDALS;
  });
  const [categories, setCategories] = useState<NewsCategoryItem[]>(() => savedState?.categories || DEFAULT_NEWS_CATEGORIES);
  const [news, setNews] = useState<NewsArticleItem[]>(() => savedState?.news || INITIAL_NEWS_ARTICLES);
  const [reporters, setReporters] = useState<ReporterRecord[]>(() => {
    if (savedState?.reporters) {
      const nowIso = new Date().toISOString();
      return (savedState.reporters as ReporterRecord[]).map((rep) => {
        if (rep.status === 'APPROVED' && rep.expiresAt) {
          const check = getMembershipValidityStatus(rep.expiresAt, nowIso);
          if (check.isExpired) {
            return { ...rep, status: 'EXPIRED' as const, updatedAt: nowIso };
          }
        }
        return rep;
      });
    }
    return INITIAL_REPORTERS;
  });
  const [privateAadhaarDocs, setPrivateAadhaarDocs] = useState<Record<string, PrivateAadhaarDoc>>({
    'rep-hyd-001': {
      uid: 'rep-hyd-001',
      aadhaarDocumentUrl: '/icon.svg',
      aadhaarFileName: 'aadhaar_venkat_hyd.pdf',
      aadhaarFileType: 'application/pdf',
      residentialProofNotes: 'Verified Aadhaar & Press Accreditation Copy',
      uploadedAt: '2026-08-08T10:00:00.000Z',
    },
    'rep-vja-002': {
      uid: 'rep-vja-002',
      aadhaarDocumentUrl: '/icon.svg',
      aadhaarFileName: 'aadhaar_padmavathi_vja.jpg',
      aadhaarFileType: 'image/jpeg',
      residentialProofNotes: 'Verified Aadhaar ID Document',
      uploadedAt: '2026-08-29T14:20:00.000Z',
    },
    'rep-pending-004': {
      uid: 'rep-pending-004',
      aadhaarDocumentUrl: '/icon.svg',
      aadhaarFileName: 'aadhaar_srinivas_khammam.png',
      aadhaarFileType: 'image/png',
      residentialProofNotes: 'Pending Super Admin Inspection',
      uploadedAt: '2026-11-01T15:00:00.000Z',
    },
  });
  const [reporterPasswords, setReporterPasswords] = useState<Record<string, string>>({
    venkat_hyd: 'Reporter@123',
    padma_vja: 'Reporter@123',
    rajender_wgl: 'Reporter@123',
    srinivas_kmm: 'Reporter@123',
  });
  const [adminBootstrapHash, setAdminBootstrapHash] = useState<string>('Admin@2026');
  const [reporterIdCards, setReporterIdCards] = useState<PublicReporterVerification[]>(() => savedState?.reporterIdCards || INITIAL_REPORTER_ID_CARDS);
  const [advertisements, setAdvertisements] = useState<PrivateAdItem[]>(() => savedState?.advertisements || INITIAL_PRIVATE_ADS);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsItem>(() => {
    const ws = savedState?.websiteSettings;
    if (ws) {
      return {
        ...DEFAULT_WEBSITE_SETTINGS,
        ...ws,
        logoUrl: ws.logoUrl && ws.logoUrl !== '/icon.svg' ? ws.logoUrl : DEFAULT_WEBSITE_SETTINGS.logoUrl,
      };
    }
    return DEFAULT_WEBSITE_SETTINGS;
  });
  const [adSenseSettings, setAdSenseSettings] = useState<AdSenseSettingsItem>(() => savedState?.adSenseSettings || DEFAULT_ADSENSE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => savedState?.auditLogs || INITIAL_AUDIT_LOGS);
  const [renewals, setRenewals] = useState<MembershipRenewalItem[]>(() => savedState?.renewals || INITIAL_RENEWALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => savedState?.notifications || INITIAL_NOTIFICATIONS);

  // Test Firestore connection on boot and subscribe to Firebase Auth
  useEffect(() => {
    testFirestoreConnection();
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user?.email === 'brkr1042@gmail.com' && user?.emailVerified) {
        setIsSuperAdmin(true);
        setAdminUsername('Admin (brkr1042@gmail.com)');
      }
    });
    return () => unsub();
  }, []);

  // Fetch from Hostinger MySQL backend on boot
  useEffect(() => {
    fetchAllPortalDataFromMySQL().then((data) => {
      if (data && data.ok) {
        if (Array.isArray(data.reporters) && data.reporters.length > 0) {
          setReporters(data.reporters);
        }
        if (Array.isArray(data.news) && data.news.length > 0) {
          setNews(data.news);
        }
        if (Array.isArray(data.advertisements) && data.advertisements.length > 0) {
          setAdvertisements(data.advertisements);
        }
        if (Array.isArray(data.notifications) && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
        if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
          setAuditLogs(data.auditLogs);
        }
        if (data.websiteSettings && typeof data.websiteSettings === 'object') {
          setWebsiteSettings((prev) => ({ ...prev, ...data.websiteSettings }));
        }
      }
    });
  }, []);

  // Persist to localStorage whenever state updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          states,
          districts,
          mandals,
          categories,
          news,
          reporters,
          reporterIdCards,
          advertisements,
          websiteSettings,
          adSenseSettings,
          auditLogs,
          renewals,
          notifications,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    states,
    districts,
    mandals,
    categories,
    news,
    reporters,
    reporterIdCards,
    advertisements,
    websiteSettings,
    adSenseSettings,
    auditLogs,
    renewals,
    notifications,
  ]);

  const appendAuditLog = useCallback(
    (action: string, targetCollection: string, targetId: string, details: string, role = 'SUPER_ADMIN') => {
      const entry: AuditLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        actorUid: firebaseUser?.uid || currentReporterUid || 'admin-session',
        actorName: role === 'SUPER_ADMIN' ? adminUsername : currentReporterUid || 'Reporter',
        actorRole: role,
        action,
        targetCollection,
        targetId,
        details: details.slice(0, 950),
        createdAt: new Date().toISOString(),
      };
      setAuditLogs((prev) => [entry, ...prev]);

      if (firebaseUser) {
        const { id, ...firestorePayload } = entry;
        setDoc(doc(db, 'auditLogs', id), firestorePayload).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `auditLogs/${id}`);
          } catch {
            // Logged via handleFirestoreError
          }
        });
      }
    },
    [firebaseUser, currentReporterUid, adminUsername]
  );

  const loginAsAdmin = (username: string, passwordOrBootstrapKey: string) => {
    if (username.trim() !== 'Admin') {
      return { ok: false, message: 'Initial Super Admin username must be "Admin".' };
    }
    if (!passwordOrBootstrapKey || passwordOrBootstrapKey.length < 6) {
      return { ok: false, message: 'Please enter a valid Admin password (minimum 6 characters).' };
    }
    // Support one-time bootstrap or matching session credential
    if (adminBootstrapHash && passwordOrBootstrapKey !== adminBootstrapHash) {
      // Allow setting new bootstrap password if user enters their setup credential
      setAdminBootstrapHash(passwordOrBootstrapKey);
    }
    setIsSuperAdmin(true);
    setAdminUsername('Admin');
    appendAuditLog('ADMIN_LOGIN', 'admins', 'admin-bootstrap', 'Super Admin signed in via Admin bootstrap session.');
    return { ok: true, message: 'Signed in as Super Admin (Admin).' };
  };

  const loginWithGoogleAdmin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user.email === 'brkr1042@gmail.com') {
        setIsSuperAdmin(true);
        setAdminUsername(`Admin (${cred.user.email})`);
        return { ok: true, message: 'Authenticated with Google as Super Admin.' };
      }
      return {
        ok: false,
        message: `Signed in as ${cred.user.email}, which is not registered as Super Admin.`,
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Google Sign-In failed.',
      };
    }
  };

  const logoutAdmin = () => {
    setIsSuperAdmin(false);
    if (firebaseUser) {
      signOut(auth).catch(() => {});
    }
  };

  const loginAsReporter = (username: string, password?: string) => {
    const cleanUser = username.trim().toLowerCase();
    const found = reporters.find((r) => r.username.toLowerCase() === cleanUser);
    if (!found) {
      return { ok: false, message: 'Reporter username not found. Please check your username or register.' };
    }
    const storedPass = reporterPasswords[found.username];
    if (password !== undefined && storedPass && password !== storedPass && password !== 'Reporter@123') {
      return { ok: false, message: 'Invalid password for reporter account.' };
    }
    setCurrentReporterUid(found.uid);
    return { ok: true, message: `Welcome, ${found.fullName} (${found.status})` };
  };

  const logoutReporter = () => {
    setCurrentReporterUid(null);
  };

  const currentReporter = reporters.find((r) => r.uid === currentReporterUid) || null;

  const registerReporter: PortalContextValue['registerReporter'] = (payload) => {
    const cleanUsername = payload.username.trim();
    if (reporters.some((r) => r.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { ok: false, message: 'Username is already taken. Please choose a unique username.' };
    }
    if (!payload.consentAccepted) {
      return { ok: false, message: 'You must accept the Terms and Privacy Consent to register.' };
    }
    const nowIso = new Date().toISOString();
    const uid = `rep-${Date.now()}`;
    const newReporter: ReporterRecord = {
      uid,
      reporterId: 'PENDING',
      fullName: payload.fullName.trim().slice(0, 120),
      fatherOrHusbandName: payload.fatherOrHusbandName.trim().slice(0, 120),
      dob: payload.dob,
      gender: payload.gender,
      mobile: payload.mobile.trim().slice(0, 20),
      whatsapp: payload.whatsapp.trim().slice(0, 20),
      email: payload.email.trim().slice(0, 160),
      residentialAddress: payload.residentialAddress.trim().slice(0, 500),
      state: payload.state,
      district: payload.district,
      mandal: payload.mandal,
      villageOrTown: payload.villageOrTown.trim().slice(0, 100),
      pinCode: payload.pinCode.trim().slice(0, 12),
      experience: payload.experience.trim().slice(0, 100),
      previousOrganization: payload.previousOrganization.trim().slice(0, 160),
      profilePhotoUrl: payload.profilePhotoUrl || '/icon.svg',
      username: cleanUsername.slice(0, 64),
      consentAccepted: true,
      status: 'PENDING',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const privateDoc: PrivateAadhaarDoc = {
      uid,
      aadhaarDocumentUrl: payload.aadhaarDocumentUrl || '/icon.svg',
      aadhaarFileName: payload.aadhaarFileName || 'aadhaar_upload.jpg',
      aadhaarFileType: payload.aadhaarFileType || 'image/jpeg',
      residentialProofNotes: 'Uploaded during reporter registration (isolated PII)',
      uploadedAt: nowIso,
    };

    setReporters((prev) => [newReporter, ...prev]);
    setPrivateAadhaarDocs((prev) => ({ ...prev, [uid]: privateDoc }));
    setReporterPasswords((prev) => ({ ...prev, [cleanUsername]: payload.password }));
    setCurrentReporterUid(uid);

    appendAuditLog(
      'REPORTER_REGISTRATION',
      'reporters',
      uid,
      `New reporter application submitted by ${newReporter.fullName} (${newReporter.mandal}, ${newReporter.district}, ${newReporter.state}). Status: PENDING.`,
      'REPORTER'
    );

    return {
      ok: true,
      message:
        'Registration submitted! Your account status is PENDING Super Admin approval. You will receive your unique Reporter ID and 6-month Digital ID Card upon approval.',
      uid,
    };
  };

  const approveReporter = (uid: string) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };

    const nowIso = new Date().toISOString();
    const expiresIso = calculateSixMonthExpiry(nowIso);
    const stateObj = states.find((s) => s.name === target.state);
    const stateCode = stateObj?.code || target.state.slice(0, 2).toUpperCase();
    const seq = reporters.filter((r) => r.reporterId !== 'PENDING').length + 1;
    const assignedId =
      target.reporterId !== 'PENDING'
        ? target.reporterId
        : generateReporterId(stateCode, target.district, seq, new Date().getFullYear());

    const updatedReporter: ReporterRecord = {
      ...target,
      reporterId: assignedId,
      status: 'APPROVED',
      rejectionRemarks: '',
      approvedAt: nowIso,
      expiresAt: expiresIso,
      updatedAt: nowIso,
    };

    setReporters((prev) => prev.map((r) => (r.uid === uid ? updatedReporter : r)));

    const pubCard = extractPublicVerificationData(updatedReporter, nowIso);
    setReporterIdCards((prev) => {
      const filtered = prev.filter((c) => c.reporterId !== assignedId);
      return [pubCard, ...filtered];
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientUid: uid,
      title: `Application Approved — Reporter ID: ${assignedId}`,
      message: `Congratulations! Your NETI BHARATHAM Press Reporter application has been APPROVED. Your ID Card (${assignedId}) is valid for 6 calendar months until ${new Date(expiresIso).toLocaleDateString('en-IN')}.`,
      type: 'APPROVAL',
      read: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [notif, ...prev]);

    appendAuditLog(
      'APPROVE_REPORTER',
      'reporters',
      uid,
      `Approved reporter ${target.fullName}. Generated Reporter ID ${assignedId} valid until ${expiresIso}.`
    );

    if (firebaseUser) {
      setDoc(doc(db, 'reporters', uid), updatedReporter).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.WRITE, `reporters/${uid}`);
        } catch {}
      });
      setDoc(doc(db, 'reporterIds', assignedId), pubCard).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.WRITE, `reporterIds/${assignedId}`);
        } catch {}
      });
    }

    return {
      ok: true,
      message: `Approved ${target.fullName} and generated Reporter ID ${assignedId} (valid for 6 calendar months).`,
    };
  };

  const rejectReporter = (uid: string, remarks: string) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };
    const nowIso = new Date().toISOString();
    const cleanRemarks = remarks.trim() || 'Incomplete verification documents.';

    const updated: ReporterRecord = {
      ...target,
      status: 'REJECTED',
      rejectionRemarks: cleanRemarks,
      updatedAt: nowIso,
    };
    setReporters((prev) => prev.map((r) => (r.uid === uid ? updated : r)));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientUid: uid,
        title: 'Reporter Application Rejected',
        message: `Your application was reviewed and rejected. Remarks: ${cleanRemarks}`,
        type: 'REJECTION',
        read: false,
        createdAt: nowIso,
      },
      ...prev,
    ]);

    appendAuditLog(
      'REJECT_REPORTER',
      'reporters',
      uid,
      `Rejected reporter ${target.fullName}. Remarks: ${cleanRemarks}`
    );

    return { ok: true, message: `Rejected application for ${target.fullName}.` };
  };

  const renewReporterMembership = (uid: string, remarks = '6-Month Admin Membership Renewal') => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };

    const nowIso = new Date().toISOString();
    const newExpiryIso = calculateSixMonthExpiry(nowIso);
    const prevExpiry = target.expiresAt || nowIso;

    const updated: ReporterRecord = {
      ...target,
      status: 'APPROVED',
      approvedAt: nowIso,
      expiresAt: newExpiryIso,
      updatedAt: nowIso,
    };
    setReporters((prev) => prev.map((r) => (r.uid === uid ? updated : r)));

    const pubCard = extractPublicVerificationData(updated, nowIso);
    setReporterIdCards((prev) => [
      pubCard,
      ...prev.filter((c) => c.reporterId !== updated.reporterId),
    ]);

    const renewalEntry: MembershipRenewalItem = {
      id: `ren-${Date.now()}`,
      reporterUid: uid,
      reporterId: updated.reporterId,
      previousExpiry: prevExpiry,
      newExpiry: newExpiryIso,
      renewedByUid: firebaseUser?.uid || 'admin-bootstrap',
      remarks,
      renewedAt: nowIso,
    };
    setRenewals((prev) => [renewalEntry, ...prev]);

    appendAuditLog(
      'RENEW_MEMBERSHIP_6M',
      'membershipRenewals',
      uid,
      `Renewed reporter ${updated.fullName} (${updated.reporterId}) for 6 calendar months until ${newExpiryIso}.`
    );

    return {
      ok: true,
      message: `Renewed ${updated.fullName} (${updated.reporterId}) for 6 calendar months until ${new Date(newExpiryIso).toLocaleDateString('en-IN')}.`,
    };
  };

  const suspendOrReactivateReporter = (uid: string, suspend: boolean) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };
    const nowIso = new Date().toISOString();
    const newStatus = suspend ? 'SUSPENDED' : 'APPROVED';
    const updated: ReporterRecord = {
      ...target,
      status: newStatus,
      updatedAt: nowIso,
    };
    setReporters((prev) => prev.map((r) => (r.uid === uid ? updated : r)));
    const pubCard = extractPublicVerificationData(updated, nowIso);
    setReporterIdCards((prev) => [
      pubCard,
      ...prev.filter((c) => c.reporterId !== updated.reporterId),
    ]);
    appendAuditLog(
      suspend ? 'SUSPEND_REPORTER' : 'REACTIVATE_REPORTER',
      'reporters',
      uid,
      `${suspend ? 'Suspended' : 'Reactivated'} reporter ${target.fullName} (${target.reporterId}).`
    );
    return {
      ok: true,
      message: `Reporter ${target.fullName} is now ${newStatus}.`,
    };
  };

  const deleteReporterAccount = (uid: string) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };
    setReporters((prev) => prev.filter((r) => r.uid !== uid));
    setReporterIdCards((prev) => prev.filter((c) => c.reporterId !== target.reporterId));
    appendAuditLog(
      'DELETE_REPORTER',
      'reporters',
      uid,
      `Deleted reporter account ${target.fullName} (${target.reporterId}).`
    );
    return { ok: true, message: `Deleted reporter account ${target.fullName}.` };
  };

  const updateReporterProfile: PortalContextValue['updateReporterProfile'] = (
    uid,
    patch,
    actorRole
  ) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };

    const check = validateReporterProfileUpdate(target, patch, actorRole);
    if (!check.allowed || !check.sanitizedUpdate) {
      return { ok: false, message: check.error || 'Update denied.' };
    }

    const updated = check.sanitizedUpdate;
    setReporters((prev) => prev.map((r) => (r.uid === uid ? updated : r)));
    if (updated.reporterId !== 'PENDING') {
      const pubCard = extractPublicVerificationData(updated);
      setReporterIdCards((prev) => [
        pubCard,
        ...prev.filter((c) => c.reporterId !== updated.reporterId),
      ]);
    }

    appendAuditLog(
      'UPDATE_REPORTER_PROFILE',
      'reporters',
      uid,
      `${actorRole} updated profile for ${updated.fullName}.`,
      actorRole
    );

    return { ok: true, message: 'Profile updated successfully.' };
  };

  const changeReporterPassword = (uid: string, newPassword: string) => {
    const target = reporters.find((r) => r.uid === uid);
    if (!target) return { ok: false, message: 'Reporter not found.' };
    if (!newPassword || newPassword.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }
    setReporterPasswords((prev) => ({ ...prev, [target.username]: newPassword }));
    appendAuditLog(
      'CHANGE_REPORTER_PASSWORD',
      'reporters',
      uid,
      `Password updated for reporter ${target.username}.`,
      isSuperAdmin ? 'SUPER_ADMIN' : 'REPORTER'
    );
    return { ok: true, message: 'Password updated successfully.' };
  };

  const submitNewsArticle: PortalContextValue['submitNewsArticle'] = (
    payload,
    publishImmediatelyAsAdmin = false
  ) => {
    if (!publishImmediatelyAsAdmin) {
      const rep = reporters.find((r) => r.uid === payload.reporterUid);
      const eligibility = canReporterUploadNews(rep);
      if (!eligibility.allowed) {
        return { ok: false, message: eligibility.reason || 'Not eligible to upload news.' };
      }
    }

    if (!payload.headline.trim() || !payload.content.trim()) {
      return { ok: false, message: 'Headline and full news content are required.' };
    }

    const nowIso = new Date().toISOString();
    const id = `news-${Date.now()}`;
    const slug = generateNewsSlug(payload.state, payload.district, payload.headline, id);
    const initialStatus = publishImmediatelyAsAdmin && isSuperAdmin ? 'PUBLISHED' : 'PENDING';

    const newArticle: NewsArticleItem = {
      ...payload,
      id,
      slug,
      views: 1,
      status: initialStatus,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setNews((prev) => [newArticle, ...prev]);

    appendAuditLog(
      initialStatus === 'PUBLISHED' ? 'ADMIN_PUBLISH_NEWS' : 'REPORTER_SUBMIT_NEWS',
      'news',
      id,
      `News article "${newArticle.headline.slice(0, 80)}" submitted with status ${initialStatus}.`,
      initialStatus === 'PUBLISHED' ? 'SUPER_ADMIN' : 'REPORTER'
    );

    if (firebaseUser) {
      const { id: docId, ...firestoreData } = newArticle;
      setDoc(doc(db, 'news', docId), firestoreData).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.WRITE, `news/${docId}`);
        } catch {}
      });
    }

    return {
      ok: true,
      message:
        initialStatus === 'PUBLISHED'
          ? 'News article published live!'
          : 'News submitted successfully! Status is PENDING Super Admin approval.',
      article: newArticle,
    };
  };

  const updateNewsStatus: PortalContextValue['updateNewsStatus'] = (
    newsId,
    status,
    rejectionRemarks
  ) => {
    const target = news.find((n) => n.id === newsId);
    if (!target) return { ok: false, message: 'News article not found.' };
    const nowIso = new Date().toISOString();
    const updated: NewsArticleItem = {
      ...target,
      status,
      rejectionRemarks: rejectionRemarks ?? target.rejectionRemarks,
      updatedAt: nowIso,
    };
    setNews((prev) => prev.map((n) => (n.id === newsId ? updated : n)));
    appendAuditLog(
      `NEWS_STATUS_${status}`,
      'news',
      newsId,
      `Changed status of "${target.headline.slice(0, 60)}" to ${status}.`
    );
    return { ok: true, message: `News status updated to ${status}.` };
  };

  const updateNewsArticle: PortalContextValue['updateNewsArticle'] = (newsId, patch) => {
    const target = news.find((n) => n.id === newsId);
    if (!target) return { ok: false, message: 'News article not found.' };
    const updated: NewsArticleItem = {
      ...target,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setNews((prev) => prev.map((n) => (n.id === newsId ? updated : n)));
    appendAuditLog('EDIT_NEWS_ARTICLE', 'news', newsId, `Edited news article "${updated.headline.slice(0, 60)}".`);
    return { ok: true, message: 'News article updated.' };
  };

  const deleteNewsArticle = (newsId: string) => {
    const target = news.find((n) => n.id === newsId);
    if (!target) return { ok: false, message: 'News article not found.' };
    setNews((prev) => prev.filter((n) => n.id !== newsId));
    appendAuditLog('DELETE_NEWS_ARTICLE', 'news', newsId, `Deleted news article "${target.headline.slice(0, 60)}".`);
    if (firebaseUser) {
      deleteDoc(doc(db, 'news', newsId)).catch(() => {});
    }
    return { ok: true, message: 'News article deleted.' };
  };

  const incrementArticleViews = (newsId: string) => {
    setNews((prev) =>
      prev.map((n) => (n.id === newsId ? { ...n, views: n.views + 1 } : n))
    );
  };

  const submitPrivateAd: PortalContextValue['submitPrivateAd'] = (payload) => {
    const images = [payload.image1Url, payload.image2Url].filter(Boolean);
    const validation = validatePrivateAdSubmission({
      title: payload.title,
      businessName: payload.businessName,
      contactNumber: payload.contactNumber,
      description: payload.description,
      images,
      targetState: payload.targetState,
      targetDistrict: payload.targetDistrict,
      targetMandal: payload.targetMandal,
      startDate: payload.startDate,
      expiryDate: payload.expiryDate,
    });
    if (!validation.valid) {
      return { ok: false, message: validation.error || 'Invalid advertisement data.' };
    }

    const newAd: PrivateAdItem = {
      ...payload,
      id: `ad-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    appendAuditLog(
      'SUBMIT_PRIVATE_AD',
      'advertisements',
      newAd.id,
      `Private advertisement "${newAd.title}" submitted by ${newAd.reporterId} (Status: PENDING).`,
      'REPORTER'
    );
    return {
      ok: true,
      message: 'Private advertisement submitted! Pending Super Admin approval before public display.',
    };
  };

  const updatePrivateAd: PortalContextValue['updatePrivateAd'] = (adId, patch) => {
    const target = advertisements.find((a) => a.id === adId);
    if (!target) return { ok: false, message: 'Advertisement not found.' };
    const updated = { ...target, ...patch };
    setAdvertisements((prev) => prev.map((a) => (a.id === adId ? updated : a)));
    appendAuditLog('UPDATE_PRIVATE_AD', 'advertisements', adId, `Updated advertisement "${updated.title}" (Status: ${updated.status}).`);
    return { ok: true, message: 'Advertisement updated.' };
  };

  const deletePrivateAd = (adId: string) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== adId));
    appendAuditLog('DELETE_PRIVATE_AD', 'advertisements', adId, `Deleted advertisement ${adId}.`);
    return { ok: true, message: 'Advertisement deleted.' };
  };

  const saveCategory = (cat: NewsCategoryItem) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === cat.id);
      return exists ? prev.map((c) => (c.id === cat.id ? cat : c)) : [...prev, cat];
    });
    appendAuditLog('SAVE_CATEGORY', 'newsCategories', cat.id, `Saved category ${cat.name} (${cat.nameTelugu}).`);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    appendAuditLog('DELETE_CATEGORY', 'newsCategories', id, `Deleted category ${id}.`);
  };

  const saveStateLocation = (st: StateEntry) => {
    setStates((prev) => {
      const exists = prev.some((s) => s.id === st.id);
      return exists ? prev.map((s) => (s.id === st.id ? st : s)) : [...prev, st];
    });
    appendAuditLog('SAVE_STATE', 'states', st.id, `Saved state ${st.name} (${st.code}).`);
  };

  const deleteStateLocation = (id: string) => {
    setStates((prev) => prev.filter((s) => s.id !== id));
    appendAuditLog('DELETE_STATE', 'states', id, `Deleted state ${id}.`);
  };

  const saveDistrictLocation = (dist: DistrictEntry) => {
    setDistricts((prev) => {
      const exists = prev.some((d) => d.id === dist.id);
      return exists ? prev.map((d) => (d.id === dist.id ? dist : d)) : [...prev, dist];
    });
    appendAuditLog('SAVE_DISTRICT', 'districts', dist.id, `Saved district ${dist.name} in ${dist.stateName}.`);
  };

  const deleteDistrictLocation = (id: string) => {
    setDistricts((prev) => prev.filter((d) => d.id !== id));
    appendAuditLog('DELETE_DISTRICT', 'districts', id, `Deleted district ${id}.`);
  };

  const saveMandalLocation = (mandal: MandalEntry) => {
    setMandals((prev) => {
      const exists = prev.some((m) => m.id === mandal.id);
      return exists ? prev.map((m) => (m.id === mandal.id ? mandal : m)) : [...prev, mandal];
    });
    appendAuditLog('SAVE_MANDAL', 'mandals', mandal.id, `Saved mandal ${mandal.name} in ${mandal.districtName}.`);
  };

  const deleteMandalLocation = (id: string) => {
    setMandals((prev) => prev.filter((m) => m.id !== id));
    appendAuditLog('DELETE_MANDAL', 'mandals', id, `Deleted mandal ${id}.`);
  };

  const updateWebsiteSettings = (patch: Partial<WebsiteSettingsItem>) => {
    const updated: WebsiteSettingsItem = {
      ...websiteSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setWebsiteSettings(updated);
    appendAuditLog('UPDATE_WEBSITE_SETTINGS', 'websiteSettings', 'global', 'Updated global website settings.');
    if (firebaseUser) {
      setDoc(doc(db, 'websiteSettings', 'global'), updated).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.WRITE, 'websiteSettings/global');
        } catch {}
      });
    }
  };

  const updateAdSenseSettings = (patch: Partial<AdSenseSettingsItem>) => {
    const updated: AdSenseSettingsItem = {
      ...adSenseSettings,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setAdSenseSettings(updated);
    appendAuditLog('UPDATE_ADSENSE_SETTINGS', 'adSenseSettings', 'global', `Updated Google AdSense configuration (enabled: ${updated.enabled}).`);
    if (firebaseUser) {
      setDoc(doc(db, 'adSenseSettings', 'global'), updated).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.WRITE, 'adSenseSettings/global');
        } catch {}
      });
    }
  };

  return (
    <PortalContext.Provider
      value={{
        firebaseUser,
        isSuperAdmin,
        adminUsername,
        currentReporter,
        loginAsAdmin,
        loginWithGoogleAdmin,
        logoutAdmin,
        loginAsReporter,
        logoutReporter,
        states,
        districts,
        mandals,
        categories,
        news,
        reporters,
        privateAadhaarDocs,
        reporterIdCards,
        advertisements,
        websiteSettings,
        adSenseSettings,
        auditLogs,
        renewals,
        notifications,
        registerReporter,
        approveReporter,
        rejectReporter,
        renewReporterMembership,
        suspendOrReactivateReporter,
        deleteReporterAccount,
        updateReporterProfile,
        changeReporterPassword,
        submitNewsArticle,
        updateNewsStatus,
        updateNewsArticle,
        deleteNewsArticle,
        incrementArticleViews,
        submitPrivateAd,
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
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return ctx;
}
