// src/services/datasetUploadApi.ts
import { FeedbackResponse } from './sheetsApi';
import { EmployeeMapping } from './mappingApi';

export interface UploadedDataset {
  id: string;
  name: string;
  uploadedAt: string;
  rowCount: number;
  source: 'google_sheet' | 'csv' | 'excel';
  sheetUrl?: string;
  data: FeedbackResponse[];
  mappings?: EmployeeMapping[];
}

export const fetchGoogleSheetData = async (sheetId: string): Promise<{
  success: boolean;
  data?: FeedbackResponse[];
  mappings?: EmployeeMapping[];
  error?: string;
}> => {
  try {
    // This would be your actual API endpoint
    const response = await fetch(`/api/google-sheets/${sheetId}/data`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data.responses,
      mappings: data.mappings
    };
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const parseCSVFile = (file: File): Promise<FeedbackResponse[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data: FeedbackResponse[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          const row: FeedbackResponse = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row);
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parseExcelFile = async (file: File): Promise<FeedbackResponse[]> => {
  // You would need to install xlsx library: npm install xlsx
  // Then implement Excel parsing logic
  return [];
};