import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BaseComponentProps } from '../types';

interface SheetDataTableProps extends BaseComponentProps {
  data: string[][];
  showRowNumbers?: boolean;
  columnWidths?: number[];
  editable?: boolean;
  onDataChange?: (rowIndex: number, columnIndex: number, newValue: string) => Promise<void>;
  onRowDelete?: (rowIndex: number) => Promise<void>;
  onRowAdd?: () => Promise<void>;
}

const SheetDataTable: React.FC<SheetDataTableProps> = ({
  data,
  showRowNumbers = true,
  columnWidths,
  style,
  editable = false,
  onDataChange,
  onRowDelete,
  onRowAdd,
}) => {
  const [editingCell, setEditingCell] = useState<{row: number, column: number} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localData, setLocalData] = useState<string[][]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Ensure all rows have the same number of columns
  const maxColumns = Math.max(...localData.map(row => row.length));
  console.log(`📊 Detected ${maxColumns} columns in the data`);

  // Pad rows with empty strings to ensure consistent column count
  const normalizedData = localData.map(row => {
    const paddedRow = [...row];
    while (paddedRow.length < maxColumns) {
      paddedRow.push('');
    }
    return paddedRow;
  });

  // Handle cell editing
  const handleCellPress = (rowIndex: number, columnIndex: number) => {
    if (!editable) return;
    
    setEditingCell({ row: rowIndex, column: columnIndex });
    setEditValue(normalizedData[rowIndex][columnIndex] || '');
  };

  const handleCellEdit = async (rowIndex: number, columnIndex: number, newValue: string) => {
    if (!editable || !onDataChange) return;

    try {
      setIsLoading(true);
      
      // Update local data immediately for responsive UI
      const updatedData = [...localData];
      updatedData[rowIndex][columnIndex] = newValue;
      setLocalData(updatedData);
      
      // Sync with backend
      await onDataChange(rowIndex, columnIndex, newValue);
      
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating cell:', error);
      Alert.alert('Error', 'Failed to update cell. Please try again.');
      
      // Revert local changes on error
      setLocalData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDelete = async (rowIndex: number) => {
    if (!editable || !onRowDelete) return;

    Alert.alert(
      'Delete Row',
      'Are you sure you want to delete this row?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await onRowDelete(rowIndex);
            } catch (error) {
              console.error('Error deleting row:', error);
              Alert.alert('Error', 'Failed to delete row. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddRow = async () => {
    if (!editable || !onRowAdd) return;

    try {
      setIsLoading(true);
      await onRowAdd();
    } catch (error) {
      console.error('Error adding row:', error);
      Alert.alert('Error', 'Failed to add row. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate dynamic column widths if not provided
  const getColumnWidths = () => {
    if (columnWidths && columnWidths.length > 0) {
      return columnWidths;
    }
    
    // Calculate dynamic widths based on content
    const widths = [];
    
    // Row number column width
    if (showRowNumbers) {
      widths.push(60);
    }
    
    // Calculate width for each data column based on content
    for (let i = 0; i < maxColumns; i++) {
      let maxLength = 0;
      
      // Find the longest content in this column
      normalizedData.forEach(row => {
        const cellContent = row[i] || '';
        const length = cellContent.toString().length;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      
      // Set width based on content length (minimum 100, maximum 200)
      const width = Math.max(100, Math.min(200, maxLength * 8 + 20));
      widths.push(width);
    }
    
    return widths;
  };

  const finalColumnWidths = getColumnWidths();
  const totalWidth = finalColumnWidths.reduce((sum, width) => sum + width, 0);
  
  console.log(`📏 Column widths:`, finalColumnWidths);
  console.log(`📐 Total table width: ${totalWidth}px`);

  // Create headers (commented out for now)
  // const headers = showRowNumbers 
  //   ? ['#', ...Array.from({ length: maxColumns }, (_, i) => `Column ${i + 1}`)]
  //   : Array.from({ length: maxColumns }, (_, i) => `Column ${i + 1}`);

  // Separate header and data rows
  const headerRow = normalizedData[0] || [];
  const dataRows = normalizedData.slice(1);

  return (
    <View style={[styles.container, style]}>
      {/* Action Buttons */}
      {editable && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={handleAddRow}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>+ Add Row</Text>
          </TouchableOpacity>
          {isLoading && <Text style={styles.loadingText}>Syncing...</Text>}
        </View>
      )}

      {/* Fixed Header Row with synchronized horizontal scroll */}
      <View style={styles.headerContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.headerScroll}
          scrollEnabled={false}
          contentOffset={{ x: scrollX, y: 0 }}
        >
          <View style={{ width: totalWidth }}>
            <View style={[styles.headerRow, { backgroundColor: '#351c75' }]}>
              <View style={styles.row}>
                {/* Header Action Cell */}
                {editable && (
                  <View style={[styles.actionCell, styles.actionCellWidth]}>
                    <Text style={styles.headerActionText}>Actions</Text>
                  </View>
                )}
                
                {/* Header Data Cells */}
                {headerRow.map((cell, cellIndex) => (
                  <View
                    key={cellIndex}
                    style={[
                      styles.headerCell,
                      { 
                        width: showRowNumbers 
                          ? finalColumnWidths[cellIndex + 1] || 120 
                          : finalColumnWidths[cellIndex] || 120 
                      }
                    ]}
                  >
                    <Text style={styles.headerText} numberOfLines={2}>
                      {cell || `Column ${cellIndex + 1}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Scrollable Data Rows with synchronized horizontal scroll */}
      <ScrollView 
        style={styles.dataScrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScroll}
          onScroll={(event) => {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            setScrollX(scrollPosition);
          }}
          scrollEventThrottle={16}
        >
          <View style={{ width: totalWidth }}>
            {dataRows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.dataRow, { backgroundColor: '#fff' }]}>
                <View style={styles.row}>
                  {/* Row Actions */}
                  {editable && (
                    <View style={[styles.actionCell, styles.actionCellWidth]}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRowDelete(rowIndex + 1)} // +1 because we removed header
                        disabled={isLoading}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {/* Data Cells */}
                  {row.map((cell, cellIndex) => {
                    const isEditing = editingCell?.row === rowIndex + 1 && editingCell?.column === cellIndex;
                    
                    return (
                      <View
                        key={cellIndex}
                        style={[
                          styles.dataCell,
                          { 
                            width: showRowNumbers 
                              ? finalColumnWidths[cellIndex + 1] || 120 
                              : finalColumnWidths[cellIndex] || 120 
                          },
                          editable && styles.editableCell,
                          isEditing && styles.editingCell,
                        ]}
                      >
                        {isEditing ? (
                          <TextInput
                            style={[styles.cellInput, { color: "#000" }]}
                            value={editValue}
                            onChangeText={setEditValue}
                            onBlur={() => handleCellEdit(rowIndex + 1, cellIndex, editValue)}
                            onSubmitEditing={() => handleCellEdit(rowIndex + 1, cellIndex, editValue)}
                            autoFocus
                            selectTextOnFocus
                          />
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleCellPress(rowIndex + 1, cellIndex)}
                            disabled={!editable}
                            style={styles.cellTouchable}
                          >
                            <Text style={[styles.cellText, { color: "#000" }]} numberOfLines={3}>
                              {cell || '-'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  headerContainer: {
    backgroundColor: '#351c75',
    borderBottomWidth: 2,
    borderBottomColor: '#2a1458',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    height: 60, // Fixed height for header
  },
  headerScroll: {
    flex: 1,
  },
  dataScrollContainer: {
    flex: 1,
  },
  horizontalScroll: {
    flex: 1,
  },
  headerRow: {
    backgroundColor: '#351c75',
    borderBottomWidth: 2,
    borderBottomColor: '#2a1458',
  },
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    minHeight: 60,
  },
  actionCell: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  actionCellWidth: {
    width: 60,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: '#2a1458',
  },
  rowNumberCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  dataCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  editableCell: {
    backgroundColor: '#f8f9fa',
  },
  editingCell: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  cellTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
  cellInput: {
    fontSize: 12,
    lineHeight: 16,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  rowNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
});

export default SheetDataTable;
