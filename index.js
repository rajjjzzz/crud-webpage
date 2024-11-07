const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();

// Middleware setup
app.use(express.json());  // To parse JSON data from requests
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data
app.use(methodOverride('_method'));  // To override POST method with DELETE and PUT for forms

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Views folder to store EJS files

// Sample users data (in-memory)
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Raj' }
];

// Home route (GET /) to render the index.ejs page with users
app.get('/', (req, res) => {
  res.render('index', { users: users });  // Passing users data to the index.ejs view
});

// Route to handle creating a new user (POST /users)
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,  // Increment ID for new user
    name: req.body.name     // Use the 'name' field from the form
  };
  users.push(newUser);  // Add the new user to the array
  res.redirect('/');  // Redirect back to the home page to show the updated list of users
});

app.get('/users/:id/edit', (req, res) => {
  console.log('Requested user ID:', req.params.id);  // Log the ID
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    console.log('User not found:', req.params.id);  // Log when user is not found
    return res.status(404).send('User not found');
  }
  res.render('edit', { user: user });
});

// Route to handle updating a user (PUT /users/:id)
app.post('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  user.name = req.body.name;  // Update the user's name
  res.redirect('/');  // Redirect to the home page to show the updated list of users
});

// Route to handle deleting a user (DELETE /users/:id)
app.post('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('User not found');

  users.splice(userIndex, 1);  // Remove the user from the array
  res.redirect('/');  // Redirect to the home page to show the updated list of users
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
