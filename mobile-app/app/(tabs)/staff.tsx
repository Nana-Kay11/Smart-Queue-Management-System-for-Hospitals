import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function StaffDashboard() {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [queueLength, setQueueLength] = useState(5); // Mock number
  
  const handleCallNext = () => {
    // API Call to /api/queue/call-next
    if (queueLength > 0) {
      setCurrentPatient({ ticket_number: `OPD-00${6 - queueLength}` });
      setQueueLength(queueLength - 1);
    } else {
      Alert.alert("Queue Empty", "There are no more patients waiting.");
      setCurrentPatient(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Control Panel</Text>
      <Text style={styles.subHeader}>OPD Consultation</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{queueLength}</Text>
          <Text style={styles.statLabel}>Waiting</Text>
        </View>
      </View>

      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>Currently Serving:</Text>
        <Text style={styles.currentTicket}>
          {currentPatient ? currentPatient.ticket_number : 'None'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.callBtn, queueLength === 0 && styles.callBtnDisabled]} 
        onPress={handleCallNext}
        disabled={queueLength === 0}
      >
        <Text style={styles.callBtnText}>Call Next Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  currentCard: {
    backgroundColor: '#0066cc',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  currentLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  currentTicket: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  callBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  callBtnDisabled: {
    backgroundColor: '#95a5a6',
  },
  callBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
