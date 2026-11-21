const token = () => localStorage.getItem('token');
const role = () => localStorage.getItem('role');

async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: 'Bearer ' + token() } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Error');
  return data;
}

function logout() { localStorage.clear(); location.href = 'login.html'; }
function navbar() {
  document.getElementById('nav').innerHTML = `
    <span class="brand">🛒 MyShop</span>
    <a href="index.html">Products</a>
    <a href="cart.html">Cart</a>
    <a href="orders.html">Orders</a>
    ${role() === 'admin' ? '<a href="admin.html">Admin</a><a href="admin-orders.html">All Orders</a>' : ''}
    ${token()
      ? `<a href="#" onclick="logout()">Logout (${localStorage.getItem('name')})</a>`
      : '<a href="login.html">Login</a>'}`;
}