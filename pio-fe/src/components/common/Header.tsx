import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const Header = ({ 
  title, 
  onBackPress, 
  showBackButton = false 
}: HeaderProps) => {
  return (
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
      {showBackButton ? (
        <TouchableOpacity onPress={onBackPress}>
          <Text style={{
            fontSize: 16,
            color: '#2563eb',
            fontWeight: 'bold',
          }}>
            ← 뒤로
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 50 }} />
      )}
      
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
      }}>
        {title}
      </Text>
      
      <View style={{ width: 50 }} />
    </View>
  );
};