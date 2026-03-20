/**
 * Client-side PDF export using the browser print API.
 * Creates a clean, branded print view of resource content.
 */

export function exportResourceAsPdf(
  title: string,
  sectionTitle: string,
  contentHtml: string,
  sectionColor: string = "#1D4ED8"
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to download PDFs.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} — NDG Neuroinclusion Resource Hub</title>
  <style>
    @page {
      margin: 2cm 2.5cm;
      size: A4;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Header band */
    .pdf-header {
      border-bottom: 3px solid ${sectionColor};
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .pdf-header .brand {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 4px;
    }
    .pdf-header .section-label {
      font-size: 9pt;
      color: ${sectionColor};
      font-weight: 600;
      margin-bottom: 8px;
    }
    .pdf-header h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    /* Content */
    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 20pt;
      margin-bottom: 8pt;
      padding-bottom: 4pt;
      border-bottom: 1px solid #e2e8f0;
    }
    h3 {
      font-size: 12pt;
      font-weight: 600;
      color: #1e293b;
      margin-top: 16pt;
      margin-bottom: 6pt;
    }
    p {
      margin-bottom: 8pt;
      text-align: left;
    }
    ul, ol {
      margin: 8pt 0;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 4pt;
    }
    strong { font-weight: 600; }
    em { font-style: italic; }

    /* Callout boxes */
    .callout {
      border: 1px solid #e2e8f0;
      border-left: 4px solid ${sectionColor};
      border-radius: 4px;
      padding: 12pt 14pt;
      margin: 12pt 0;
      background: #f8fafc;
      page-break-inside: avoid;
    }
    .callout-title {
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${sectionColor};
      margin-bottom: 6pt;
    }

    /* Footer */
    .pdf-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
      padding: 8pt 0;
      border-top: 1px solid #e2e8f0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6pt 8pt;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <div class="brand">Neurodiversity Global</div>
    <div class="section-label">${escapeHtml(sectionTitle)}</div>
    <h1>${escapeHtml(title)}</h1>
  </div>
  <div class="pdf-content">
    ${markdownToSimpleHtml(contentHtml, title)}
  </div>
  <div class="pdf-footer">
    © Neurodiversity Global — Neuroinclusion Resource Hub
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); window.close(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert raw markdown content into simple HTML for the PDF.
 * Strips the first H1 (title is in the header already).
 */
function markdownToSimpleHtml(content: string, title: string): string {
  const blocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);
  let html = "";
  let skippedH1 = false;

  for (const block of blocks) {
    // Skip first H1
    if (block.startsWith("# ") && !block.startsWith("## ") && !skippedH1) {
      skippedH1 = true;
      continue;
    }

    if (block.startsWith("### ")) {
      html += `<h3>${inline(block.slice(4))}</h3>\n`;
      continue;
    }

    if (block.startsWith("## ")) {
      const heading = block.slice(3);
      const lower = heading.toLowerCase();
      // Make certain headings callout boxes
      if (
        lower.includes("learning objective") ||
        lower.includes("key takeaway") ||
        lower.includes("quick reference") ||
        lower.includes("reflection")
      ) {
        html += `<div class="callout"><div class="callout-title">${inline(heading)}</div></div>\n`;
        continue;
      }
      html += `<h2>${inline(heading)}</h2>\n`;
      continue;
    }

    const lines = block.split("\n");

    // Unordered list
    if (lines.every((l) => l.trim().startsWith("- ") || l.trim() === "")) {
      html += "<ul>\n";
      for (const l of lines) {
        if (l.trim().startsWith("- ")) {
          html += `  <li>${inline(l.trim().slice(2))}</li>\n`;
        }
      }
      html += "</ul>\n";
      continue;
    }

    // Ordered list
    if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "")) {
      html += "<ol>\n";
      for (const l of lines) {
        if (/^\d+\.\s/.test(l.trim())) {
          html += `  <li>${inline(l.trim().replace(/^\d+\.\s/, ""))}</li>\n`;
        }
      }
      html += "</ol>\n";
      continue;
    }

    // Table
    if (block.includes("|") && block.includes("---")) {
      const rows = lines.filter((l) => l.trim() && !l.trim().match(/^\|[-|\s]+\|$/));
      if (rows.length > 0) {
        html += "<table>\n";
        rows.forEach((row, idx) => {
          const cells = row
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean);
          const tag = idx === 0 ? "th" : "td";
          html += "  <tr>\n";
          for (const cell of cells) {
            html += `    <${tag}>${inline(cell)}</${tag}>\n`;
          }
          html += "  </tr>\n";
        });
        html += "</table>\n";
        continue;
      }
    }

    // Paragraph
    html += `<p>${inline(block.replace(/\n/g, " "))}</p>\n`;
  }

  return html;
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
