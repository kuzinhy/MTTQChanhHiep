# Development Roadmap: MTTQ Chánh Hiệp Application Overhaul

This roadmap outlines the systematic overhaul of the application, focusing on security, data consistency, and professional administrative workflows.

## Phase 1: Security & Data Consistency (High Priority)
- [ ] **RBAC Enforcement**: Update Firestore rules to restrict public access to sensitive data (opinions, volunteer data, submissions).
- [ ] **Data Integrity**: Enforce schema validation for Firestore collections using `types.ts`.
- [ ] **Sync Logic**: Refactor Firestore listeners to ensure single-source-of-truth updates, preventing race conditions.
- [ ] **Server-Side Security**: Strengthen API route verification (`server.ts`) for all administrative actions.

## Phase 2: Structural & Component Cleanup
- [ ] **App Redesign**: Implement separate layouts for 'Portal' (Public) and 'Office' (Admin) zones.
- [ ] **Component Modularization**: Refactor `/src/components` to follow the requested business-logic structure (articles, documents, feedback, etc.).
- [ ] **Shared Component Library**: Standardize Table, Search, Filter, Modal, and Notification components.

## Phase 3: Admin Dashboard Overhaul
- [ ] **Sidebar Redesign**: Implement the 7-group administrative menu.
- [ ] **Dashboard Optimization**: Create an action-oriented "Today's Work" dashboard instead of decorative charts.
- [ ] **Admin List Views**: Implement standardized list-view layouts with filtering and pagination.

## Phase 4: UI/UX Refinement
- [ ] **Portal Layout**: Simplify homepage to meet density and readability guidelines (two-column news layout, condensed header).
- [ ] **Typography & Styling**: Apply spacing and typographic refinements (16px base, 1280px-1440px width, remove excessive decoration/gradients).

## Phase 5: Workflow Enhancements
- [ ] **State Machine Implementations**: Formalize lifecycles for Articles, Feedback, and Documents.
- [ ] **Feedback Loop**: Improve success/error notification specificity.

## Phase 6: Testing & Deployment
- [ ] **QA**: Role-based testing (Citizen, Staff, Admin).
- [ ] **Final Security Audit**: Audit Firestore rules and proxy/API routes.
