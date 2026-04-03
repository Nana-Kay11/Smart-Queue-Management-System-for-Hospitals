import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function PatientDashboard() {
  const [activeTicket, setActiveTicket] = useState(null);
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock fetching queue status
  const fetchStatus = () => {
    setLoading(true);
    setTimeout(() => {
      // setActiveTicket({ ticket_number: 'OPD-005', department_name: 'OPD Consultation' });
      // setPeopleAhead(4);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleJoinQueue = () => {
    // Navigate to Join Queue modal/screen (to be done soon)
    alert("Select a department to join!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Queue Status</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : activeTicket ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{activeTicket.department_name}</Text>
          <Text style={styles.ticketNumber}>{activeTicket.ticket_number}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{peopleAhead}</Text>
              <Text style={styles.statLabel}>People Ahead</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{peopleAhead * 5} min</Text>
              <Text style={styles.statLabel}>Est. Wait</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.refreshBtn} onPress={fetchStatus}>
            <Text style={styles.refreshBtnText}>Refresh Status</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You are not currently in any queue.</Text>
          <TouchableOpacity style={styles.joinBtn} onPress={handleJoinQueue}>
            <Text style={styles.joinBtnText}>Join a Queue</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 24,
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0066cc',
    letterSpacing: 2,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  refreshBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  refreshBtnText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  joinBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
