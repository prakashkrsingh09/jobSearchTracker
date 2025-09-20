import googleSheetsService from './googleSheetsService';
import { JobApplication } from '../types';

export interface JobApplicationForm {
  company: string;
  position: string;
  appliedDate: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offered' | 'Withdrawn';
  location: string;
  salary?: string;
  notes?: string;
  source: string;
}

class JobApplicationService {
  private readonly SHEET_NAME = 'Sheet2';
  
  /**
   * Get all job applications
   */
  async getAllApplications(): Promise<JobApplication[]> {
    try {
      const sheetData = await googleSheetsService.getSheetData(this.SHEET_NAME);
      
      // Convert sheet data to JobApplication objects
      const applications: JobApplication[] = [];
      
      // Skip header row (index 0) if it exists
      const dataRows = sheetData.values.slice(1);
      
      dataRows.forEach((row, index) => {
        if (row.length >= 8) { // Ensure we have enough columns
          applications.push({
            id: `job_${index + 1}`,
            company: row[0] || '',
            position: row[1] || '',
            appliedDate: row[2] || '',
            status: (row[3] as any) || 'Applied',
            location: row[4] || '',
            salary: row[5] || '',
            notes: row[6] || '',
            source: row[7] || '',
          });
        }
      });
      
      console.log(`📋 Loaded ${applications.length} job applications`);
      return applications;
    } catch (error) {
      console.error('❌ Error loading job applications:', error);
      throw new Error('Failed to load job applications');
    }
  }

  /**
   * Add a new job application
   */
  async addApplication(application: JobApplicationForm): Promise<boolean> {
    try {
      console.log('➕ Adding new job application:', application);
      
      // Convert application to row format
      const newRow = [
        application.company,
        application.position,
        application.appliedDate,
        application.status,
        application.location,
        application.salary || '',
        application.notes || '',
        application.source,
      ];

      // Add to Google Sheets
      const success = await googleSheetsService.appendRow(this.SHEET_NAME, newRow);
      
      if (success) {
        console.log('✅ Job application added successfully');
        return true;
      } else {
        throw new Error('Failed to add application to sheet');
      }
    } catch (error) {
      console.error('❌ Error adding job application:', error);
      throw new Error('Failed to add job application');
    }
  }

  /**
   * Update an existing job application
   */
  async updateApplication(id: string, updates: Partial<JobApplicationForm>): Promise<boolean> {
    try {
      console.log(`🔄 Updating job application ${id}:`, updates);
      
      // Get current data to find the row
      const sheetData = await googleSheetsService.getSheetData(this.SHEET_NAME);
      const rowIndex = this.findRowIndexById(id, sheetData.values);
      
      if (rowIndex === -1) {
        throw new Error('Application not found');
      }

      // Update the specific row
      const success = await googleSheetsService.updateRow(
        this.SHEET_NAME, 
        rowIndex + 1, // +1 because sheets are 1-indexed
        updates
      );

      if (success) {
        console.log('✅ Job application updated successfully');
        return true;
      } else {
        throw new Error('Failed to update application in sheet');
      }
    } catch (error) {
      console.error('❌ Error updating job application:', error);
      throw new Error('Failed to update job application');
    }
  }

  /**
   * Delete a job application
   */
  async deleteApplication(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting job application ${id}`);
      
      // Get current data to find the row
      const sheetData = await googleSheetsService.getSheetData(this.SHEET_NAME);
      const rowIndex = this.findRowIndexById(id, sheetData.values);
      
      if (rowIndex === -1) {
        throw new Error('Application not found');
      }

      // Delete the row
      const success = await googleSheetsService.deleteRow(
        this.SHEET_NAME, 
        rowIndex + 1 // +1 because sheets are 1-indexed
      );

      if (success) {
        console.log('✅ Job application deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete application from sheet');
      }
    } catch (error) {
      console.error('❌ Error deleting job application:', error);
      throw new Error('Failed to delete job application');
    }
  }

  /**
   * Get application statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    recentApplications: number;
  }> {
    try {
      const applications = await this.getAllApplications();
      
      const stats = {
        total: applications.length,
        byStatus: {} as Record<string, number>,
        recentApplications: 0,
      };

      // Count by status
      applications.forEach(app => {
        stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
        
        // Count recent applications (last 30 days)
        const appliedDate = new Date(app.appliedDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (appliedDate >= thirtyDaysAgo) {
          stats.recentApplications++;
        }
      });

      console.log('📊 Application statistics:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
      throw new Error('Failed to get application statistics');
    }
  }

  /**
   * Helper method to find row index by application ID
   */
  private findRowIndexById(id: string, rows: string[][]): number {
    // Extract the number from the ID (e.g., "job_1" -> 1)
    const idNumber = parseInt(id.replace('job_', ''));
    return idNumber - 1; // Convert to 0-based index
  }
}

export default new JobApplicationService();
