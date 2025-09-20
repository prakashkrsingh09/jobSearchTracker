import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BaseComponentProps } from '../types';

interface DataTableProps extends BaseComponentProps {
  data: string[][];
  headers?: string[];
  columnWidths?: number[];
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  headers = [],
  columnWidths = [80, 120, 120, 120, 120], // Default column widths
  style,
}) => {
  // Calculate total width for horizontal scrolling
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

  // Ensure all rows have the same number of columns
  const maxColumns = Math.max(
    ...data.map(row => row.length),
    headers.length
  );

  // Pad rows with empty strings to ensure consistent column count
  const normalizedData = data.map(row => {
    const paddedRow = [...row];
    while (paddedRow.length < maxColumns) {
      paddedRow.push('');
    }
    return paddedRow;
  });

  const normalizedHeaders = [...headers];
  while (normalizedHeaders.length < maxColumns) {
    normalizedHeaders.push(`Column ${normalizedHeaders.length + 1}`);
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.row, { width: totalWidth }]}>
            {normalizedHeaders.map((header, index) => (
              <View
                key={index}
                style={[
                  styles.headerCell,
                  { width: columnWidths[index] || 120 }
                ]}
              >
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Data Rows */}
      <ScrollView style={styles.dataContainer}>
        {normalizedData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dataRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.row, { width: totalWidth }]}>
                {row.map((cell, cellIndex) => (
                  <View
                    key={cellIndex}
                    style={[
                      styles.dataCell,
                      { width: columnWidths[cellIndex] || 120 }
                    ]}
                  >
                    <Text style={styles.cellText} numberOfLines={2}>
                      {cell || '-'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRow: {
    backgroundColor: '#007AFF',
    borderBottomWidth: 2,
    borderBottomColor: '#0056CC',
  },
  dataContainer: {
    flex: 1,
  },
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    minHeight: 50,
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#0056CC',
  },
  dataCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
});

export default DataTable;
