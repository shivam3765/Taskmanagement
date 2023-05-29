import { StatusBar } from 'expo-status-bar';

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const addTask = () => {
    if (title.trim() === '' || description.trim() === '') {
      return;
    }
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Math.random().toString(), title, description, completed: false },
    ]);
    setTitle('');
    setDescription('');
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (!taskToEdit) {
      return;
    }
    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description);
    setEditingTaskId(taskId);
  };

  const updateTask = () => {
    if (title.trim() === '' || description.trim() === '' || !editingTaskId) {
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTaskId ? { ...task, title, description } : task
      )
    );
    setTitle('');
    setDescription('');
    setEditingTaskId(null);
  };

  const toggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text
              style={[
                styles.taskTitle,
                item.completed && styles.completedTask,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.taskDescription,
                item.completed && styles.completedTask,
              ]}
            >
              {item.description}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Edit"
                onPress={() => editTask(item.id)}
                color="#2089dc"
              />
              <Button
                title={item.completed ? 'Undo' : 'Complete'}
                onPress={() => toggleComplete(item.id)}
                color={item.completed ? '#ccc' : '#2089dc'}
              />
              <Button
                title="Delete"
                onPress={() => deleteTask(item.id)}
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
        {editingTaskId ? (
          <View style={styles.buttonContainer}>
            <Button title="Update Task" onPress={updateTask} />
            <Button
              title="Cancel"
              onPress={() => {
                setTitle('');
                setDescription('');
                setEditingTaskId(null);
              }}
              color="red"
            />
          </View>
        ) : (
          <Button title="Add Task" onPress={addTask} />
        )}
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
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 20
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
