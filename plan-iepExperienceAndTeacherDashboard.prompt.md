## Plan: IEP experience and teacher dashboard

TL;DR: After authentication, the app should present two distinct paths: Speech Therapy and IEP. The Speech Therapy experience will keep the current parent/child structure and existing ArtiCue flow. The IEP experience will open a new teacher-facing dashboard where a teacher can manage multiple students, view each student’s profile, and access a student-specific workspace that differs depending on whether the student has a speech-based IEP or a non-speech-based IEP.

### 1. Rework the post-auth flow
- After login, add a new selection screen that asks the user to choose between Speech Therapy and IEP.
- Keep the existing Speech Therapy route intact so the current parent/child experience remains unchanged.
- Route IEP into a new dashboard experience rather than into the existing parent dashboard.
- Keep this first version lightweight and focused on the educator workflow, with a clear path to future role-specific expansion.

### 2. Define the IEP data model
- Add a shared student model with fields such as:
  - id
  - name
  - teacherId or assigned teacher
  - IEP type: speech-based or non-speech-based
  - notes/comments
  - documents or reports
  - optional ArtiCue progress reference
- Add a simple comment model for teacher notes and parent/teacher discussion.
- Add a document model for reports and uploaded files, even if the first version stores metadata only.
- Keep the structure flexible so it can later support D2L or Google Classroom-style integrations.

### 3. Build the IEP teacher dashboard
- Create a new teacher dashboard page that shows a student list on the left and a selected student detail view on the right.
- The dashboard should support multiple students for one teacher.
- Each student row should show the student name and basic status, while the detail panel shows the student’s workspace.
- The initial version can use a simple seeded list or locally stored demo data, with future Firestore persistence added later.

### 4. Build student-specific IEP workspaces
- For speech-based IEP students:
  - show teacher comments
  - show documents such as quarterly reports
  - show a lightweight ArtiCue progress summary based on existing session data
- For non-speech-based IEP students:
  - show notes and documents only
  - keep the experience simpler and avoid forcing speech analytics where they are not relevant
- The branching should be clear in the UI so the teacher can immediately understand which content is available.

### 5. Add the bare-bones comments and document workflow
- Add a comment composer for teachers and, if needed later, parents.
- Add a simple document area where teachers can add document titles and upload placeholders or metadata entries.
- Show a simple chronological feed for comments and documents so the teacher can review the student’s record quickly.
- Keep the first version focused on capturing and displaying information rather than building a full document management system.

### 6. Reuse existing ArtiCue progress data where it makes sense
- Reuse the current session and profile context to generate a lightweight student summary.
- Include simple indicators such as recent activity, average accuracy, streak, and target sounds when the student has speech-based support data.
- Keep the summary clear and readable, not overly analytical.

### 7. Prepare for future LMS integration
- Structure the document and comment system so it can later connect to D2L, Google Classroom, or similar platforms.
- Introduce a simple source or integration field in the data model so future imports can be mapped cleanly.
- Do not build the real integration yet; just leave the architecture ready for it.

### Relevant files
- [src/app/role/page.tsx](src/app/role/page.tsx) — change the post-auth experience selection from parent/child to Speech Therapy vs IEP.
- [src/app/onboarding/page.tsx](src/app/onboarding/page.tsx) — align onboarding with the new flow if needed.
- [src/app/Parent/page.tsx](src/app/Parent/page.tsx) — keep the current Speech Therapy parent experience intact.
- [src/context/DashboardContext.tsx](src/context/DashboardContext.tsx) — reuse profile and session data for the new IEP summary panel.
- [src/types/index.ts](src/types/index.ts) — add new types for students, IEP records, comments, and documents.

### Verification
1. Confirm the app now offers a clear choice between Speech Therapy and IEP after authentication.
2. Confirm the IEP route opens a teacher dashboard with a student list and student detail view.
3. Confirm speech-based student records show comments, documents, and ArtiCue data, while non-speech-based records show comments and documents only.
4. Run the app and verify the existing Speech Therapy flow still works unchanged.

### Scope decisions
- The first version is a bare-bones educator dashboard, not a full IEP case-management platform.
- The new IEP experience is separate from the existing child/parent therapy flow.
- D2L and Google Classroom integration is intentionally deferred and only prepared for structurally.
