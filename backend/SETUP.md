# Society Issue Tracker — Setup & Deployment

## Files Created
- `Code.gs` — Backend (Google Apps Script)
- `Index.html` — Frontend (served by Apps Script)

## Deployment Steps

### Step 1: Open Apps Script Editor
Go to: https://script.google.com/u/0/home/projects/1EXrm7HLOQ1ggu3GxhmxFFTayKrRPQFTf9P1UHPjfnxs0RLTqMY3PcdHd/edit

### Step 2: Replace Code.gs
- Click on `Code.gs` in the left panel
- Select all (Cmd+A), delete, paste contents of `Code.gs`

### Step 3: Create Index.html
- Click `+` next to Files → HTML → name it `Index` (not Index.html)
- Select all, delete default content, paste contents of `Index.html`

### Step 4: Set Gemini API Key
- In Script Editor: Project Settings (gear icon) → Script Properties
- Add property: `GEMINI_API_KEY` = `AIzaSyAk-BtGoUP541H_x4Slt6MFsVCmEliu1Hs`

### Step 5: Initialize Sheets
- In Script Editor, select `initializeSheets` from the function dropdown
- Click Run
- Authorize when prompted (Google will ask for permissions)
- This creates "Raw Submissions" and "Issue Register" tabs

### Step 6: Test Gemini Connection
- Select `testGemini` from function dropdown → Run
- Check Execution Log — should say "Gemini connected successfully"

### Step 7: Deploy as Web App
- Click Deploy → New deployment
- Type: Web app
- Execute as: Me (anupritabhousingsociety@gmail.com)
- Who has access: Anyone
- Click Deploy → Copy the URL

### Step 8: Share URL
Share the web app URL on the society WhatsApp group.

## Sheet Structure (auto-created)

### Tab: "Issue Register"
| Issue # | Issue (AI Summary) | Category | Priority | Reported By (Flats) | Count | Status | Last Updated | AI Notes |

Committee members can update the **Status** column directly:
- `नवीन` — New issue
- `प्रगतीत` — In progress
- `निराकरण` — Resolved

### Tab: "Raw Submissions"
Audit trail of all form submissions — never shown to members.

## Notes
- Gemini API: Free tier (15 RPM, 1M tokens/day) — sufficient for society use
- Photos stored in Google Drive folder "Society Issue Photos"
- No cron jobs needed — everything is event-driven
- To regenerate meeting agenda: run `generateMeetingAgenda()` from Script Editor
