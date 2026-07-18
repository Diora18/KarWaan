import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testFlow() {
  console.log('--- STARTING AUTH FLOW TEST ---\n');

  // 1. Fetch organization ID for odoo.com
  console.log('1. Fetching Organization...');
  const orgRes = await fetch(`${API_BASE}/organizations/domain/odoo.com`);
  const orgData = await orgRes.json();
  const organizationId = orgData._id;
  console.log(`Organization ID: ${organizationId}\n`);

  // 2. Register a new employee (Pending)
  console.log('2. Registering new employee (john@odoo.com)...');
  const registerRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@odoo.com',
      password: 'Password123',
      phone: '9998887776',
      organizationId,
      department: 'Sales',
      location: 'Ahmedabad'
    })
  });
  const registerData = await registerRes.json();
  console.log('Register Response:', registerData);
  console.log('Attempting to login immediately (should fail because status is Pending)...');
  const failLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john@odoo.com', password: 'Password123', organizationId })
  });
  console.log('Login Result:', await failLoginRes.json(), '\n');

  // 3. Login as Admin
  console.log('3. Logging in as Admin (admin@odoo.com)...');
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@odoo.com',
      password: 'Password123',
      organizationId
    })
  });
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;
  console.log(`Admin Login Success! Role: ${adminData.user.role}\n`);

  // 4. Admin fetches employees to find John
  console.log('4. Admin fetching employee list...');
  const employeesRes = await fetch(`${API_BASE}/admin/employees`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const employees = await employeesRes.json();
  const john = employees.find(e => e.email === 'john@odoo.com');
  console.log(`Found John Doe (Status: ${john.status}, ID: ${john._id})\n`);

  // 5. Admin approves John
  console.log('5. Admin approving John Doe (Changing status to Active)...');
  const approveRes = await fetch(`${API_BASE}/admin/employees/${john._id}/access`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Active' })
  });
  const approveData = await approveRes.json();
  console.log('Approval Result:', approveData.message, '\n');

  // 6. John logs in successfully
  console.log('6. John logging in again...');
  const johnLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john@odoo.com', password: 'Password123', organizationId })
  });
  const johnData = await johnLoginRes.json();
  const johnToken = johnData.token;
  console.log('John Login Success! Status:', johnData.user.status, '\n');

  // 7. John accesses Employee Dashboard/Profile
  console.log('7. John fetching his dashboard/profile...');
  const profileRes = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${johnToken}` }
  });
  const profileData = await profileRes.json();
  console.log('Profile Data:', profileData);
  console.log('\n--- FLOW COMPLETED SUCCESSFULLY ---');
}

testFlow().catch(console.error);
