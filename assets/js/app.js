(() => {
  const properties = window.REALTORS_PROPERTIES || [];
  const catalog = document.getElementById('catalog');
  const count = document.getElementById('resultsCount');
  const empty = document.getElementById('emptyState');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');
  const waNumber = '51935009770';
  const money = p => `${p.currency === 'USD' ? 'US$' : 'S/'} ${Number(p.price).toLocaleString('en-US')}`;
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render(items) {
    catalog.innerHTML = '';
    count.textContent = `${items.length} ${items.length === 1 ? 'propiedad' : 'propiedades'}`;
    empty.hidden = items.length !== 0;
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'property-card'; card.tabIndex = 0; card.setAttribute('role','button');
      card.setAttribute('aria-label', `Ver ${p.title}`);
      card.innerHTML = `<div class="property-image"><img src="${safe(p.image)}" alt="${safe(p.title)}" loading="lazy"><span class="property-tag">${safe(p.operation)}</span></div><div class="property-body"><div class="property-location">${safe(p.district)} · ${safe(p.department)}</div><p class="property-price">${money(p)}</p><h3 class="property-title">${safe(p.title)}</h3><div class="property-features"><span>⌂ ${safe(p.beds)} dorm.</span><span>▱ ${safe(p.baths)} baños</span><span>▧ ${safe(p.area)}</span></div><div class="property-link">Ver detalles <span>↗</span></div></div>`;
      card.addEventListener('click', () => openProperty(p));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProperty(p); } });
      catalog.appendChild(card);
    });
  }
  function openProperty(p) {
    const gallery = (p.gallery || [p.image]).map((src,i) => `<img src="${safe(src)}" alt="${safe(p.title)} - fotografía ${i+1}" loading="lazy">`).join('');
    const msg = encodeURIComponent(`Hola REALTORS, estoy interesado en la propiedad ${p.code}: ${p.title} (${money(p)}). Quisiera más información.`);
    modalBody.innerHTML = `<div class="modal-gallery">${gallery}</div><div class="modal-details"><span class="eyebrow">${safe(p.code)} · ${safe(p.operation)}</span><h2>${safe(p.title)}</h2><div class="property-price">${money(p)}</div><p>${safe(p.district)}, ${safe(p.province)}, ${safe(p.department)}</p><div class="property-features"><span>${safe(p.beds)} dormitorios</span><span>${safe(p.baths)} baños</span><span>${safe(p.area)}</span></div><p>${safe(p.description)}</p><div class="modal-contact"><a class="button button-bronze" href="https://wa.me/${waNumber}?text=${msg}" target="_blank" rel="noopener">Solicitar información por WhatsApp ↗</a></div></div>`;
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  function filter(){
    const op = document.getElementById('opFilter').value;
    const type = document.getElementById('typeFilter').value;
    const loc = document.getElementById('locationFilter').value;
    render(properties.filter(p => (op==='all'||p.operation===op) && (type==='all'||p.type===type) && (loc==='all'||p.department===loc)));
  }
  ['opFilter','typeFilter','locationFilter'].forEach(id => document.getElementById(id).addEventListener('change',filter));
  document.getElementById('searchButton').addEventListener('click', () => {filter();document.getElementById('propiedades').scrollIntoView({behavior:'smooth'});});
  document.getElementById('closeModal').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target.hasAttribute('data-close'))closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  const toggle=document.getElementById('menuToggle'), nav=document.getElementById('mainNav');
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
  document.getElementById('year').textContent=new Date().getFullYear();
  render(properties);
})();

