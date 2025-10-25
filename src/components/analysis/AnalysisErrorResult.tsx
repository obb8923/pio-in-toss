import React from 'react';
import { View, Text } from 'react-native';
import { AnalyzeImageResponse } from '../../supabase/operations/ai/type';

interface AnalysisErrorResultProps {
  result: Extract<AnalyzeImageResponse, { code: "error" | "not_plant" | "low_confidence" }>;
}

export const AnalysisErrorResult = ({ result }: AnalysisErrorResultProps) => {
  const getErrorIcon = () => {
    switch (result.code) {
      case "not_plant":
        return "❌";
      case "low_confidence":
        return "❓";
      default:
        return "⚠️";
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <Text style={{
        fontSize: 48,
        marginBottom: 16,
      }}>
        {getErrorIcon()}
      </Text>
      
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        분석 실패
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
      }}>
        {result.error}
      </Text>
    </View>
  );
};