import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { analyzeImage } from '../supabase/operations/ai/analyzeImage';
import { AnalyzeImageResponse, PLANT_TYPE_NAMES } from '../supabase/operations/ai/type';

export const Route = createRoute('/analyze', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const routeParams = Route.useParams() as { imageBase64: string };
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageResponse | null>(null);

  useEffect(() => {
    if (routeParams.imageBase64) {
      performAnalysis();
    } else {
      Alert.alert('오류', '이미지 데이터가 없습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    }
  }, []);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeImage(routeParams.imageBase64);
      setAnalysisResult(result);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      setAnalysisResult({
        code: "error",
        error: "이미지 분석 중 오류가 발생했습니다."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderSuccessResult = (result: Extract<AnalyzeImageResponse, { code: "success" }>) => {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
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
        </View>
      </ScrollView>
    );
  };

  const renderErrorResult = (result: Extract<AnalyzeImageResponse, { code: "error" | "not_plant" | "low_confidence" }>) => {
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

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f9fafb',
    }}>
      {/* 헤더 */}
      <View style={{
        backgroundColor: '#ffffff',
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{
            fontSize: 16,
            color: '#2563eb',
            fontWeight: 'bold',
          }}>
            ← 뒤로
          </Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1f2937',
        }}>
          식물 분석 결과
        </Text>
        
        <View style={{ width: 50 }} />
      </View>

      {/* 이미지 표시 */}
      <View style={{
        backgroundColor: '#ffffff',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${routeParams.imageBase64}` }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 12,
            resizeMode: 'cover',
          }}
        />
      </View>

      {/* 분석 결과 또는 로딩 */}
      {isAnalyzing ? (
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
      ) : analysisResult ? (
        analysisResult.code === "success" ? 
          renderSuccessResult(analysisResult) : 
          renderErrorResult(analysisResult)
      ) : null}
    </View>
  );
}
