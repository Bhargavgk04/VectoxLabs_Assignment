# Vectox Hospital Healthcare Ecosystem

A single unified React Native mobile application built for the Vectox Labs developer assessment. It integrates all requirements from Questions 1 through 5 into a cohesive clinical ecosystem for patients, physicians, and hospital operations staff.

This repository contains:
- Complete source code with TypeScript strict type-safety
- Unit and integration test suites with 100% passing rate
- Multi-role persona simulation with one-tap credentials
- Comprehensive features and clinical workflows documentation
- AI usage disclosures and development methodology report ([AI_USAGE_AND_METHODOLOGY.md](./AI_USAGE_AND_METHODOLOGY.md))

---

## Quick Start and Setup Instructions

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn
- Expo Go mobile app (iOS or Android) or a web browser / simulator

### Installation
```bash
npm install
```

### Running Locally
```bash
npm start
```
- Press `w` in the terminal to view on web (responsive up to desktop 1200px max-width).
- Scan the displayed QR code with Expo Go on Android or the Camera app on iOS.

### Running TypeScript Validation
```bash
npm run typecheck
```
Executes TypeScript compiler verification with `--noEmit`. Result: 0 errors.

### Running Automated Test Suite
```bash
npm test
```
Executes all 20 Jest unit and integration tests across 4 test suites.

---

## Architecture and Design System

- **Framework**: React Native 0.76.9 with Expo SDK 52 (LTS).
- **Language**: TypeScript configured in strict mode for type safety across navigation parameters, API entities, and component props.
- **Navigation Architecture**: React Navigation v7 with dynamic role-dependent tab trees dynamically bound to the authenticated user's persona via React Context.
- **State Management**: React Context API (`RoleContext` for personas and authentication, `WorkflowContext` for clinical queue mutations with undo history).
- **Design System (`src/theme/`)**:
  - Consistent spacing scale adhering to an 8pt/16pt/24pt grid.
  - Border radius tokens upgraded to 16px (`radius.xl`) and 20px curves for an open, modern aesthetic.
  - Clinical color palette using slate high-contrast text (`#0F172A`), muted secondary text (`#64748B`), and hospital teal/blue primary accents (`#0284C7`).
  - Soft ambient container borders (`#F1F5F9`) preventing visual clutter and information density fatigue.
  - Touch targets calibrated between 38px and 52px for mobile touch ergonomics.
- **Responsive Layout**: Custom `useResponsive` hook providing dynamic column counts, horizontal padding, and max-width boundaries for mobile, tablet, and desktop viewports.

---

## Multi-Role Persona Simulation

The application implements three full user personas via `RoleContext`, allowing the reviewing engineer to evaluate the application from all required perspectives:

- **Patient Persona (Rajesh Patel)**:
  - Access to Swiggy-style Home Campus browsing (Question 4).
  - Doctor Directory discovery, specialty filtering, and appointment booking (Question 2).
  - Personal health dossier displaying UHID, blood group, documented allergies, and cashless health insurance policy status.
- **Physician Persona (Dr. Rajesh Sharma, MD - Chief Cardiologist)**:
  - Access to the 3-tap Prescription Renewal Queue and telemetry triage (Question 3).
  - Outpatient consultation daily schedule and patient clinical records.
  - Medical Council registration, assigned OPD clinic suite, and digital prescribing credentials.
- **Hospital Staff Persona (Priya Nair, RN - Nursing Operations)**:
  - Hospital Staff Management Dashboard with operational metrics (Question 1).
  - Inpatient Bed Census with ward allocation and triage status.
  - Central emergency triage level and master hospital schedule.

*Note: For instant evaluation without typing, one-tap demo login cards are provided on the login screen.*

---

## Question-by-Question Technical Implementation

