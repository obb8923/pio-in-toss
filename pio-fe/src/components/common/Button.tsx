import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  style,
  ...props 
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
        };
      case 'secondary':
        return {
          backgroundColor: '#6b7280',
          textColor: '#ffffff',
        };
      case 'success':
        return {
          backgroundColor: '#10b981',
          textColor: '#ffffff',
        };
      case 'info':
        return {
          backgroundColor: '#059669',
          textColor: '#ffffff',
        };
      default:
        return {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 32,
          fontSize: 18,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 40,
          fontSize: 20,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 32,
          fontSize: 18,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: 8,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          color: variantStyles.textColor,
          fontSize: sizeStyles.fontSize,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};