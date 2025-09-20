import apiClient from './api';
import { getConfig } from '../config/constants';

const config = getConfig();

export interface SheetData {
  values: string[][];
  range: string;
  majorDimension: string;
}

export interface SheetResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

class GoogleSheetsService {
  /**
   * Fetch data from a specific sheet
   * @param sheetName - Name of the sheet (e.g., 'Sheet1', 'Sheet2')
   * @returns Promise<SheetData>
   */

  async getSheetData(sheetName: string): Promise<SheetData> {
    try {
      console.log("🔗 Making API request to Google Sheets...");
      console.log("📋 Sheet Name:", sheetName);
      console.log("🔑 Sheet ID:", config.GOOGLE_SHEETS_ID);
      
      const response = await apiClient.get(
        `/${config.GOOGLE_SHEETS_ID}/values/${sheetName}?key=${config.GOOGLE_SHEETS_API_KEY}`
      );
      
      console.log("📥 Raw API Response:", response.data);
      
      const result = {
        values: response.data.values || [],
        range: response.data.range || '',
        majorDimension: response.data.majorDimension || 'ROWS',
      };
      
      console.log("📊 Processed Data:", result);
      return result;
    } catch (error:any) {
      console.error('❌ Error fetching sheet data:', error);
      console.error('🔍 Error details:', error.response?.data || error.message);
      throw new Error(`Failed to fetch data from sheet: ${sheetName}`);
    }
  }

  /**
   * Fetch data from multiple sheets
   * @param sheetNames - Array of sheet names
   * @returns Promise<Record<string, SheetData>>
   */
  async getMultipleSheets(sheetNames: string[]): Promise<Record<string, SheetData>> {
    try {
      const promises = sheetNames.map(sheetName => 
        this.getSheetData(sheetName).catch(error => {
          console.error(`Error fetching sheet ${sheetName}:`, error);
          return { values: [], range: '', majorDimension: 'ROWS' };
        })
      );

      const results = await Promise.all(promises);
      
      return sheetNames.reduce((acc, sheetName, index) => {
        acc[sheetName] = results[index];
        return acc;
      }, {} as Record<string, SheetData>);
    } catch (error) {
      console.error('Error fetching multiple sheets:', error);
      throw new Error('Failed to fetch data from multiple sheets');
    }
  }

  /**
   * Get sheet metadata
   * @returns Promise<any>
   */
  async getSheetMetadata(): Promise<any> {
    try {
      const response = await apiClient.get(
        `/${config.GOOGLE_SHEETS_ID}?key=${config.GOOGLE_SHEETS_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sheet metadata:', error);
      throw new Error('Failed to fetch sheet metadata');
    }
  }

  /**
   * Append a new row to a sheet
   * @param sheetName - Name of the sheet
   * @param values - Array of values to append
   * @returns Promise<boolean>
   */
  async appendRow(sheetName: string, values: string[]): Promise<boolean> {
    try {
      console.log(`📝 Appending row to ${sheetName}:`, values);
      
      const response = await apiClient.post(
        `/${config.GOOGLE_SHEETS_ID}/values/${sheetName}:append?key=${config.GOOGLE_SHEETS_API_KEY}`,
        {
          values: [values],
        },
        {
          params: {
            valueInputOption: 'USER_ENTERED',
          },
        }
      );
      
      console.log('✅ Row appended successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error appending row:', error);
      throw new Error(`Failed to append row to sheet: ${sheetName}`);
    }
  }

  /**
   * Update a specific row in a sheet
   * @param sheetName - Name of the sheet
   * @param rowIndex - Row number (1-based)
   * @param values - Array of values to update
   * @returns Promise<boolean>
   */
  async updateRow(sheetName: string, rowIndex: number, values: string[]): Promise<boolean> {
    try {
      console.log(`🔄 Updating row ${rowIndex} in ${sheetName}:`, values);
      
      const range = `${sheetName}!A${rowIndex}:H${rowIndex}`; // Assuming 8 columns
      
      const response = await apiClient.put(
        `/${config.GOOGLE_SHEETS_ID}/values/${range}?key=${config.GOOGLE_SHEETS_API_KEY}`,
        {
          values: [values],
        },
        {
          params: {
            valueInputOption: 'USER_ENTERED',
          },
        }
      );
      
      console.log('✅ Row updated successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error updating row:', error);
      throw new Error(`Failed to update row in sheet: ${sheetName}`);
    }
  }

  /**
   * Delete a specific row from a sheet
   * @param sheetName - Name of the sheet
   * @param rowIndex - Row number (1-based)
   * @returns Promise<boolean>
   */
  async deleteRow(sheetName: string, rowIndex: number): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting row ${rowIndex} from ${sheetName}`);
      
      // Note: Google Sheets API doesn't have a direct delete row method
      // We need to use the batch update method
      const response = await apiClient.post(
        `/${config.GOOGLE_SHEETS_ID}:batchUpdate?key=${config.GOOGLE_SHEETS_API_KEY}`,
        {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0, // Assuming first sheet
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1, // Convert to 0-based
                  endIndex: rowIndex,
                },
              },
            },
          ],
        }
      );
      
      console.log('✅ Row deleted successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error deleting row:', error);
      throw new Error(`Failed to delete row from sheet: ${sheetName}`);
    }
  }
}

export default new GoogleSheetsService();
