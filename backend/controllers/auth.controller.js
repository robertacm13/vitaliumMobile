const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const JWT_SECRET = '2D4A614E645267556B58703273357638792F423F4428472B4B6250655368566D'; // În producție, pune asta în .env
 /// trebuie toate campurile
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifică dacă utilizatorul există deja
    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Criptează parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creează utilizatorul nou
    const user = new Patient({
      email,
      password: hashedPassword,
      
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Make sure the login function is properly defined
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await Patient.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d'
    });
    
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 /*exports.getProfile = async (req, res) => {
  try {
    const user = await Patient.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Actualizează câmpurile de bază
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Dacă se dorește schimbarea parolei
    if (newPassword) {
      // Verifică parola curentă
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Criptează și salvează noua parolă
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Trimite răspunsul fără parolă
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};*/