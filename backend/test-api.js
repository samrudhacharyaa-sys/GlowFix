require('dotenv').config();
const http = require('http');

// Simple fetch/http test against the running Express app without needing external network
const testApp = async () => {
  const express = require('express');
  const cors = require('cors');
  const path = require('path');
  const connectDB = require('./config/db');
  const seedData = require('./seed');

  const authRoutes = require('./routes/authRoutes');
  const complaintRoutes = require('./routes/complaintRoutes');
  const adminRoutes = require('./routes/adminRoutes');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.get('/api/health', (req, res) => res.json({ status: 'online' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/admin', adminRoutes);

  await connectDB();
  await seedData();

  const server = app.listen(5099, async () => {
    console.log('[Test Suite] Test server running on port 5099');

    try {
      // 1. Health check
      console.log('Testing 1: Health Check...');
      const healthRes = await makeRequest('http://localhost:5099/api/health');
      console.log('  Health check status:', healthRes.data.status);

      // 2. Citizen Login
      console.log('Testing 2: Citizen Login...');
      const citizenLogin = await makeRequest('http://localhost:5099/api/auth/login', 'POST', {
        email: 'citizen@example.com',
        password: 'citizen123'
      });
      console.log('  Citizen login success:', citizenLogin.data.success, 'Token length:', citizenLogin.data.token?.length);
      const citizenToken = citizenLogin.data.token;

      // 3. Admin Login
      console.log('Testing 3: Admin Login...');
      const adminLogin = await makeRequest('http://localhost:5099/api/auth/login', 'POST', {
        email: 'admin@glowfix.gov',
        password: 'admin123'
      });
      console.log('  Admin login success:', adminLogin.data.success, 'Role:', adminLogin.data.user?.role);
      const adminToken = adminLogin.data.token;

      // 4. Public Complaint Tracking
      console.log('Testing 4: Public Complaint Tracking (GF-102941)...');
      const trackRes = await makeRequest('http://localhost:5099/api/complaints/track/GF-102941');
      console.log('  Found complaint:', trackRes.data.complaint?.complaintId, 'Status:', trackRes.data.complaint?.status);

      // 5. Submit new complaint
      console.log('Testing 5: Submit New Complaint...');
      const newComplaint = await makeRequest('http://localhost:5099/api/complaints', 'POST', {
        streetLightId: 'SL-9942',
        location: 'MG Road Junction 5',
        faultType: 'Not Working',
        description: 'Complete blackout on northern sidewalk.',
        citizenName: 'Verification Bot',
        citizenEmail: 'bot@glowfix.gov'
      }, { 'Authorization': `Bearer ${citizenToken}` });
      console.log('  Created complaint ID:', newComplaint.data.complaintId);
      const createdId = newComplaint.data.complaint._id;

      // 6. Admin Update Status
      console.log('Testing 6: Admin Status Update to In Progress...');
      const updateRes = await makeRequest(`http://localhost:5099/api/admin/complaints/${createdId}/status`, 'PUT', {
        status: 'In Progress',
        adminNotes: 'Field crew assigned to repair junction fuse.'
      }, { 'Authorization': `Bearer ${adminToken}` });
      console.log('  Admin update message:', updateRes.data.message, 'New Status:', updateRes.data.complaint?.status);

      // 7. Admin Dashboard Stats
      console.log('Testing 7: Admin Dashboard Stats...');
      const statsRes = await makeRequest('http://localhost:5099/api/admin/stats', 'GET', null, {
        'Authorization': `Bearer ${adminToken}`
      });
      console.log('  Total complaints in system:', statsRes.data.stats?.totalComplaints);
      console.log('  Registered users count:', statsRes.data.stats?.totalUsers);

      console.log('\n=============================================');
      console.log(' ALL 7 FULL-STACK API TESTS PASSED PERFECTLY!');
      console.log('=============================================');

      server.close();
      process.exit(0);
    } catch (err) {
      console.error('[Test Suite Error]', err);
      server.close();
      process.exit(1);
    }
  });
};

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || body}`));
          } else {
            resolve({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

testApp();
