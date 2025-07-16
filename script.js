const DEFAULT_BUYIN_CHIPS = 1000;

const numPlayersInput = document.getElementById('numPlayers');
const createPlayersBtn = document.getElementById('createPlayersBtn');
const playersContainer = document.getElementById('playersContainer');
const settingsDiv = document.getElementById('settings');
const buyInPriceInput = document.getElementById('buyInPrice');
const calculateBtn = document.getElementById('calculateBtn');
const resultPre = document.getElementById('result');

let players = [];
let buyInPrice = 1000;

createPlayersBtn.addEventListener('click', () => {
  const n = parseInt(numPlayersInput.value);
  players = [];
  for (let i = 0; i < n; i++) {
    players.push({ id: i, name: '', buyIns: 1, chipsEnd: '' });
  }
  renderPlayers();
  settingsDiv.style.display = 'block';
  resultPre.textContent = '';
});

function renderPlayers() {
  playersContainer.innerHTML = '';
  players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'player-card';

    div.innerHTML = `
      <div class="player-info">
        <label>Tên người chơi ${p.id + 1}:</label>
        <input type="text" placeholder="Nhập tên" value="${p.name}" data-id="${p.id}" data-field="name" />
      </div>

      <div class="stats">
        <label>Số buyin đã mua:</label>
        <div style="display:flex; align-items:center; gap:10px;">
          <p class="buyin-count">${p.buyIns}</p>
          <button data-id="${p.id}" class="buyin-btn">Mua thêm</button>
        </div>
      </div>

      <div class="chips-section">
        <label>Chips cuối cùng:</label>
        <input type="number" min="0" placeholder="Chips cuối" value="${p.chipsEnd}" data-id="${p.id}" data-field="chipsEnd" />
      </div>
    `;
    playersContainer.appendChild(div);
  });

  // Gắn sự kiện cho input và nút
  Array.from(playersContainer.querySelectorAll('input')).forEach(input => {
    input.addEventListener('change', handleInputChange);
  });
  Array.from(playersContainer.querySelectorAll('.buyin-btn')).forEach(btn => {
    btn.addEventListener('click', handleBuyIn);
  });
}

function handleInputChange(e) {
  const id = parseInt(e.target.dataset.id);
  const field = e.target.dataset.field;
  let value = e.target.value;

  players = players.map(p => {
    if (p.id === id) {
      if (field === 'name') {
        return { ...p, name: value };
      } else if (field === 'chipsEnd') {
        return { ...p, chipsEnd: value };
      }
    }
    return p;
  });
}

function handleBuyIn(e) {
  const id = parseInt(e.target.dataset.id);
  players = players.map(p => p.id === id ? { ...p, buyIns: p.buyIns + 1 } : p);
  renderPlayers();
}

calculateBtn.addEventListener('click', () => {
  buyInPrice = parseInt(buyInPriceInput.value) || 1;
  let output = 'Kết quả:\n\n';

  players.forEach(p => {
    if (p.name.trim() === '' || p.chipsEnd === '') {
      output += `${p.name || '(Chưa nhập tên)'}: Dữ liệu chưa đầy đủ\n`;
      return;
    }
    const totalBuyInChips = p.buyIns * DEFAULT_BUYIN_CHIPS;
    const diffChips = p.chipsEnd - totalBuyInChips;
    const money = (diffChips * buyInPrice) / 1000;
    output += `${p.name}: Mua ${p.buyIns} buy-in, Chips cuối: ${p.chipsEnd}, ` +
              `Chênh lệch: ${diffChips}, ${money >= 0 ? 'Nhận' : 'Phải trả'}: ${Math.abs(money).toFixed(2)}\n`;
  });

  resultPre.textContent = output;
});
