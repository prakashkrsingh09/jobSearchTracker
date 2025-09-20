import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BaseComponentProps } from '../types';

interface SheetDataRowProps extends BaseComponentProps {
  rowNumber: number;
  data: string[];
  maxColumns?: number;
}

const SheetDataRow: React.FC<SheetDataRowProps> = ({
  rowNumber,
  data,
  maxColumns = 5,
  style,
}) => {
  const displayData = data.slice(0, maxColumns);
  const hasMoreData = data.length > maxColumns;

  return (
    <ScrollView style={[styles.container, style]}
    showsVerticalScrollIndicator={false}
    horizontal={true}
    >

      <View style={styles.rowNumberContainer}>
        <Text style={styles.rowNumber}>{rowNumber}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>
          {displayData.join(' | ')}
          {hasMoreData && ` ... (+${data.length - maxColumns} more)`}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    marginBottom: 8,
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    elevation: 2,
    flex:1
  },
  rowNumberContainer: {
    marginRight: 10,
    minWidth: 30,
    justifyContent: 'center',
  },
  rowNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default SheetDataRow;
