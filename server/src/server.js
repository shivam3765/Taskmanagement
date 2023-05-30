const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://vampi:Ss9079581918@shivam.wltfrhp.mongodb.net/Taskmanagement'; 

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3001, () => {
      console.log('Server started on port 3001');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// app.get('/', (req, res) => {
//   res.send("This is main page")
// })

app.get('/tasks', (req, res) => {
  Task.find()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      console.error('Error retrieving tasks:', error);
      res.status(500).send('Error retrieving tasks');
    });
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ title, description });

  newTask
    .save()
    .then((task) => {
      res.json(task);
    })
    .catch((error) => {
      console.error('Error creating task:', error);
      res.status(500).send('Error creating task');
    });
});

app.put('/tasks/:taskId', (req, res) => {
  const { title, description, completed } = req.body;
  const taskId = req.params.taskId;

  Task.findByIdAndUpdate(taskId, { title, description, completed })
    .then(() => {
      res.send('Task updated successfully');
    })
    .catch((error) => {
      console.error('Error updating task:', error);
      res.status(500).send('Error updating task');
    });
});

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  Task.findByIdAndRemove(taskId)
    .then(() => {
      res.send('Task deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting task:', error);
      res.status(500).send('Error deleting task');
    });
});
