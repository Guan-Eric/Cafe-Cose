import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { getFeedbacks } from 'backend/feedback';
import { Feedback } from 'components/types';
import { useLocalSearchParams } from 'expo-router';

export default function ViewFeedbackScreen() {
  const { id, feedback, name, createdAt } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Feedback</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.feedback}>{feedback}</Text>
        <Text style={styles.date}>{createdAt}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: '#222',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  feedback: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 32,
    alignSelf: 'center',
  },
});
