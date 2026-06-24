/* =====================
   DATA & HELPERS
===================== */
function load(){
  return JSON.parse(localStorage.getItem('rena_data')) || { assets:[], buyers:[], emails:[] };
}
function save(d){
  localStorage.setItem('rena_data', JSON.stringify(d));
}
const DATA = load();

const norm = v => (v||'').toString().trim().toUpperCase();

/* =====================
   NAVIGATION ACTIONS
===================== */
function editAsset(id){
  location.href = `add-asset.html?id=${id}`;
}
function editBuyer(id){
  location.href = `add-buyer.html?id=${id}`;
}
function deleteAsset(id){
  if(!confirm('Delete this asset?')) return;
  DATA.assets = DATA.assets.filter(a => a.id !== id);
  save(DATA);
  renderAssets();
}
function deleteBuyer(id){
  if(!confirm('Delete this buyer?')) return;
  DATA.buyers = DATA.buyers.filter(b => b.id !== id);
  save(DATA);
  renderBuyers();
}
function sendMarketingEmail(){
  alert('Marketing email sent (demo)');
}

/* =====================
   MATCH ACTIONS
===================== */
function matchAsset(id){
  const a = DATA.assets.find(x => x.id === id);
  if(a) location.href = `match.html?asset=${encodeURIComponent(a.name)}`;
}
function matchBuyer(id){
  const b = DATA.buyers.find(x => x.id === id);
  if(b) location.href = `match.html?buyer=${encodeURIComponent(b.name)}`;
}

/* =====================
   RENDER ASSETS
===================== */
function renderAssets(){
  const tbody = document.querySelector('#assetsTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';

  DATA.assets.forEach((a,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${i+1}</td>
      <td>${a.name}</td>
      <td>${a.type}</td>
      <td>${a.address}</td>
      <td>${a.state}</td>
      <td>
        <div class="actions">
          <button class="btn icon primary" title="Match"
            onclick="matchAsset(${a.id})">🔗</button>

          <button class="btn icon secondary" title="Edit"
            onclick="editAsset(${a.id})">✏️</button>

          <button class="btn icon success" title="Send Email"
            onclick="sendMarketingEmail(${a.id})">📧</button>

          <button class="btn icon danger" title="Delete"
            onclick="deleteAsset(${a.id})">🗑️</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

/* =====================
   RENDER BUYERS
===================== */
function renderBuyers(){
  const tbody = document.querySelector('#buyersTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';

  DATA.buyers.forEach((b,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${i+1}</td>
      <td>${b.name}</td>
      <td>${b.types.join(', ')}</td>
      <td>${b.locations.join(', ')}</td>
      <td>${b.state}</td>
      <td>
        <div class="actions">
          <button class="btn icon primary" title="Match"
            onclick="matchBuyer(${b.id})">🔗</button>

          <button class="btn icon secondary" title="Edit"
            onclick="editBuyer(${b.id})">✏️</button>

          <button class="btn icon danger" title="Delete"
            onclick="deleteBuyer(${b.id})">🗑️</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

/* =====================
   MATCH PAGE
===================== */
function renderMatchPage(){
  const params = new URLSearchParams(location.search);
  const assetName = params.get('asset');
  const buyerName = params.get('buyer');

  const tbody = document.querySelector('#matchTable tbody');
  tbody.innerHTML = '';

  if(assetName){
    const asset = DATA.assets.find(a =>
      norm(a.name).includes(norm(assetName))
    );
    if(!asset) return;

    assetDetails.innerHTML = `
      <h3>${asset.name}</h3>
      <p><strong>Type:</strong> ${asset.type}<br>
         <strong>State:</strong> ${asset.state}</p>`;

    DATA.buyers
      .filter(b => b.state === asset.state && b.types.includes(asset.type))
      .forEach(b=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${b.name}</td><td>${b.types.join(', ')}</td><td>${b.state}</td>`;
        tbody.appendChild(tr);
      });
  }

  if(buyerName){
    const buyer = DATA.buyers.find(b =>
      norm(b.name).includes(norm(buyerName))
    );
    if(!buyer) return;

    assetDetails.innerHTML = `
      <h3>${buyer.name}</h3>
      <p><strong>Interested Types:</strong> ${buyer.types.join(', ')}<br>
         <strong>State:</strong> ${buyer.state}</p>`;

    DATA.assets
      .filter(a => a.state === buyer.state && buyer.types.includes(a.type))
      .forEach(a=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${a.name}</td><td>${a.type}</td><td>${a.state}</td>`;
        tbody.appendChild(tr);
      });
  }
}

/* =====================
   BOOT
===================== */
document.addEventListener('DOMContentLoaded',()=>{
  const page=document.body.dataset.page;
  if(page==='assets') renderAssets();
  if(page==='buyers') renderBuyers();
  if(page==='match') renderMatchPage();
});

/* =====================
   GLOBAL
===================== */
window.matchAsset = matchAsset;
window.matchBuyer = matchBuyer;
window.editAsset = editAsset;
window.editBuyer = editBuyer;
window.deleteAsset = deleteAsset;
window.deleteBuyer = deleteBuyer;
window.sendMarketingEmail = sendMarketingEmail;
