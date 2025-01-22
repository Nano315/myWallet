import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomTabButton } from '@/components/customTabButton';

export default function TabLayout() {
  return (
    // Gestion du menu en bas
    <View style={styles.containerGeneral}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomTabButton {...props} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerGeneral: {
    flex: 1,
  },
});
