// Debug utility to help troubleshoot user persistence issues
export const debugUsers = () => {
  const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
  console.log('=== USER DEBUG INFO ===');
  console.log('Total users in storage:', users.length);
  console.log('Users by role:');
  
  const roleCount = users.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  
  console.table(roleCount);
  
  console.log('All users:');
  users.forEach((user: any, index: number) => {
    console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user.id}`);
  });
  
  console.log('=== END DEBUG INFO ===');
  return users;
};

// Function to clear all users (for testing purposes only)
export const clearAllUsers = () => {
  localStorage.removeItem('profitnet_users');
  console.log('All users cleared from storage');
};

// Function to check if demo accounts exist
export const checkDemoAccounts = () => {
  const users = JSON.parse(localStorage.getItem('profitnet_users') || '[]');
  const demoIds = ['super-admin-1', 'admin-1', 'user-1'];
  
  console.log('=== DEMO ACCOUNT CHECK ===');
  demoIds.forEach(id => {
    const exists = users.find((u: any) => u.id === id);
    console.log(`${id}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  });
  console.log('=== END DEMO CHECK ===');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).debugUsers = debugUsers;
  (window as any).clearAllUsers = clearAllUsers;
  (window as any).checkDemoAccounts = checkDemoAccounts;
}
