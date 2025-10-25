import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, style, ...props }: CardProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};