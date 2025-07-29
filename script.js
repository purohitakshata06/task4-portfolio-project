 /***********************
 * TO‑DO (localStorage)
 ***********************/
const todoKey = 'akshata_tasks_v1';

function readTasks(){
  try { return JSON.parse(localStorage.getItem(todoKey)) || []; }
  catch { return []; }
}
function writeTasks(tasks){ localStorage.setItem(todoKey, JSON.stringify(tasks)); }

function renderTodos(){
  const list = document.getElementById('todoList');
  if(!list) return; // not on this page

  const tasks = readTasks();
  list.innerHTML = '';

  tasks.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const left = document.createElement('div');
    left.className = 'todo-left';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = t.done;
    cb.onchange = () => {
      const updated = readTasks();
      updated[idx].done = cb.checked;
      writeTasks(updated);
      renderTodos();
    };

    const span = document.createElement('span');
    span.className = 'todo-text' + (t.done ? ' completed' : '');
    span.textContent = t.text;

    left.appendChild(cb);
    left.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-outline';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      const updated = readTasks().filter((_, i) => i !== idx);
      writeTasks(updated);
      renderTodos();
    };

    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function initTodoPage(){
  const input = document.getElementById('todoInput');
  const addBtn = document.getElementById('addTodoBtn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  if(!input || !addBtn) return; // not on todo page

  addBtn.onclick = () => {
    const text = (input.value || '').trim();
    if(!text) return;
    const tasks = readTasks();
    tasks.push({ text, done:false, created: Date.now() });
    writeTasks(tasks);
    input.value = '';
    renderTodos();
  };

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') addBtn.click();
  });

  clearCompletedBtn.onclick = () => {
    const tasks = readTasks().filter(t => !t.done);
    writeTasks(tasks);
    renderTodos();
  };

  clearAllBtn.onclick = () => {
    writeTasks([]);
    renderTodos();
  };

  renderTodos();
}

/*******************************
 * PRODUCTS (Filter & Sorting)
 *******************************/
const productsData = [
  { id:1, name:'Wireless Headphones', category:'Electronics', price:1999, rating:4.5 },
  { id:2, name:'JavaScript Fundamentals', category:'Books', price:499, rating:4.8 },
  { id:3, name:'Cotton T‑Shirt', category:'Clothing', price:699, rating:4.2 },
  { id:4, name:'Bluetooth Speaker', category:'Electronics', price:1499, rating:4.3 },
  { id:5, name:'CSS Secrets', category:'Books', price:649, rating:4.6 },
  { id:6, name:'Denim Jacket', category:'Clothing', price:1899, rating:4.1 },
  { id:7, name:'Mechanical Keyboard', category:'Electronics', price:3499, rating:4.7 },
  { id:8, name:'Clean Code', category:'Books', price:799, rating:4.9 },
  { id:9, name:'Running Shoes', category:'Clothing', price:2499, rating:4.4 }
];

function renderProducts(list){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div><span class="badge">${p.category}</span></div>
      <div>₹ ${p.price}</div>
      <div>⭐ ${p.rating}</div>
    `;
    grid.appendChild(card);
  });
}

function applyProductFilters(){
  const category = document.getElementById('categoryFilter').value;
  const minPrice = parseFloat(document.getElementById('minPrice').value || '0');
  const maxPrice = parseFloat(document.getElementById('maxPrice').value || '999999');
  const sortBy = document.getElementById('sortBy').value;

  let filtered = productsData.filter(p => {
    const inCat = (category === 'all') || (p.category === category);
    const inPrice = p.price >= minPrice && p.price <= maxPrice;
    return inCat && inPrice;
  });

  switch (sortBy){
    case 'priceAsc': filtered.sort((a,b)=>a.price-b.price); break;
    case 'priceDesc': filtered.sort((a,b)=>b.price-a.price); break;
    case 'ratingDesc': filtered.sort((a,b)=>b.rating-a.rating); break;
    default: /* none */ break;
  }

  renderProducts(filtered);
}

function resetProductFilters(){
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('sortBy').value = 'none';
  renderProducts(productsData);
}

function initProductsPage(){
  const grid = document.getElementById('productsGrid');
  if(!grid) return; // not on products page

  renderProducts(productsData);

  document.getElementById('applyFilters').onclick = applyProductFilters;
  document.getElementById('resetFilters').onclick = resetProductFilters;
}

/***************
 * BOOTSTRAP
 ***************/
document.addEventListener('DOMContentLoaded', () => {
  initTodoPage();
  initProductsPage();
});
