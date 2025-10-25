import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const AnalysisLoading = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ActivityIndicator size="large" color="#10b981" />
      <Text style={{
        fontSize: 16,
        color: '#6b7280',
        marginTop: 16,
      }}>
        AI가 식물을 분석하고 있습니다...
      </Text>
    </View>
  );
};