import { supabase } from './supabase.js';

(() => {
  const catalog = document.getElementById('catalog');
  const count = document.getElementById('resultsCount');
  const empty = document.getElementById('emptyState');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');
  const waNumber = '51935009770';
  let properties = [];

  const money = p => `${p.currency === 'USD' ? 'US$' : 'S/'} ${Number(p.price || 0).toLocaleString('en-US')}`;
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const areaText = p => p.area_total ? `${Number(p.area_total).toLocaleString('es-PE')} m²` : 'Área no especificada';
  const operationLabel = value => value === 'alquiler' ? 'Alquiler' : 'Venta';
  const publicAsset = path => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return path.startsWith('/') ? path : `./${path}`;
  };

  function normalizeProperty(row, photos) {
    const gallery = (photos || []).sort((a,b) => a.orden - b.orden).map(x => publicAsset(x.ruta_archivo));
    const image = publicAsset(row.imagen_portada) || gallery[0] || '';
    return {
      id: row.id,
      code: row.slug || String(row.id).slice(0,8).toUpperCase(),
      title: row.titulo,
      type: row.tipo_inmueble,
      operation: operationLabel(row.operacion),
      department: row.departamento,
      province: row.provincia || '',
      district: row.distrito || '',
      price: row.precio,
      currency: row.moneda,
      beds: row.dormitorios ?? 0,
      baths: row.banos ?? 0,
      area: areaText(row),
      image,
      gallery: gallery.length ? gallery : (image ? [image] : []),
      description: row.descripcion || ''
    };
  }

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
    const gallery = (p.gallery.length ? p.gallery : [p.image]).map((src,i) => `<img src="${safe(src)}" alt="${safe(p.title)} - fotografía ${i+1}" loading="lazy">`).join('');
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
  async function loadProperties() {
    catalog.innerHTML = '<p class="search-hint">Cargando propiedades...</p>';
    const { data, error } = await supabase
      .from('propiedades')
      .select('id,titulo,slug,operacion,tipo_inmueble,descripcion,precio,moneda,departamento,provincia,distrito,dormitorios,banos,area_total,estado,imagen_portada')
      .eq('estado','publicada')
      .order('creado_en', { ascending: false });
    if (error) {
      console.error('REALTORS: error cargando propiedades', error);
      catalog.innerHTML = '<p class="search-hint">No pudimos cargar las propiedades en este momento. Inténtalo más tarde o contáctanos por WhatsApp.</p>';
      count.textContent = 'Catálogo temporalmente no disponible';
      empty.hidden = true;
      return;
    }
    const ids = (data || []).map(p => p.id);
    let photoRows = [];
    if (ids.length) {
      const { data: photos, error: photoError } = await supabase
        .from('imagenes_propiedades')
        .select('propiedad_id,ruta_archivo,orden')
        .in('propiedad_id', ids)
        .order('orden', { ascending: true });
      if (photoError) console.warn('REALTORS: no se pudieron cargar las galerías', photoError);
      else photoRows = photos || [];
    }
    properties = (data || []).map(row => normalizeProperty(row, photoRows.filter(x => x.propiedad_id === row.id)));
    filter();
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
  loadProperties();
})();
