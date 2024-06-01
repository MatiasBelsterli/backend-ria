const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = [];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

// Function to create default users
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', phone: '123456789' },
    { email: 'baker@example.com', password: 'baker123', role: 'BAKER', phone: '987654321' },
    { email: 'user@example.com', password: 'user123', role: 'USER', phone: '456123789' },
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      phone: user.phone,
      enabled: true,
    };
    users.push(newUser);
  }
};

// Call the function to create default users at startup
createDefaultUsers();

const register = async (req, res) => {
  const { email, password, role, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    email,
    password: hashedPassword,
    role,
    phone,
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
    res.json({ token, name: user.email, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = users.find(u => u.id == id);
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
  const user = users.find(u => u.id == id);
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

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  enableUser,
  disableUser,
};
