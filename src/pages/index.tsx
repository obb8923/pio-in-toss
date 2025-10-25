import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();

  const goToAboutPage = () => {
    navigation.navigate('/about');
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        🎉 Welcome! 🎉
      </Text>
      <Text style={{
        fontSize: 18,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        NativeWind와 함께하는 React Native 앱
      </Text>
      <TouchableOpacity 
        style={{
          backgroundColor: '#2563eb',
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={goToAboutPage}
      >
        <Text style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          About 페이지로 이동
        </Text>
      </TouchableOpacity>
    </View>
  );
}

