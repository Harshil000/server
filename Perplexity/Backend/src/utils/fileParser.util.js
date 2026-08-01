import { createRequire } from "module";
const require = createRequire(import.meta.url);
const rawPdfParse = require("pdf-parse");

/**
 * Utility to parse uploaded file buffers in memory without saving to disk.
 * Supports Images, PDFs, Code, Markdown, Text, CSV, JSON, etc.
 * 
 * @param {Object} file - Express Multer file object ({ originalname, mimetype, buffer })
 * @returns {Object} Parsed file object with type, filename, and payload or text content
 */
export async function parseUploadedFile(file) {
  const { originalname, mimetype, buffer } = file;

  // 1. Images: Convert to Base64 image_url payload for multimodal vision models
  if (mimetype.startsWith("image/")) {
    const base64Data = buffer.toString("base64");
    return {
      type: "image",
      filename: originalname,
      payload: {
        type: "image_url",
        image_url: {
          url: `data:${mimetype};base64,${base64Data}`,
        },
      },
    };
  }

  // 2. PDFs: Extract document text content using pdf-parse with fallback
  if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
    let extractedText = "";
    try {
      const pdfFn = typeof rawPdfParse === "function" ? rawPdfParse : (rawPdfParse?.default || rawPdfParse);
      if (typeof pdfFn === "function") {
        const pdfData = await pdfFn(buffer);
        extractedText = pdfData?.text ? pdfData.text.trim() : "";
      }
    } catch (err) {
      console.error(`pdf-parse failed for "${originalname}", using fallback extraction:`, err);
    }

    // Fallback: If pdf-parse failed or returned empty text, extract printable text from buffer
    if (!extractedText) {
      extractedText = buffer
        .toString("utf-8")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    return {
      type: "text",
      filename: originalname,
      text: `--- BEGIN ATTACHED PDF DOCUMENT: "${originalname}" ---\n${extractedText || "[PDF Content Loaded]"}\n--- END ATTACHED PDF DOCUMENT ---`,
    };
  }

  // 3. Text, Code, Markdown, JSON, CSV: Decode UTF-8 string content
  try {
    const textContent = buffer.toString("utf-8");
    return {
      type: "text",
      filename: originalname,
      text: `--- BEGIN ATTACHED FILE: "${originalname}" ---\n${textContent}\n--- END ATTACHED FILE ---`,
    };
  } catch (err) {
    return {
      type: "text",
      filename: originalname,
      text: `[Attached File: ${originalname}]`,
    };
  }
}
