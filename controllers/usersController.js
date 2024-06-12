const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = [];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

// Function to create default users
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', phone: '123456789', name: 'Admin', lastName: 'User', image: '' },
    { email: 'baker@example.com', password: 'baker123', role: 'BAKER', phone: '987654321', name: 'Baker', lastName: 'User', image: '' },
    { email: 'user@example.com', password: 'user123', role: 'USER', phone: '456123789', name: 'User', lastName: 'One', image: '' },
    { email: 'user2@example.com', password: 'user123', role: 'USER', phone: '436624729', name: 'User', lastName: 'Two', image: '' },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      phone: user.phone,
      name: user.name,
      lastName: user.lastName,
      image: user.image,
      enabled: true,
    };
    users.push(newUser);
  }
};

// Call the function to create default users at startup
createDefaultUsers();

const register = async (req, res) => {
  const { email, password, role, phone, name, lastName } = req.body;
  let image64 = '';
  const image = req.file;
  if(image){
    image64 = image.buffer.toString('base64');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    email,
    password: hashedPassword,
    role,
    phone,
    name,
    lastName,
    image: image64,
    enabled: true,
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateToken(user);
    res.json({ token, name: user.email, role: user.role, userId: user.id });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = users.find(u => u.id === id);
  if (user && await bcrypt.compare(oldPassword, user.password)) {
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated' });
  } else {
    res.status(400).json({ message: 'Invalid password' });
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    // Here you could send an email with a link to reset the password
    res.json({ message: 'Password reset link sent' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const enableUser = (req, res) => {
  const { id } = req.body;
  const user = users.find(u => u.id === id);
  if (user) {
    user.enabled = true;
    res.json({ message: 'User enabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const disableUser = (req, res) => {
  const { id } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.enabled = false;
    res.json({ message: 'User disabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id == id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const editUser = async (req, res) => {
  const id = req.userId;
  const { firstName, lastName, phone } = req.body;
  let image64 = '';
  const image = req.file;
  if (image) {
    image64 = image.buffer.toString('base64');
  }

  const user = users.find(u => u.id == id);
  if (user) {
    user.name = firstName || user.name;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    if (image64) {
      user.image = image64;
    }
    res.json({ message: 'User updated successfully', user });
  } else {
    res.status(404).json({ message: 'User not found', id });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  enableUser,
  disableUser,
  getUserById,
  editUser
};
