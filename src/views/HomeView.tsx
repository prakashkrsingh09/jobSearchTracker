import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner, ErrorDisplay, SheetDataTable } from '../components';
import googleSheetsService, { SheetData } from '../services/googleSheetsService';
import syncService from '../services/syncService';

const HomeView: React.FC = () => {
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    isPolling: boolean;
    lastSyncTimestamp: number;
    timeSinceLastSync: number;
  }>({
    isPolling: false,
    lastSyncTimestamp: 0,
    timeSinceLastSync: 0,
  });

  const loadData = async () => {
    try {
      console.log("🚀 Starting to load data...");
      setError(null);
      const data = await googleSheetsService.getSheetData('Sheet2');
      console.log("✅ Data loaded successfully:", data);
      console.log("📊 Data values:", data.values);
      console.log("📈 Number of rows:", data.values?.length);
      setSheetData(data);
    } catch (err) {
      console.error("❌ Error loading data:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const startSync = async () => {
    try {
      await syncService.startSync(
        {
          sheetName: 'Sheet2',
          pollInterval: 30000, // 30 seconds
          enablePolling: true,
        },
        {
          onDataChange: (data) => {
            console.log('📥 Data changed from remote:', data);
            setSheetData(data);
          },
          onSyncError: (syncError) => {
            console.error('❌ Sync error:', syncError);
            Alert.alert('Sync Error', syncError.message);
          },
          onConflictDetected: (_localData, _remoteData) => {
            console.log('⚠️ Conflict detected');
            Alert.alert(
              'Conflict Detected',
              'Data has been modified in both the app and Google Sheets. Using the latest version from Google Sheets.',
              [{ text: 'OK' }]
            );
          },
        }
      );
      
      // Update sync status
      setSyncStatus(syncService.getSyncStatus());
    } catch (syncStartError) {
      console.error('❌ Error starting sync:', syncStartError);
      Alert.alert('Error', 'Failed to start synchronization');
    }
  };

  const stopSync = () => {
    syncService.stopSync();
    setSyncStatus(syncService.getSyncStatus());
  };

  const handleDataChange = async (rowIndex: number, columnIndex: number, newValue: string) => {
    try {
      await syncService.updateCell('Sheet2', rowIndex, columnIndex, newValue);
    } catch (cellUpdateError) {
      console.error('❌ Error updating cell:', cellUpdateError);
      throw cellUpdateError;
    }
  };

  const handleRowDelete = async (rowIndex: number) => {
    try {
      await syncService.deleteRow('Sheet2', rowIndex);
    } catch (rowDeleteError) {
      console.error('❌ Error deleting row:', rowDeleteError);
      throw rowDeleteError;
    }
  };

  const handleRowAdd = async () => {
    try {
      // Add a new empty row
      const emptyRow = Array(8).fill(''); // Assuming 8 columns
      await syncService.addRow('Sheet2', emptyRow);
    } catch (rowAddError) {
      console.error('❌ Error adding row:', rowAddError);
      throw rowAddError;
    }
  };

  useEffect(() => {
    loadData();
    
    // Start sync automatically
    startSync();
    
    // Cleanup on unmount
    return () => {
      syncService.stopSync();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRetry = () => {
    setLoading(true);
    loadData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Loading data from Google Sheets..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorDisplay error={error} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  if (!sheetData || !sheetData.values || sheetData.values.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No data found in the sheet</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Job Applications</Text>
        <Text style={styles.countText}>
          {sheetData.values.length} row{sheetData.values.length !== 1 ? 's' : ''}
        </Text>
        
        {/* Sync Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, isEditable && styles.controlButtonActive]}
            onPress={() => setIsEditable(!isEditable)}
          >
            <Text style={[styles.controlButtonText, isEditable && styles.controlButtonTextActive]}>
              {!isEditable ? '✏️ Edit Mode' : '👁️ View Mode'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, syncStatus.isPolling && styles.controlButtonActive]}
            onPress={syncStatus.isPolling ? stopSync : startSync}
          >
            <Text style={[styles.controlButtonText, syncStatus.isPolling && styles.controlButtonTextActive]}>
              {syncStatus.isPolling ? '🔄 Sync Active' : '▶️ Start Sync'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Sync Status */}
        {syncStatus.isPolling && (
          <Text style={styles.syncStatusText}>
            Last sync: {Math.floor(syncStatus.timeSinceLastSync / 1000)}s ago
          </Text>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <SheetDataTable
          data={sheetData.values}
          showRowNumbers={true}
          style={styles.tableContainer}
          editable={isEditable}
          onDataChange={handleDataChange}
          onRowDelete={handleRowDelete}
          onRowAdd={handleRowAdd}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  countText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    marginBottom: 15,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  controlButtonActive: {
    backgroundColor: '#007AFF',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  controlButtonTextActive: {
    color: '#fff',
  },
  syncStatusText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  tableContainer: {
    flex: 1,
    minHeight: 400,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeView;
