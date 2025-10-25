import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from '../common/Card';
import { AnalyzeImageResponse, PLANT_TYPE_NAMES } from '../../supabase/operations/ai/type';

interface AnalysisSuccessResultProps {
  result: Extract<AnalyzeImageResponse, { code: "success" }>;
}

export const AnalysisSuccessResult = ({ result }: AnalysisSuccessResultProps) => {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Card>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          🌱 {result.name}
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#6b7280',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          {PLANT_TYPE_NAMES[result.type_code as keyof typeof PLANT_TYPE_NAMES]}
        </Text>

        <Text style={{
          fontSize: 16,
          color: '#374151',
          lineHeight: 24,
          marginBottom: 16,
        }}>
          {result.description}
        </Text>

        <View style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: 8,
          }}>
            📅 활동성 정보
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            lineHeight: 20,
          }}>
            {result.activity_notes}
          </Text>
        </View>

        <View style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          padding: 12,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: 8,
          }}>
            📊 월별 활동성 곡선
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {result.activity_curve.map((value, index) => (
              <View key={index} style={{
                alignItems: 'center',
                marginBottom: 8,
                width: '12%',
              }}>
                <Text style={{
                  fontSize: 10,
                  color: '#6b7280',
                  marginBottom: 2,
                }}>
                  {index + 1}월
                </Text>
                <View style={{
                  width: 20,
                  height: 20,
                  backgroundColor: `rgba(16, 185, 129, ${value})`,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 8,
                    color: value > 0.5 ? '#ffffff' : '#6b7280',
                    fontWeight: 'bold',
                  }}>
                    {Math.round(value * 100)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};