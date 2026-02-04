# Anuprita B Society Tracker - Test Cases (200)

## A. Complaint Submission (40 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Submit with all fields filled correctly | Success toast, form resets |
| 2 | Submit without selecting flat number | Validation error shown |
| 3 | Submit without entering complaint text | Validation error shown |
| 4 | Submit with very long complaint text (500+ chars) | Accepted and processed |
| 5 | Submit with special characters (!@#$%^&*) | Accepted, escaped properly |
| 6 | Submit with only Marathi text | AI processes correctly |
| 7 | Submit with mixed English + Marathi text | AI processes correctly |
| 8 | Submit with emojis in complaint text | Accepted |
| 9 | Submit with HTML tags in complaint (XSS test) | Tags escaped, no XSS |
| 10 | Submit with JavaScript in complaint (XSS test) | Script escaped, no XSS |
| 11 | Submit from flat 101 | Entry shows flat 101 |
| 12 | Submit from flat 501 (middle floor) | Entry shows flat 501 |
| 13 | Submit from flat 903 (last flat) | Entry shows flat 903 |
| 14 | Submit duplicate complaint from same flat | Count incremented (merged) |
| 15 | Submit same complaint from different flat | Count incremented, flat added |
| 16 | Submit with 1 photo attached | Photo uploaded, link in sheet |
| 17 | Submit with 3 photos attached | All 3 uploaded |
| 18 | Submit with large photo (>5MB) | Handled (upload or error) |
| 19 | Submit with invalid file type (.exe) | Rejected by accept="image/*" |
| 20 | Submit and verify success toast appears | Success card visible |
| 21 | Submit and verify form resets after success | All fields cleared |
| 22 | Submit and verify entry in Issue Register sheet | Row added |
| 23 | Submit and verify entry in Raw Submissions sheet | Row added |
| 24 | Submit and verify AI summary is generated | Summary in Marathi |
| 25 | Submit and verify category assigned by AI | Builder or Society |
| 26 | Submit and verify priority assigned by AI | High/Medium/Low |
| 27 | Submit while offline | Error message shown |
| 28 | Submit with slow network (throttled) | Handles gracefully |
| 29 | Submit rapidly 3 times in a row | All processed |
| 30 | Submit and verify timestamp is correct IST | Correct timezone |
| 31 | Submit complaint about water supply | Categorized correctly |
| 32 | Submit complaint about elevator | Categorized as builder |
| 33 | Submit complaint about parking | Categorized as society |
| 34 | Submit complaint about security | Categorized as society |
| 35 | Submit complaint about cleanliness | Categorized as society |
| 36 | Submit complaint about noise | Categorized correctly |
| 37 | Submit complaint about construction defect | Categorized as builder |
| 38 | Submit complaint about billing | Categorized correctly |
| 39 | Submit and check if similar issue gets merged | Count incremented |
| 40 | Submit and verify photo uploaded to Google Drive | File exists in Drive |

## B. Issue Register / Table View (30 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 41 | Load tracker page | Issues table loads |
| 42 | Verify all issues show correct issue number | Numbers match sheet |
| 43 | Verify all issues show AI summary text | Text matches sheet |
| 44 | Verify category badge (builder=orange, society=blue) | Correct colors |
| 45 | Verify status badge (new=yellow, progress=blue, resolved=green) | Correct colors |
| 46 | Verify complaint count displays correctly | Matches sheet |
| 47 | Filter by "all" | Shows all issues |
| 48 | Filter by "builder" | Only builder issues |
| 49 | Filter by "society" | Only society issues |
| 50 | Filter by "progress" | Only in-progress issues |
| 51 | Filter by "resolved" | Only resolved issues |
| 52 | Verify filter count badges are correct | Counts match data |
| 53 | Verify stats cards show correct counts | All 4 stats correct |
| 54 | Verify stats cards animate on load | Count-up animation |
| 55 | Switch table to kanban and back | **Table shows updated data (Bug 2 regression)** |
| 56 | Load with no issues in sheet | Empty state shown |
| 57 | Load with 50+ issues | Performance OK |
| 58 | Verify table is scrollable on mobile | Horizontal scroll works |
| 59 | Verify table columns readable on mobile | Text legible |
| 60 | Verify issue text truncation for long issues | Truncated properly |
| 61 | Refresh page | Table reloads with latest data |
| 62 | Load with network error | Retry button shown |
| 63 | Click retry button | Reload attempted |
| 64 | **Verify table renders Marathi text correctly (no garbled chars)** | **Bug 3 regression test** |
| 65 | **Verify status shows Marathi text after page refresh** | **Bug 3 regression test** |
| 66 | Verify issue numbers are sequential | No gaps (or acceptable gaps) |
| 67 | Verify date format is dd-MM-yyyy | Correct format |
| 68 | Check AI Notes column not shown to regular users | Column hidden |
| 69 | Verify table header labels in Marathi | All headers Marathi |
| 70 | Verify empty filter results show message | Empty state shown |

## C. Kanban Board (35 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 71 | Switch to Kanban view | Board renders |
| 72 | Verify two swim lanes: builder and society | Both present |
| 73 | Verify three columns per lane | New, Progress, Resolved |
| 74 | Verify column counts are correct | Match data |
| 75 | Verify each card shows issue number | # visible |
| 76 | Verify each card shows complaint count | Count badge |
| 77 | Verify each card shows AI summary | Title text |
| 78 | Verify each card shows flat number chips | Flat chips |
| 79 | Verify cards with 3+ flats show "+N" chip | Extra count shown |
| 80 | Without MC login: cards NOT draggable | No drag cursor |
| 81 | With MC login: cards draggable | Grab cursor |
| 82 | **Drag card new to progress** | **Card moves (Bug 4 regression)** |
| 83 | Drag card progress to resolved | Card moves |
| 84 | Drag card resolved to new | Card moves |
| 85 | Drag card between categories | Prevented |
| 86 | Drag card to same column | No-op |
| 87 | After drag, card appears in target column | Immediate update |
| 88 | After drag, refresh page | Card in new column |
| 89 | **After drag, switch to table view** | **Status updated (Bug 2 regression)** |
| 90 | After drag, verify status in Google Sheet | Correct Marathi text |
| 91 | Drag card on mobile (touch) | Works with visual clone |
| 92 | Touch drag shows ghost card | Ghost follows finger |
| 93 | Touch drag highlights target column | Blue highlight |
| 94 | Cancel touch drag (release outside) | Card returns |
| 95 | Drag multiple cards rapidly | All update correctly |
| 96 | Verify column count updates after drag | Counts change |
| 97 | Verify stats cards update after drag | Stats refresh |
| 98 | Verify filter counts update after drag | Filters refresh |
| 99 | Drag with slow network | Optimistic update + rollback |
| 100 | Drag with network error | Card reverts |
| 101 | Verify drag on iPhone Safari | Works |
| 102 | Verify drag on Android Chrome | Works |
| 103 | Verify drag on desktop Chrome | Works |
| 104 | Verify drag on desktop Firefox | Works |
| 105 | Verify kanban column alignment on small screens | Columns scroll |

## D. MC Login / Authentication (25 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 106 | Click MC login button | PIN modal opens |
| 107 | Enter correct PIN (2024) | Authenticated |
| 108 | Enter wrong PIN | Error "wrong PIN" |
| 109 | Enter less than 4 digits | Error "enter 4 digits" |
| 110 | Enter letters instead of digits | Error shown |
| 111 | Press Enter in PIN field | Form submits |
| 112 | Close PIN modal | Login cancelled |
| 113 | After successful login | Button changes to "MC mode" |
| 114 | After login, Kanban cards draggable | Drag cursor appears |
| 115 | Click MC mode button | Logs out |
| 116 | After logout, button reverts | Shows "MC login" |
| 117 | After logout, cards NOT draggable | No drag cursor |
| 118 | **Refresh page after login** | **Stays logged in (Bug 1 regression)** |
| 119 | Close tab and reopen | NOT logged in (sessionStorage) |
| 120 | Open in new tab | NOT logged in (sessionStorage) |
| 121 | Login on mobile | Works |
| 122 | PIN field auto-focuses when modal opens | Input focused |
| 123 | Multiple failed PIN attempts | Retries allowed |
| 124 | Login with network offline | Connection error shown |
| 125 | Login with slow network | Handles gracefully |
| 126 | Verify PIN sent via HTTPS | Secure transport |
| 127 | Verify PIN not in URL bar after login | Not visible |
| 128 | Try SQL injection in PIN field | No break |
| 129 | Try XSS in PIN field | No break |
| 130 | Rapid repeated login/logout | Works correctly |

## E. Navigation / Page Switching (15 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 131 | Load app | Defaults to complaint form |
| 132 | Click "complaint form" nav | Shows form |
| 133 | Click "tracker" nav | Shows tracker (table) |
| 134 | Bottom nav highlights active page | Correct highlight |
| 135 | Switch between pages rapidly | Works smoothly |
| 136 | Tracker page loads issues on first visit | Data fetched |
| 137 | Return to tracker page | No reload if cached |
| 138 | Verify page transitions smooth | Animation plays |
| 139 | Bottom nav fixed at bottom on mobile | Stays fixed |
| 140 | Bottom nav icons are correct | Pen and chart icons |
| 141 | Page title/header updates on switch | Correct header |
| 142 | Deep link with URL hash | Correct page loads |
| 143 | Browser back button behavior | Hash navigates |
| 144 | No flash of unstyled content | Smooth load |
| 145 | Loading spinner while fetching data | Skeleton shows |

## F. Responsive Design / Mobile (20 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 146 | iPhone SE (375px) | Loads correctly |
| 147 | iPhone 14 (390px) | Loads correctly |
| 148 | Samsung Galaxy (360px) | Loads correctly |
| 149 | iPad (768px) | Loads correctly |
| 150 | Desktop (1440px) | Loads correctly |
| 151 | Complaint form usable on mobile | All fields accessible |
| 152 | Flat number dropdown on mobile | Native picker works |
| 153 | Text area resizable on mobile | Can resize |
| 154 | Photo upload on mobile (camera) | Camera option available |
| 155 | Table view scrolls horizontally on mobile | Scroll works |
| 156 | Kanban board scrolls horizontally on mobile | Scroll works |
| 157 | Stats cards wrap on mobile | 2x2 grid below 380px |
| 158 | Filter pills wrap on mobile | Horizontal scroll |
| 159 | PIN modal centered on mobile | Properly centered |
| 160 | PIN modal keyboard doesn't obscure input | Input visible |
| 161 | Bottom nav doesn't overlap content | Proper padding |
| 162 | Touch targets large enough (44px+) | Accessible |
| 163 | Text readable without zooming | Font size OK |
| 164 | No horizontal scroll on main page | No overflow |
| 165 | Orientation change works | Layout adjusts |

## G. Data Integrity (15 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 166 | Status in sheet matches displayed status | Exact match |
| 167 | Issue count in sheet matches displayed count | Exact match |
| 168 | Category in sheet matches displayed category | Exact match |
| 169 | Flat numbers in sheet match submission | Correct flats |
| 170 | Timestamp in sheet is correct | IST timezone |
| 171 | AI summary in sheet matches displayed text | Exact match |
| 172 | Photo links in sheet are valid | Links accessible |
| 173 | Multiple submissions from same flat increment count | Count correct |
| 174 | Status update from Kanban reflects in sheet | Immediate |
| 175 | Concurrent status updates don't conflict | No data loss |
| 176 | Sheet formulas not broken by data | Formulas intact |
| 177 | Raw Submissions tab has audit trail | All entries present |
| 178 | Issue numbering consistent and sequential | Correct sequence |
| 179 | No duplicate issue numbers | All unique |
| 180 | Data survives Google Sheets daily limits | Graceful handling |

## H. Performance (10 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 181 | Page load time < 3 seconds on 4G | Within limit |
| 182 | Issues load time < 5 seconds for 50 issues | Within limit |
| 183 | Kanban render time < 1 second | Within limit |
| 184 | Table render time < 1 second | Within limit |
| 185 | Status update response time < 3 seconds | Within limit |
| 186 | Photo upload time < 10 seconds for 2MB | Within limit |
| 187 | No memory leaks after repeated tab switching | Stable memory |
| 188 | No layout shifts during load | CLS = 0 |
| 189 | Smooth scrolling on all views | No jank |
| 190 | Animations don't cause frame drops | 60fps |

## I. Edge Cases & Error Handling (10 cases)

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 191 | Google Apps Script quota exceeded | Graceful error |
| 192 | Google Sheet is full (10M cells) | Graceful error |
| 193 | Gemini API rate limit hit | Complaint still saves |
| 194 | Very long AI summary | Truncation handles |
| 195 | Invalid JSON response from backend | Error handling |
| 196 | CORS error scenarios | Should not occur |
| 197 | Session timeout on Apps Script | Recovery |
| 198 | Concurrent submissions from multiple users | All succeed |
| 199 | Browser with JavaScript disabled | Graceful degradation |
| 200 | Ad blocker blocking fetch requests | Error handling |

---

## Bug Regression Tests (Key)

| Bug | Test #s | What to verify |
|-----|---------|----------------|
| Bug 1: MC Login not persistent | 118, 119, 120 | Login survives refresh, not new tab |
| Bug 2: Table not refreshing after Kanban drag | 55, 89 | Table shows updated status |
| Bug 3: Random characters in status | 64, 65 | Marathi status renders correctly |
| Bug 4: Card disappears after Kanban drag | 82, 88 | Card appears in target column |

## Test Data Cleanup

To delete test entries while keeping real ones:
1. Open Google Sheet directly
2. In "Issue Register" tab: identify test entries by flat numbers or complaint text
3. Delete test rows manually (right-click > Delete row)
4. In "Raw Submissions" tab: delete corresponding test entries
5. Do NOT delete the header row
6. Gaps in issue numbering are acceptable
