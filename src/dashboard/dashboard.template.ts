export const dashboardPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Items Dashboard</title>
  <style>
    :root {
      --bg: #0f1117;
      --surface: #1a1d27;
      --surface-2: #242836;
      --border: #2e3345;
      --text: #e8eaf0;
      --muted: #8b92a8;
      --accent: #6c5ce7;
      --accent-2: #00cec9;
      --success: #00b894;
      --danger: #ff7675;
      --warning: #fdcb6e;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      background-image:
        radial-gradient(ellipse at 20% 0%, rgba(108, 92, 231, 0.15), transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(0, 206, 201, 0.1), transparent 50%);
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .subtitle { color: var(--muted); margin-top: 0.35rem; font-size: 0.95rem; }

    .live-dot {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: var(--success);
      background: rgba(0, 184, 148, 0.12);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
    }

    .live-dot::before {
      content: '';
      width: 7px;
      height: 7px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.1rem 1.25rem;
      transition: transform 0.15s, border-color 0.15s;
    }

    .stat-card:hover { transform: translateY(-2px); border-color: var(--accent); }

    .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
    .stat-value { font-size: 2rem; font-weight: 700; margin-top: 0.25rem; line-height: 1.1; }
    .stat-value.accent { color: var(--accent-2); }
    .stat-value.success { color: var(--success); }
    .stat-value.warning { color: var(--warning); }

    .panels {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 800px) { .panels { grid-template-columns: 1fr; } }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.25rem;
    }

    .panel h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 1rem; }

    .donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; }

    .donut {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      position: relative;
      transition: background 0.4s ease;
    }

    .donut-hole {
      width: 90px;
      height: 90px;
      background: var(--surface);
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .legend { display: flex; gap: 1rem; font-size: 0.85rem; }
    .legend span { display: flex; align-items: center; gap: 0.35rem; }
    .swatch { width: 10px; height: 10px; border-radius: 3px; }

    .chart-bars { display: flex; align-items: flex-end; gap: 0.5rem; height: 120px; padding-top: 0.5rem; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; min-width: 0; }
    .bar {
      width: 100%;
      max-width: 36px;
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
      border-radius: 6px 6px 2px 2px;
      min-height: 4px;
      transition: height 0.4s ease;
    }
    .bar-label { font-size: 0.65rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

    .add-form {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) { .add-form { grid-template-columns: 1fr; } }

    input, button {
      font: inherit;
      border-radius: 10px;
      border: 1px solid var(--border);
      padding: 0.65rem 0.9rem;
      background: var(--surface-2);
      color: var(--text);
    }

    input:focus { outline: none; border-color: var(--accent); }

    button {
      cursor: pointer;
      background: var(--accent);
      border-color: var(--accent);
      font-weight: 600;
      transition: opacity 0.15s;
    }

    button:hover { opacity: 0.9; }
    button.ghost { background: transparent; border-color: var(--border); color: var(--muted); font-weight: 500; }
    button.danger { background: transparent; border-color: transparent; color: var(--danger); padding: 0.4rem 0.6rem; }
    button.danger:hover { background: rgba(255, 118, 117, 0.12); }

    .items-list { display: flex; flex-direction: column; gap: 0.65rem; }

    .item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 0.85rem;
      align-items: center;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      transition: border-color 0.15s, opacity 0.2s;
    }

    .item.done { opacity: 0.65; }
    .item.done .item-name { text-decoration: line-through; color: var(--muted); }

    .checkbox {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      border: 2px solid var(--border);
      cursor: pointer;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
    }

    .checkbox.checked { background: var(--success); border-color: var(--success); }
    .checkbox.checked::after { content: '✓'; font-size: 0.75rem; color: #fff; font-weight: 700; }

    .item-name { font-weight: 600; font-size: 0.95rem; }
    .item-desc { font-size: 0.8rem; color: var(--muted); margin-top: 0.15rem; }
    .item-meta { font-size: 0.7rem; color: var(--muted); margin-top: 0.25rem; }

    .empty { text-align: center; color: var(--muted); padding: 2rem; }

    .filter-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-group { display: flex; gap: 0.4rem; flex-wrap: wrap; }

    .filter-btn {
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .filter-btn.active {
      background: rgba(108, 92, 231, 0.18);
      border-color: var(--accent);
      color: var(--text);
    }

    .search-input { flex: 1; min-width: 180px; }

    .toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: var(--surface-2);
      border: 1px solid var(--border);
      padding: 0.75rem 1.1rem;
      border-radius: 10px;
      font-size: 0.9rem;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.25s, transform 0.25s;
      pointer-events: none;
      z-index: 100;
    }

    .toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Items Dashboard</h1>
        <p class="subtitle">Live stats, activity chart, and interactive todo board</p>
      </div>
      <span class="live-dot">Live from /items API</span>
    </header>

    <div class="stats-grid" id="stats-grid">
      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value" id="stat-total">—</div></div>
      <div class="stat-card"><div class="stat-label">Completed</div><div class="stat-value success" id="stat-done">—</div></div>
      <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value warning" id="stat-pending">—</div></div>
      <div class="stat-card"><div class="stat-label">Completion</div><div class="stat-value accent" id="stat-rate">—</div></div>
      <div class="stat-card"><div class="stat-label">Last 24h</div><div class="stat-value" id="stat-24h">—</div></div>
    </div>

    <div class="panels">
      <div class="panel">
        <h2>Progress</h2>
        <div class="donut-wrap">
          <div class="donut" id="donut"><div class="donut-hole" id="donut-pct">0%</div></div>
          <div class="legend">
            <span><span class="swatch" style="background:var(--success)"></span> Done</span>
            <span><span class="swatch" style="background:var(--border)"></span> Pending</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <h2>Activity by day</h2>
        <div class="chart-bars" id="chart"></div>
      </div>
    </div>

    <form class="add-form" id="add-form">
      <input name="name" placeholder="New item name" required maxlength="100" />
      <input name="description" placeholder="Description (optional)" maxlength="500" />
      <button type="submit">Add item</button>
    </form>

    <div class="panel">
      <h2>All items</h2>
      <div class="filter-bar">
        <div class="filter-group" id="filter-group">
          <button type="button" class="filter-btn active" data-filter="all">All</button>
          <button type="button" class="filter-btn" data-filter="pending">Pending</button>
          <button type="button" class="filter-btn" data-filter="done">Done</button>
        </div>
        <input class="search-input" id="search-input" type="search" placeholder="Search items..." maxlength="100" />
      </div>
      <div class="items-list" id="items-list"></div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const toast = document.getElementById('toast');
    let toastTimer;
    let currentFilter = 'all';
    let searchQuery = '';
    let searchTimer;
    let refreshId = 0;

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function formatDate(iso) {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function shortDay(dateStr) {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString(undefined, { weekday: 'short' });
    }

    function renderStats(stats) {
      document.getElementById('stat-total').textContent = stats.total;
      document.getElementById('stat-done').textContent = stats.completed;
      document.getElementById('stat-pending').textContent = stats.pending;
      document.getElementById('stat-rate').textContent = stats.completionRate + '%';
      document.getElementById('stat-24h').textContent = stats.velocity.last24h;

      const pct = stats.completionRate;
      document.getElementById('donut-pct').textContent = pct + '%';
      document.getElementById('donut').style.background =
        'conic-gradient(var(--success) 0% ' + pct + '%, var(--border) ' + pct + '% 100%)';

      const chart = document.getElementById('chart');
      chart.innerHTML = '';
      if (!stats.activity.length) {
        chart.innerHTML = '<div class="empty">No activity yet</div>';
        return;
      }
      stats.activity.forEach(({ date, count }) => {
        const col = document.createElement('div');
        col.className = 'bar-col';
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = Math.max(8, (count / stats.maxDaily) * 100) + 'px';
        bar.title = date + ': ' + count + ' item(s)';
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = shortDay(date);
        col.append(bar, label);
        chart.appendChild(col);
      });
    }

    function itemsUrl() {
      const params = new URLSearchParams();
      if (currentFilter === 'pending') params.set('completed', 'false');
      if (currentFilter === 'done') params.set('completed', 'true');
      if (searchQuery) params.set('q', searchQuery);
      const query = params.toString();
      return query ? '/items?' + query : '/items';
    }

    function renderItems(items) {
      const list = document.getElementById('items-list');
      if (!items.length) {
        const filtered = currentFilter !== 'all' || searchQuery;
        list.innerHTML = '<div class="empty">' +
          (filtered ? 'No items match your filters.' : 'No items yet — add one above!') +
          '</div>';
        return;
      }
      list.innerHTML = items.map(item => \`
        <div class="item \${item.completed ? 'done' : ''}" data-id="\${item.id}">
          <div class="checkbox \${item.completed ? 'checked' : ''}" role="button" tabindex="0" aria-label="Toggle complete"></div>
          <div>
            <div class="item-name">\${escapeHtml(item.name)}</div>
            \${item.description ? '<div class="item-desc">' + escapeHtml(item.description) + '</div>' : ''}
            <div class="item-meta">#\${item.id} · \${formatDate(item.createdAt)}</div>
          </div>
          <button class="danger" type="button" aria-label="Delete">✕</button>
        </div>
      \`).join('');

      list.querySelectorAll('.item').forEach(row => {
        const id = row.dataset.id;
        row.querySelector('.checkbox').addEventListener('click', () => toggleItem(id, row));
        row.querySelector('.danger').addEventListener('click', () => deleteItem(id));
      });
    }

    function escapeHtml(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    async function fetchJson(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
      }
      return response.json();
    }

    async function refresh() {
      const id = ++refreshId;
      const [items, stats] = await Promise.all([
        fetchJson(itemsUrl()),
        fetchJson('/items/stats'),
      ]);
      if (id !== refreshId) return;
      renderStats(stats);
      renderItems(items);
    }

    async function toggleItem(id, row) {
      const done = !row.querySelector('.checkbox').classList.contains('checked');
      try {
        const response = await fetch('/items/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: done }),
        });
        if (!response.ok) throw new Error('Update failed');
        showToast(done ? 'Marked complete ✓' : 'Marked pending');
        await refresh();
      } catch {
        showToast('Could not update item');
      }
    }

    async function deleteItem(id) {
      try {
        const response = await fetch('/items/' + id, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        showToast('Item deleted');
        await refresh();
      } catch {
        showToast('Could not delete item');
      }
    }

    document.getElementById('filter-group').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      refresh();
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(refresh, 250);
    });

    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name').trim();
      if (!name) return;
      try {
        const response = await fetch('/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description: fd.get('description')?.trim() || undefined }),
        });
        if (!response.ok) throw new Error('Create failed');
        e.target.reset();
        showToast('Item added!');
        await refresh();
      } catch {
        showToast('Could not add item');
      }
    });

    refresh().catch(err => {
      document.getElementById('items-list').innerHTML =
        '<div class="empty">Could not load data. Is the server running?</div>';
      console.error(err);
    });
  </script>
</body>
</html>`;
