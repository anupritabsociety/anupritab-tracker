// ============================================================
// Society Issue Tracker — Google Apps Script Backend
// Anuprita B Cooperative Housing Society
// ============================================================

const SPREADSHEET_ID = '1MCOmw9vENL5-KSQNxPd659SwTHRcEGjw5jzTo4qzUHs';
const RAW_SHEET_NAME = 'Raw Submissions';
const REGISTER_SHEET_NAME = 'Issue Register';
const PHOTO_FOLDER_NAME = 'Society Issue Photos';

// ============================================================
// Web App Entry Point
// ============================================================

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  if (action === 'getIssues') {
    try {
      var issues = getIssueRegister();
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, issues: issues }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === 'verifyPin') {
    var pin = e.parameter.pin;
    var stored = PropertiesService.getScriptProperties().getProperty('MC_PIN');
    return ContentService
      .createTextOutput(JSON.stringify({ valid: pin === stored }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // No action param → redirect old links to GitHub Pages
  return HtmlService.createHtmlOutput(
    '<html><head><meta http-equiv="refresh" content="0;url=https://anupritabsociety.github.io/anupritab-tracker/"></head>' +
    '<body><p>Redirecting... <a href="https://anupritabsociety.github.io/anupritab-tracker/">Click here</a></p></body></html>'
  );
}

function doPost(e) {
  try {
    var formData = JSON.parse(e.postData.contents);

    if (formData.action === 'updateStatus') {
      var result = updateIssueStatus(formData.issueNo, formData.newStatus, formData.statusKey);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var result = submitComplaint(formData);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// Sheet Helpers
// ============================================================

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet(name, headers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#1A237E')
        .setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function getRawSheet() {
  return getOrCreateSheet(RAW_SHEET_NAME, [
    'Timestamp', 'Flat', 'Name', 'Phone', 'Description (Raw)', 'Photo Links', 'AI Processing Status'
  ]);
}

function getRegisterSheet() {
  return getOrCreateSheet(REGISTER_SHEET_NAME, [
    'Issue #', 'Issue (AI Summary)', 'Category', 'Priority', 'Reported By (Flats)',
    'Count', 'Status', 'Last Updated', 'AI Notes'
  ]);
}

// ============================================================
// Get Issue Register (called from frontend)
// ============================================================

function getIssueRegister() {
  const sheet = getRegisterSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return []; // Only headers

  const issues = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue; // Skip empty rows
    issues.push({
      issueNo: row[0],
      issue: row[1],
      category: row[2],
      priority: row[3],
      reportedBy: row[4],
      count: row[5],
      status: row[6],
      lastUpdated: row[7] ? Utilities.formatDate(new Date(row[7]), 'Asia/Kolkata', 'dd-MM-yyyy') : '',
      aiNotes: row[8]
    });
  }
  return issues;
}

// ============================================================
// Submit Complaint (called from frontend)
// ============================================================

function submitComplaint(formData) {
  try {
    const rawSheet = getRawSheet();
    const registerSheet = getRegisterSheet();

    // Upload photos if any
    let photoLinks = '';
    if (formData.photos && formData.photos.length > 0) {
      photoLinks = uploadPhotos(formData.photos, formData.flat);
    }

    // Save raw submission
    const timestamp = new Date();
    rawSheet.appendRow([
      timestamp,
      formData.flat,
      formData.name,
      formData.phone,
      formData.description,
      photoLinks,
      'Processing...'
    ]);
    const rawRow = rawSheet.getLastRow();

    // AI Processing
    const results = processWithAI(formData.description, formData.flat, registerSheet);

    // Update raw sheet status
    rawSheet.getRange(rawRow, 7).setValue('Processed — ' + results.length + ' issue(s) extracted');

    return {
      success: true,
      results: results
    };

  } catch (error) {
    Logger.log('submitComplaint error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============================================================
// Photo Upload
// ============================================================

function uploadPhotos(photos, flat) {
  try {
    const folder = getOrCreateFolder();
    const links = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const blob = Utilities.newBlob(
        Utilities.base64Decode(photo.data),
        photo.mimeType,
        'Flat_' + flat + '_' + new Date().getTime() + '_' + (i + 1) + '.' + photo.extension
      );
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      links.push(file.getUrl());
    }

    return links.join(', ');
  } catch (e) {
    Logger.log('Photo upload error: ' + e.toString());
    return 'Upload failed: ' + e.toString();
  }
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

// ============================================================
// Update Issue Status (called from Kanban drag)
// ============================================================

function updateIssueStatus(issueNo, newStatus, statusKey) {
  try {
    const sheet = getRegisterSheet();
    const data = sheet.getDataRange().getValues();
    var keyToStatus = { 'new': 'नवीन', 'progress': 'प्रगतीत', 'resolved': 'निराकरण' };
    var validStatuses = ['नवीन', 'प्रगतीत', 'निराकरण'];

    // Prefer English statusKey (new clients), fall back to Marathi newStatus (old clients)
    var resolvedStatus = null;
    if (statusKey && keyToStatus[statusKey]) {
      resolvedStatus = keyToStatus[statusKey];
    } else if (newStatus && validStatuses.indexOf(newStatus) !== -1) {
      resolvedStatus = newStatus;
    }
    if (!resolvedStatus) {
      return { success: false, error: 'Invalid status: ' + (statusKey || newStatus) };
    }
    newStatus = resolvedStatus;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == issueNo) {
        sheet.getRange(i + 1, 7).setValue(newStatus);
        sheet.getRange(i + 1, 8).setValue(new Date());
        return { success: true, issueNo: issueNo, newStatus: newStatus };
      }
    }
    return { success: false, error: 'Issue #' + issueNo + ' not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// ============================================================
// AI Processing Pipeline
// ============================================================

function processWithAI(description, flat, registerSheet) {
  // Step 1: Extract individual issues from description
  const extractedIssues = extractIssues(description);

  if (!extractedIssues || extractedIssues.length === 0) {
    // Fallback: treat entire description as one issue
    return [processOneIssue(description, 'सोसायटी', flat, registerSheet)];
  }

  // Step 1.5: Validate extracted issues for quality
  const validIssues = validateExtractedIssues(extractedIssues, description);

  // Step 2-3: For each validated issue, match and update register
  const results = [];
  for (const extracted of validIssues) {
    const result = processOneIssue(extracted.issue, extracted.category, flat, registerSheet);
    results.push(result);
  }

  return results;
}

// ============================================================
// Validate Extracted Issues (filter out vague AI outputs)
// ============================================================

function validateExtractedIssues(extractedIssues, originalDescription) {
  var validIssues = [];
  var vagueWords = ['दुरुस्ती', 'समस्या', 'काम', 'विनंती', 'सूचना', 'तक्रार'];

  for (var i = 0; i < extractedIssues.length; i++) {
    var item = extractedIssues[i];
    var words = item.issue.trim().split(/\s+/);
    if (words.length < 3) continue;
    if (item.quality === 'low') continue;
    var firstWord = words[0];
    if (vagueWords.indexOf(firstWord) !== -1 && words.length < 4) continue;
    validIssues.push(item);
  }

  if (validIssues.length === 0) {
    return [{ issue: originalDescription.substring(0, 100), category: 'सोसायटी', quality: 'fallback' }];
  }
  return validIssues;
}

function processOneIssue(issueSummary, category, flat, registerSheet) {
  // Get current register data for matching
  const registerData = registerSheet.getDataRange().getValues();
  const existingIssues = [];

  for (let i = 1; i < registerData.length; i++) {
    if (registerData[i][0]) {
      existingIssues.push({
        row: i + 1,
        issueNo: registerData[i][0],
        issue: registerData[i][1],
        category: registerData[i][2],
        reportedBy: registerData[i][4] ? registerData[i][4].toString() : '',
        count: registerData[i][5] || 0,
        status: registerData[i][6]
      });
    }
  }

  // Step 2: Match against existing issues
  let matchResult = { matches: false };
  if (existingIssues.length > 0) {
    matchResult = matchToRegister(issueSummary, existingIssues);
  }

  const now = new Date();

  if (matchResult.matches && matchResult.matchesIssue) {
    // Merge into existing issue
    const existing = existingIssues.find(e => e.issueNo == matchResult.matchesIssue);
    if (existing) {
      const flats = existing.reportedBy.split(',').map(f => f.trim()).filter(f => f);
      const flatStr = flat.toString();

      if (!flats.includes(flatStr)) {
        flats.push(flatStr);
        const newCount = flats.length;
        const newReportedBy = flats.join(', ');

        registerSheet.getRange(existing.row, 5).setValue(newReportedBy); // Reported By
        registerSheet.getRange(existing.row, 6).setValue(newCount);       // Count
        registerSheet.getRange(existing.row, 8).setValue(now);            // Last Updated

        // Update AI Notes
        const currentNotes = registerSheet.getRange(existing.row, 9).getValue();
        registerSheet.getRange(existing.row, 9).setValue(
          (currentNotes ? currentNotes + '; ' : '') + 'Flat ' + flat + ' merged (' + matchResult.confidence + ')'
        );
      }

      return {
        action: 'merged',
        issueNo: existing.issueNo,
        issue: existing.issue,
        previousCount: existing.count,
        newCount: parseInt(existing.count) + (flats.includes(flatStr) ? 0 : 1)
      };
    }
  }

  // Create new issue
  const nextIssueNo = existingIssues.length > 0
    ? Math.max(...existingIssues.map(e => parseInt(e.issueNo) || 0)) + 1
    : 1;

  const priority = assignPriority(issueSummary);

  registerSheet.appendRow([
    nextIssueNo,
    issueSummary,
    category || 'सोसायटी',
    priority.priority || '🟡 Medium',
    flat.toString(),
    1,
    'नवीन',
    now,
    'Auto-created. ' + (priority.reason || '')
  ]);

  return {
    action: 'created',
    issueNo: nextIssueNo,
    issue: issueSummary,
    priority: priority.priority
  };
}

// ============================================================
// Gemini AI Functions
// ============================================================

function getGeminiApiKey() {
  return PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
}

function callGemini(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in Script Properties.');
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 2048
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText('UTF-8'));

  if (json.error) {
    Logger.log('Gemini API error: ' + JSON.stringify(json.error));
    throw new Error('Gemini API error: ' + json.error.message);
  }

  const text = json.candidates[0].content.parts[0].text;
  return text;
}

function parseJsonFromGemini(text) {
  // Extract JSON from markdown code blocks if present
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    Logger.log('JSON parse error. Raw text: ' + text);
    return null;
  }
}

// --- 1. Extract Issues ---

function extractIssues(description) {
  const prompt = `You are an AI assistant for an Indian housing society (Anuprita B, Pune).
Read this member's complaint/suggestion and extract individual issues.
The text may be in Marathi, English, Hindi, or mixed. One description may contain multiple separate issues.

Important rules:
- Each distinct problem should be a separate issue
- Translate/summarize each issue into clear Marathi
- Categorize as "बिल्डर" (builder responsibility: structural, lift, plumbing infrastructure, waterproofing, tiles, electrical mains) or "सोसायटी" (society responsibility: security, cleaning, parking management, garden, staff, daily maintenance)
- Keep summaries concise (under 15 words in Marathi)

STRICT QUALITY RULES:
- Each issue MUST be a specific, actionable problem (minimum 3 Marathi words)
- NEVER return vague words like "दुरुस्ती", "समस्या", "काम" as the entire issue
- Each issue must describe WHAT the problem is and WHERE it occurs
- BAD examples: "दुरुस्ती करणे", "समस्या आहे" — too vague, rejected
- GOOD examples: "लिफ्टमध्ये वारंवार बंद पडणे", "पार्किंगमध्ये अनधिकृत गाड्या उभ्या" — specific problem with location
- If the input is too vague to extract a meaningful issue, set quality to "low"

Description: "${description}"

Return ONLY a JSON array, no other text:
[{"issue": "specific issue in Marathi (min 3 words)", "category": "बिल्डर or सोसायटी", "quality": "high or low"}]`;

  try {
    const response = callGemini(prompt);
    const parsed = parseJsonFromGemini(response);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch (e) {
    Logger.log('extractIssues error: ' + e.toString());
    return null;
  }
}

// --- 2. Match to Register ---

function matchToRegister(newIssue, existingIssues) {
  const issueList = existingIssues.map(e => '#' + e.issueNo + ': ' + e.issue).join('\n  ');

  const prompt = `You are matching housing society complaints. Does this new issue match any existing registered issue?
Consider: Marathi/English/Hindi synonyms, same physical problem described differently, same root cause.

New issue: "${newIssue}"

Existing registered issues:
  ${issueList}

Return ONLY JSON, no other text:
If match found: {"matches": true, "matchesIssue": <issue number>, "confidence": "High/Medium/Low", "reason": "brief reason"}
If no match: {"matches": false}

Only match if confidence is High or Medium. If unsure, return no match.`;

  try {
    const response = callGemini(prompt);
    const parsed = parseJsonFromGemini(response);
    if (parsed && typeof parsed.matches !== 'undefined') return parsed;
    return { matches: false };
  } catch (e) {
    Logger.log('matchToRegister error: ' + e.toString());
    return { matches: false };
  }
}

// --- 3. Assign Priority ---

function assignPriority(issue) {
  const prompt = `Assign priority to this housing society issue:
Issue: "${issue}"

Rules:
- "🔴 High": Safety hazards, water damage/leakage, electrical issues, structural problems, lift malfunction, fire safety
- "🟡 Medium": Maintenance, cleanliness, staff issues, parking disputes, garden/landscaping, plumbing (minor)
- "🟢 Low": Cosmetic issues, suggestions, minor inconvenience, painting, signage

Return ONLY JSON, no other text:
{"priority": "🔴 High or 🟡 Medium or 🟢 Low", "reason": "brief reason in English"}`;

  try {
    const response = callGemini(prompt);
    const parsed = parseJsonFromGemini(response);
    if (parsed && parsed.priority) return parsed;
    return { priority: '🟡 Medium', reason: 'Default priority' };
  } catch (e) {
    Logger.log('assignPriority error: ' + e.toString());
    return { priority: '🟡 Medium', reason: 'AI unavailable, default assigned' };
  }
}

// ============================================================
// MC Meeting Agenda Generator
// ============================================================

function generateMeetingAgenda() {
  const issues = getIssueRegister();
  const openIssues = issues.filter(i => i.status !== 'निराकरण');

  if (openIssues.length === 0) {
    return 'सर्व तक्रारींचे निराकरण झाले आहे. कोणतेही प्रलंबित मुद्दे नाहीत.';
  }

  const issuesSummary = openIssues.map(i =>
    '#' + i.issueNo + ' [' + i.priority + '] ' + i.issue + ' (Flats: ' + i.reportedBy + ', Count: ' + i.count + ', Status: ' + i.status + ')'
  ).join('\n');

  const prompt = `Generate a formal Marathi meeting agenda for the Management Committee of Anuprita B Cooperative Housing Society.

Open issues to discuss:
${issuesSummary}

Format as a formal meeting agenda in Marathi with:
1. Group issues by priority (🔴 High first, then 🟡 Medium, then 🟢 Low)
2. For each issue, mention: issue description, number of complaints, affected flats
3. Use formal Marathi language suitable for official meeting minutes
4. Include section headers and numbering
5. End with "विशेष सूचना" (special notes) section for any other business`;

  try {
    return callGemini(prompt);
  } catch (e) {
    return 'AI agenda generation failed: ' + e.toString();
  }
}

// ============================================================
// Utility: Initialize sheets if needed
// ============================================================

function initializeSheets() {
  getRawSheet();
  getRegisterSheet();
  Logger.log('Sheets initialized successfully.');
}

// ============================================================
// Utility: Test Gemini connection
// ============================================================

function testGemini() {
  try {
    const result = callGemini('Reply with exactly: "Gemini connected successfully"');
    Logger.log('Gemini test result: ' + result);
    return result;
  } catch (e) {
    Logger.log('Gemini test failed: ' + e.toString());
    return 'Failed: ' + e.toString();
  }
}

// ============================================================
// One-Time Migration: Form Responses 1 → Issue Register
// ============================================================

function migrateExistingData() {
  const ss = getSpreadsheet();
  const formSheet = ss.getSheetByName('Form Responses 1');
  if (!formSheet) {
    Logger.log('ERROR: "Form Responses 1" sheet not found.');
    return;
  }

  const registerSheet = getRegisterSheet();
  const data = formSheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('No data rows found in Form Responses 1.');
    return;
  }

  // Form columns: Timestamp | Email | Flat Number | Name | Phone | Issue Type | Description
  const FLAT_COL = 2;
  const NAME_COL = 3;
  const PHONE_COL = 4;
  const DESC_COL = 6;

  let processed = 0;
  let skipped = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const flat = row[FLAT_COL] ? row[FLAT_COL].toString().trim() : '';
    const description = row[DESC_COL] ? row[DESC_COL].toString().trim() : '';

    if (!flat || !description) {
      Logger.log('Row ' + (i + 1) + ': skipped (missing flat or description)');
      skipped++;
      continue;
    }

    Logger.log('Row ' + (i + 1) + '/' + (data.length - 1) + ': Processing flat ' + flat + '...');

    try {
      processWithAI(description, flat, registerSheet);
      processed++;
    } catch (e) {
      Logger.log('Row ' + (i + 1) + ' ERROR: ' + e.toString());
      skipped++;
    }

    // Rate limit: Gemini free tier ~15 RPM → 4.5s between rows
    if (i < data.length - 1) {
      Utilities.sleep(4500);
    }
  }

  Logger.log('Migration complete. Processed: ' + processed + ', Skipped: ' + skipped);
}
