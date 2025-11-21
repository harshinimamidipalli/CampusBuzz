import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OrgHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organizer Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrgEventList', { type: 'technical' })}
      >
        <Text style={styles.buttonText}>Technical Events</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrgEventList', { type: 'cultural' })}
      >
        <Text style={styles.buttonText}>Cultural Events</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#FF6347',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginVertical: 15,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
