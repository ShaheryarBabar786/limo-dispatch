const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { validateUser } = require('../utils/validation');

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { 
      email, 
      password: password ? '***' : 'missing',
      timestamp: new Date().toISOString()
    });

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const searchEmail = email.trim().toLowerCase();
    console.log('Searching for email:', `"${searchEmail}"`);
    console.log('Testing table access...');
    
    const { count, error: countError } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });

    console.log('Table count test:', {
      count: count || 0,
      countError: countError ? countError.message : 'null'
    });

    const { data: anyUsers, error: anyError } = await supabase
      .from('admin_users')
      .select('id, email')
      .limit(5);

    console.log('Any users test:', {
      anyError: anyError ? anyError.message : 'null',
      anyUsersCount: anyUsers ? anyUsers.length : 0,
      anyUsers: anyUsers || 'none'
    });

    console.log('🔄 Querying for specific email...');
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', searchEmail)
      .limit(1);

    console.log('Specific email query result:', {
      error: error ? error.message : 'null',
      usersCount: users ? users.length : 0,
      usersFound: users ? users.map(u => ({ id: u.id, email: u.email })) : 'none'
    });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return res.status(500).json({ error: 'Database error' });
    }

    if (!users || users.length === 0) {
      console.log('No user found with exact email match.');
      
      const { data: allUsers } = await supabase
        .from('admin_users')
        .select('id, email, name')
        .order('created_at', { ascending: false });

      if (allUsers && allUsers.length > 0) {
        console.log('All users found in admin_users table:');
        allUsers.forEach(user => {
          const emailMatch = user.email.toLowerCase() === searchEmail.toLowerCase();
          console.log(`   - ${user.id}: "${user.email}" (${user.name}) ${emailMatch ? 'MATCH' : 'NO MATCH'}`);
        });

        const similarEmails = allUsers.filter(user => 
          user.email.toLowerCase().includes('admin') || 
          user.email.toLowerCase().includes('limodispatch')
        );
        
        if (similarEmails.length > 0) {
          console.log('Similar emails found:');
          similarEmails.forEach(user => {
            console.log(`   - "${user.email}"`);
          });
        }
      } else {
        console.log('NO USERS FOUND IN admin_users TABLE AT ALL!');
        console.log('Possible issues:');
        console.log('   - Wrong table name (check if it should be admin_users)');
        console.log('   - Wrong schema (check if table is in public schema)');
        console.log('   - RLS (Row Level Security) blocking access');
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    console.log('✅ User found! Proceeding with password verification...');
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔐 Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful!');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login, getProfile };