### Question 1: Hospital Staff Management Dashboard
- **Screen Location**: `src/features/dashboard/screens/DashboardScreen.tsx`
- **Implemented Capabilities**:
  - **Operational Metrics**: Displays 4 responsive summary cards:
    - Inpatient Bed Census (Total beds, occupancy rate, ICU availability).
    - OPD Consultations (Today's scheduled appointments and check-in count).
    - Active Doctors (On-duty specialists across clinical departments).
    - Pending Tasks (STAT orders, discharge approvals, triage assignments).
  - **Quick Action Grid**: One-tap navigation buttons leading to Patients Registry, Doctor Directory, Master Appointments, and Clinical Departments.
  - **Recent Appointments List**: Implemented using an optimized `FlatList` displaying doctor name, patient name, consultation mode, scheduled time, and assigned clinic room.
  - **Emergency Operational Banner**: Real-time status indicator showing hospital code level, trauma readiness, and ambulance bay status.
  - **Inpatient Census Management Screen** (`PatientsScreen.tsx`): Real-time ward filters (ICU, Step-Down, General, Cardiac), bed numbers, patient vitals, and emergency contact details.

### Question 2: Doctor Directory and Appointment Booking
- **Screen Locations**:
  - Directory: `src/features/doctors/screens/DoctorDirectoryScreen.tsx`
  - Profile: `src/features/doctors/screens/DoctorProfileScreen.tsx`
  - Booking: `src/features/doctors/screens/BookingScreen.tsx`
  - Confirmation: `src/features/doctors/screens/BookingConfirmationScreen.tsx`
- **Implemented Capabilities**:
  - **Remote Image Handling**: `RemoteImage` component loads remote physician portraits with automated fallback initials and caching.
  - **Debounced Instant Search**: 200ms debounce allows searching by physician name, clinical specialty, or affiliated department without UI stutter.
  - **Specialty Filter Chips**: Horizontally scrollable filter chips displaying real-time doctor counts per specialty (Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, etc.).
  - **Doctor Profile View**: Displays clinical experience years, patient star ratings, review counts, consultation fees, medical education, and hospital wing affiliations.
  - **Slot Booking Engine**: Calendar date selector with morning, afternoon, and evening consultation slots. Validates availability and prevents double booking.
  - **Booking Confirmation & Navigation Safety**: Generates a unique booking reference ID (`VX-APT-XXXX`). Implements navigation stack resetting so hardware or UI back button presses return the user directly to the home screen or appointments list rather than looping back into the booking slot picker.

### Question 3: Innovative Clinical Workflow (3-Tap Rx Renewal Queue)
- **Screen Locations**:
  - Priority Queue: `src/features/workflow/screens/FollowUpQueueScreen.tsx`
  - Renewal Review: `src/features/workflow/screens/RenewalReviewScreen.tsx`
- **The Clinical Problem Identified**:
  - In standard hospital software, reviewing and renewing routine maintenance prescriptions requires navigating through 8 to 12 disjointed sub-screens. Doctors must search for the patient, open historical notes, find previous scripts, check vitals, re-enter dosage, and re-authorize, resulting in clinician fatigue and delayed patient care.
- **The Proposed Solution (3-Tap Renewal Workflow)**:
  - **Beginning State**: A dedicated Rx Renewal Queue grouped by urgency level (High, Medium, Routine). Displays live patient telemetry, current blood pressure, pulse, primary diagnosis, and refill due dates. Includes an operational progress bar tracking completed vs. remaining daily reviews.
  - **Intermediate Action**:
    - Quick Action / Contextual Menu: Long-pressing any card opens a contextual action sheet allowing instant renewal, 7-day deferral/rescheduling, or skipping.
    - Deep Review: Tapping a card opens the Renewal Review screen showing side-by-side comparative telemetry, documented allergy conflict checks, and pre-filled standard dosage adjustments.
  - **Completion State**: Authorizing the renewal digitally signs the prescription with a simulated cryptographic key, removes the item from the pending queue, updates the progress tracker, and provides a 5-second `Snackbar` with an immediate `UNDO` option.
- **Why this design is superior**:
  - Replaces 10+ clicks with 3 purposeful taps.
  - Brings safety telemetry (allergies and blood pressure) directly into the review card.
  - Includes error recovery via the instant Undo snackbar.

### Question 4: Swiggy-Style Hospital Home Screen
- **Screen Locations**:
  - Main Screen: `src/features/home/screens/HomeScreen.tsx`
  - Section Wrapper: `src/features/home/components/CarouselSection.tsx`
  - Detail View: `src/features/home/screens/DetailViewScreen.tsx`
  - View All: `src/features/home/screens/ViewAllScreen.tsx`
- **Implemented Capabilities**:
  - **Horizontal Carousels**: 4 dedicated horizontal `FlatList` sections with snap alignment and 16px inter-card spacing:
    1. Hospital Departments (Head clinician, active physician count, floor location).
    2. Find a Doctor (Portrait, amber star rating, consultation fee, next available slot).
    3. Diagnostic Services (NABL category pill, turnaround time, price, preparation notes).
    4. Campus Facilities (Trauma bay, ICU, robotic surgery suite, ambulance capacity).
  - **Promotional Hero Banner**: Executive Comprehensive Health Checkup banner with dynamic discount calculation (40% OFF), clinical test count (68+ tests), and direct booking CTA.
  - **Global Live Search**: Instant dropdown below the search bar searching across doctors, departments, and diagnostics simultaneously with category icons and direct navigation.
  - **View All Navigation**: Every carousel has a dedicated "View All" button leading to a complete searchable grid view.
  - **Detail View Screen**: Universal detail view rendering hero imagery, clinical guidelines, parameters table, and action modals (such as patient transfer, test scheduling, or department exploration).

---

## Sample Inputs and Expected Outputs

| Feature | Sample Input | Expected Output |
| :--- | :--- | :--- |
| **Doctor Search** | Search query: `"cardio"` | Filters list to Dr. Rajesh Sharma and Dr. Sneha Reddy with specialty badges |
| **Specialty Filter** | Tap `"Neurology (1)"` chip | Filters list to Dr. Ananya Iyer with affiliated department and OPD room |
| **Slot Booking** | Date: `Tomorrow`, Slot: `10:30 AM` | Navigates to Confirmation Screen with Reference ID `VX-APT-XXXX` |
| **Back Navigation** | Back button on Confirmation Screen | Stack resets to `AppointmentsList` or `HomeScreen` without re-prompting slot picker |
| **Rx Renewal** | Tap `"Approve & Sign Renewal"` | Telemetry marks completed, daily progress updates (e.g. `4/6`), and Undo snackbar appears |
| **Bed Transfer** | Select `"Step-Down Unit 3B"` in Inpatient Modal | Updates patient ward, reflects in Bed Census, and issues EMR audit notification |

---

## Verification and Test Results

Automated unit and integration tests are located in `__tests__/` and run via Jest:

```text
PASS __tests__/features/dashboard/Dashboard.test.tsx
PASS __tests__/features/home/Home.test.tsx
PASS __tests__/features/doctors/Doctors.test.tsx
PASS __tests__/features/workflow/Workflow.test.tsx

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        5.77 s
Ran all test suites.
```

- **TypeScript Compilation**: `npm run typecheck` passes with 0 errors.
- **List Performance**: All `FlatList` instances utilize `windowSize={5}`, `maxToRenderPerBatch={6}`, and `initialNumToRender={6}` for smooth 60 FPS scrolling.

---

## Screenshots Index

All 14 screenshots have been captured, labeled, and saved into the `screenshots/` directory for verification:

1. **`screenshots/01_login_portal_selector.jpg`**: Authentication screen displaying multi-role portal tabs (Patient, Doctor, Staff/Admin), email/password inputs, and one-tap instant demo portal cards.
2. **`screenshots/02_clinical_workflow_rx_renewal_queue.jpg`**: Question 3 Physician Workflow showing the Rx Renewal Queue with urgency tags (High/Medium/Routine), shift progress bar (38% completed), live patient vitals telemetry (BP, HR, SpO2), and allergy warnings.
3. **`screenshots/03_appointments_master_schedule.jpg`**: Master OPD consultation schedule showing status filter chips (All, My Schedule, Scheduled, In-Progress), search bar, and scheduled patient consultation cards.
4. **`screenshots/04_inpatients_live_bed_census.jpg`**: Inpatients Live Bed Census screen with active ward filter chips (Admitted, Outpatient, Discharged), bed room numbers (ICU-03, Ward 4B-12), and documented allergy warning tags.
5. **`screenshots/05_physician_profile_dossier.jpg`**: Physician Persona Profile displaying Medical Registration (MCI-99412-A), assigned OPD Suite 204, e-prescribing credentials, and workflow shortcuts.
6. **`screenshots/06_swiggy_home_screen_carousels.jpg`**: Question 4 Swiggy-Style Hospital Home Screen showing the Executive Comprehensive Health Checkup promotional banner (40% OFF, ₹499 vs ₹850, 68+ tests), search bar, and horizontal department carousels.
7. **`screenshots/07_doctor_directory_screen.jpg`**: Question 2 Doctor Directory screen showing real-time specialty filter chips (All, Cardiology, Neurology, Orthopedics) and doctor cards with remote portraits, ratings, experience pills, and Book Consult buttons.
8. **`screenshots/08_patient_my_consultations_screen.jpg`**: Patient Persona Appointments screen showing registered visits, attending specialists, consultation dates, and room numbers.
9. **`screenshots/09_patient_profile_dossier.jpg`**: Patient Persona Profile screen showing personal health dossier with UHID (VX-90412), Blood Group (O+), documented drug allergies (Penicillin, Sulfa), and Star Health cashless pre-approved insurance.
10. **`screenshots/10_staff_management_dashboard.jpg`**: Question 1 Hospital Staff Management Dashboard showing live operational metrics (Inpatient Count, Appointments, On-Duty Doctors, Pending Tasks), quick-actions grid, and shift status.
11. **`screenshots/11_staff_inpatients_registry.jpg`**: Staff Inpatients Bed Registry with bottom navigation showing operational station assignments and bed allocation controls.
12. **`screenshots/12_staff_master_schedules.jpg`**: Staff Master Schedule view showing hospital-wide consultation appointments and active triage statuses.
13. **`screenshots/13_hospital_departments_directory.jpg`**: Clinical Departments directory showing specialized wings, department codes, head clinicians, on-duty doctors, and floor maps.
14. **`screenshots/14_staff_profile_dossier.jpg`**: Hospital Staff Profile screen showing Staff ID (STF-204), nursing station allocation (Station 3 Inpatient Acute Care Wing), and operational authorizations.

---

## AI Disclosure and Methodology Document

For the complete technical breakdown of how this project was designed and built—including wireframing via Stitch MCP, component scaffolding via Antigravity, iterative UI polish, TestSprite test formulation, time spent, and external assistance disclosures—please review:

**[AI_USAGE_AND_METHODOLOGY.md](./AI_USAGE_AND_METHODOLOGY.md)**

---

## Submission Details

- **Repository**: Shared GitHub repository with complete source code, test cases, and documentation.
- **Contact Email**: Completed in accordance with the assignment instructions for submission to `hr@vectoxlabs.com`.
