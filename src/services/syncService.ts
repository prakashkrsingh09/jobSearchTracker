import googleSheetsService from './googleSheetsService';
import { SheetData } from './googleSheetsService';

export interface SyncOptions {
  sheetName: string;
  pollInterval?: number; // in milliseconds
  enablePolling?: boolean;
}

export interface SyncCallbacks {
  onDataChange?: (data: SheetData) => void;
  onSyncError?: (error: Error) => void;
  onConflictDetected?: (localData: SheetData, remoteData: SheetData) => void;
}

class SyncService {
  private pollInterval: NodeJS.Timeout | null = null;
  private lastSyncTimestamp: number = 0;
  private isPolling: boolean = false;
  private callbacks: SyncCallbacks = {};

  /**
   * Start bidirectional synchronization
   */
  async startSync(options: SyncOptions, callbacks: SyncCallbacks = {}): Promise<void> {
    this.callbacks = callbacks;
    
    console.log('🔄 Starting bidirectional sync...');
    
    // Initial sync
    await this.performSync(options.sheetName);
    
    // Start polling if enabled
    if (options.enablePolling !== false && options.pollInterval) {
      this.startPolling(options.sheetName, options.pollInterval);
    }
  }

  /**
   * Stop synchronization
   */
  stopSync(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    console.log('⏹️ Sync stopped');
  }

  /**
   * Perform manual sync
   */
  async performSync(sheetName: string): Promise<SheetData> {
    try {
      console.log('🔄 Performing sync...');
      const data = await googleSheetsService.getSheetData(sheetName);
      this.lastSyncTimestamp = Date.now();
      
      if (this.callbacks.onDataChange) {
        this.callbacks.onDataChange(data);
      }
      
      console.log('✅ Sync completed');
      return data;
    } catch (error) {
      console.error('❌ Sync error:', error);
      if (this.callbacks.onSyncError) {
        this.callbacks.onSyncError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Update a cell in the sheet
   */
  async updateCell(sheetName: string, rowIndex: number, columnIndex: number, value: string): Promise<void> {
    try {
      console.log(`📝 Updating cell [${rowIndex}, ${columnIndex}] to: ${value}`);
      
      // Get current data
      const currentData = await googleSheetsService.getSheetData(sheetName);
      
      // Update the specific cell
      if (currentData.values[rowIndex] && currentData.values[rowIndex][columnIndex] !== undefined) {
        currentData.values[rowIndex][columnIndex] = value;
        
        // Update the row in Google Sheets
        await googleSheetsService.updateRow(sheetName, rowIndex + 1, currentData.values[rowIndex]);
        
        console.log('✅ Cell updated successfully');
      } else {
        throw new Error('Cell not found');
      }
    } catch (error) {
      console.error('❌ Error updating cell:', error);
      throw error;
    }
  }

  /**
   * Add a new row to the sheet
   */
  async addRow(sheetName: string, values: string[]): Promise<void> {
    try {
      console.log('➕ Adding new row:', values);
      await googleSheetsService.appendRow(sheetName, values);
      console.log('✅ Row added successfully');
    } catch (error) {
      console.error('❌ Error adding row:', error);
      throw error;
    }
  }

  /**
   * Delete a row from the sheet
   */
  async deleteRow(sheetName: string, rowIndex: number): Promise<void> {
    try {
      console.log(`🗑️ Deleting row ${rowIndex}`);
      await googleSheetsService.deleteRow(sheetName, rowIndex + 1); // +1 because sheets are 1-indexed
      console.log('✅ Row deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting row:', error);
      throw error;
    }
  }

  /**
   * Start polling for changes
   */
  private startPolling(sheetName: string, interval: number): void {
    if (this.isPolling) {
      console.log('⚠️ Polling already active');
      return;
    }

    this.isPolling = true;
    console.log(`🔄 Starting polling every ${interval}ms`);

    this.pollInterval = setInterval(async () => {
      try {
        await this.performSync(sheetName);
      } catch (error) {
        console.error('❌ Polling error:', error);
        if (this.callbacks.onSyncError) {
          this.callbacks.onSyncError(error as Error);
        }
      }
    }, interval);
  }

  /**
   * Check if there are conflicts between local and remote data
   */
  private detectConflicts(localData: SheetData, remoteData: SheetData): boolean {
    // Simple conflict detection - compare timestamps or data hashes
    // For now, we'll use a basic comparison
    if (localData.values.length !== remoteData.values.length) {
      return true;
    }

    for (let i = 0; i < localData.values.length; i++) {
      if (localData.values[i].length !== remoteData.values[i].length) {
        return true;
      }
      
      for (let j = 0; j < localData.values[i].length; j++) {
        if (localData.values[i][j] !== remoteData.values[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Resolve conflicts by merging data
   */
  async resolveConflicts(localData: SheetData, remoteData: SheetData, strategy: 'local' | 'remote' | 'merge' = 'remote'): Promise<SheetData> {
    console.log(`🔧 Resolving conflicts using ${strategy} strategy`);
    
    switch (strategy) {
      case 'local':
        return localData;
      case 'remote':
        return remoteData;
      case 'merge':
        // Merge strategy: prefer remote data but keep local additions
        return this.mergeData(localData, remoteData);
      default:
        return remoteData;
    }
  }

  /**
   * Merge local and remote data
   */
  private mergeData(localData: SheetData, remoteData: SheetData): SheetData {
    // Simple merge strategy - prefer remote data
    // In a more sophisticated implementation, you might want to:
    // - Compare timestamps
    // - Use field-level conflict resolution
    // - Implement operational transforms
    return remoteData;
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isPolling: boolean;
    lastSyncTimestamp: number;
    timeSinceLastSync: number;
  } {
    return {
      isPolling: this.isPolling,
      lastSyncTimestamp: this.lastSyncTimestamp,
      timeSinceLastSync: Date.now() - this.lastSyncTimestamp,
    };
  }
}

export default new SyncService();
