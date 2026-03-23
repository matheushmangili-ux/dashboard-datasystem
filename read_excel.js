const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const filePath = 'C:/Users/Matheus/Desktop/Metas_Marco_2026_DashManus.xlsx';

try {
  console.log("Reading file:", filePath);
  const workbook = xlsx.readFile(filePath);
  
  workbook.SheetNames.forEach(sheetName => {
    console.log('\n================================');
    console.log('--- SHEET: ' + sheetName + ' ---');
    console.log('================================');
    const ws = workbook.Sheets[sheetName];
    // Read with headers as array of arrays to see exact structure
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    // Print first 20 rows to understand the layout
    const sample = data.slice(0, 20);
    sample.forEach((row, i) => {
        console.log(`[Row ${i+1}] ${JSON.stringify(row)}`);
    });
  });
} catch (e) {
  console.error("Error reading excel file:");
  console.error(e);
}
