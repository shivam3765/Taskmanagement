import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import axios from 'react-native-axios';

const serverURL = 'http://192.168.88.229:3001'; 

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get(`${serverURL}/tasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving tasks:', error);
      });
  };

  const addTask = () => {
    if (title.trim() === '' || description.trim() === '') {
      return;
    }

    axios
      .post(`${serverURL}/tasks`, { title, description })
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setTitle('');
        setDescription('');
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };

  const updateTask = (taskId) => {
    const updatedTask = tasks.find((task) => task._id === taskId);

    if (!updatedTask) {
      return;
    }

    axios
      .put(`${serverURL}/tasks/${taskId}`, updatedTask)
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`${serverURL}/tasks/${taskId}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };



  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Update"
                onPress={() => updateTask(item._id)}
                color="#2089dc"
              />
              <Button
                title="Delete"
                onPress={() => deleteTask(item._id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
    
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  task: {
    marginBottom: 10,
    marginTop: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
