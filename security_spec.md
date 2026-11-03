# NETI BHARATHAM – Zero-Trust Firestore Security Specification

## 1. Data Invariants & Relationship Mapping

1. **Super Admin Authority (`admins/{adminId}`)**:
   - Super Admin status is verified strictly via `request.auth.token.email == 'brkr1042@gmail.com' && request.auth.token.email_verified == true` or document existence at `/databases/$(database)/documents/admins/$(request.auth.uid)`.
   - Never trust client-supplied custom claims or self-assigned role strings.
2. **PII Split-Collection Isolation (`reporters` vs `reporterPrivateDocuments` vs `reporterIds`)**:
   - `reporterPrivateDocuments/{docId}` stores Aadhaar photographs/PDFs and is strictly unreadable by the public or other reporters. Only the document owner (`request.auth.uid == docId`) or `isAdmin()` can read it.
   - `reporters/{reporterId}` stores the reporter's application and profile. Only the owner (`request.auth.uid == reporterId`) or `isAdmin()` can read it.
   - `reporterIds/{cardId}` stores ONLY approved public press identity fields (Name, Reporter ID, State, District, Mandal, Masked Mobile, Issue/Expiry Dates, Status) for public QR verification.
3. **Strict Reporter Profile Edit Lock**:
   - Approved or pending reporters may ONLY update `residentialAddress` and `updatedAt` on their own `reporters/{reporterId}` document via `incoming().diff(existing()).affectedKeys().hasOnly(['residentialAddress', 'updatedAt'])`.
   - Reporters cannot modify `fullName`, `dob`, `mobile`, `email`, `state`, `district`, `mandal`, `profilePhotoUrl`, `reporterId`, or `status`.
4. **News Upload & Publishing Gate (`news/{newsId}`)**:
   - Only `isAdmin()` or an active approved reporter (`get(/databases/$(database)/documents/reporters/$(request.auth.uid)).data.status == 'APPROVED'`) can create a news article, and reporter-submitted news must start with `status == 'PENDING'`.
   - Public readers can only read news where `resource.data.status == 'PUBLISHED'`.
5. **Private Advertisements Gate (`advertisements/{adId}`)**:
   - Reporters can submit private advertisements (up to 2 image slots `image1Url` and `image2Url`) with `status == 'PENDING'`.
   - Public visitors can only read advertisements where `resource.data.status == 'APPROVED'`.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Shadow Field Injection on Reporter Registration**: Adding `"isSuperAdmin": true` to `/reporters/{uid}` -> Rejected by `hasOnly()`.
2. **Self-Approval Escalation**: Reporter creating `/reporters/{uid}` with `"status": "APPROVED"` -> Rejected because reporter creation requires `incoming().status == 'PENDING'`.
3. **Restricted Profile Edit by Reporter**: Reporter updating `fullName` or `mobile` or `state` on `/reporters/{uid}` -> Rejected by `affectedKeys().hasOnly(['residentialAddress', 'updatedAt'])`.
4. **Public Scraping of Aadhaar Document**: Unauthenticated or non-owner user reading `/reporterPrivateDocuments/{targetUid}` -> Rejected by `request.auth.uid == docId || isAdmin()`.
5. **Unapproved Reporter Uploading News**: User with `status == 'PENDING'` or `status == 'EXPIRED'` creating `/news/{newsId}` -> Rejected by `isApprovedReporter()`.
6. **Reporter Direct-Publishing News**: Approved reporter creating `/news/{newsId}` with `status: 'PUBLISHED'` -> Rejected because reporter create requires `incoming().status == 'PENDING'`.
7. **Unauthorized News Deletion by Reporter**: Reporter attempting to delete published `/news/{newsId}` -> Rejected because `allow delete` requires `isAdmin()`.
8. **ID Poisoning Attack**: Document ID containing spaces, slashes, or >128 chars -> Rejected by `isValidId()`.
9. **Denial-of-Wallet Oversized String**: Submitting a 2MB string into `headline` -> Rejected by `data.headline.size() <= 300`.
10. **Email Spoofing Attack**: User with `email == 'brkr1042@gmail.com'` but `email_verified == false` attempting Admin action -> Rejected by `request.auth.token.email_verified == true`.
11. **Auto-Publishing Private Advertisement**: Reporter creating `/advertisements/{adId}` with `status: 'APPROVED'` -> Rejected because reporter ad creation requires `incoming().status == 'PENDING'`.
12. **Tampering with Website or AdSense Settings**: Non-admin attempting to update `/websiteSettings/global` or `/adSenseSettings/global` -> Rejected by `isAdmin()`.
