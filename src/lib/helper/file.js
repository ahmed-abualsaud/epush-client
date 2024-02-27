import PizZip from "pizzip"
import * as XLSX from "xlsx"
import { DOMParser } from "@xmldom/xmldom"

export const str2xml = (str) => {
    if (str.charCodeAt(0) === 65279) {
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
}
  
export const getWordFileParagraphs = (content) => {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
  
    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
}

export const parseExcelFile = (content) => {
    let workbook = XLSX.read(content, {type: "binary"})
    return [...new Set(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]).split("\n").map(row => row.trim()).filter(n => n && n))]
}

export const parseWordFile = (content) => {
    return [...new Set(getWordFileParagraphs(content).map(row => row.trim()).filter(n => n && n))]
}

export const parseTextFile = (content) => {
    return [...new Set(content.split("\n").map(row => row.trim()).filter(n => n && n))]
}

export function getFileNameFromResponseHeaders(headers) {
    const disposition = headers['content-disposition']
    const match = disposition.match(/filename="(.+)"/i)
    if (match && match[1]) {
		return match[1]
    }
    return 'export.pdf'
}
