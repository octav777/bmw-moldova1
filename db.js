/**
 * BMW Moldova — Backend (localStorage)
 * Gestioneaza: masini, recenzii, mesaje contact, setari
 * Include in TOATE paginile inainte de orice alt script
 */

const BMWDB = (() => {

  /* ---- KEYS ---- */
  const KEYS = {
    cars:     'bmw_cars',
    reviews:  'bmw_reviews',
    messages: 'bmw_messages',
    theme:    'bmw_theme',
  };

  /* ---- HELPERS ---- */
  const get  = k => { try { return JSON.parse(localStorage.getItem(k)) || null; } catch{ return null; } };
  const set  = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const uid  = () => '_' + Math.random().toString(36).slice(2,9);
  const now  = () => new Date().toISOString();

  /* ---- SEED DATA (if empty) ---- */
  function seed() {
    if (get(KEYS.cars)) return; // already seeded
    const cars = [
      { id:'c1', series:'E46', model:'320i', year:2003, price:4500, motor:'2.0L 150cp', km:178000, culoare:'Argintiu', combustibil:'Benzina', cutie:'Manuala', desc:'Stare excelenta, revizii la zi, fara rugina.', badge:'Disponibil', imgs:[], active:true },
      { id:'c2', series:'E39', model:'530d', year:2002, price:5200, motor:'3.0L 184cp', km:220000, culoare:'Negru',    combustibil:'Diesel',  cutie:'Automata', desc:'Motor perfect, are revizie recenta si anvelope noi.',  badge:'Top Oferta', imgs:[], active:true },
      { id:'c3', series:'E60', model:'525i', year:2006, price:6800, motor:'2.5L 218cp', km:195000, culoare:'Albastru', combustibil:'Benzina', cutie:'Automata', desc:'Full option, climatronic, scaune incalzite.',          badge:'',           imgs:[], active:true },
      { id:'c4', series:'F30', model:'330i', year:2014, price:11500,motor:'2.0T 252cp', km:98000,  culoare:'Alb',      combustibil:'Benzina', cutie:'Automata', desc:'M Sport, xenon LED, navigatie profesionala.',          badge:'Nou in stoc', imgs:[], active:true },
      { id:'c5', series:'G30', model:'530i', year:2020, price:24000,motor:'2.0T 252cp', km:32000,  culoare:'Alb',      combustibil:'Benzina', cutie:'Automata', desc:'Garantie fabrica, full option, ca nou.',               badge:'Premium',     imgs:[], active:true },
      { id:'c6', series:'E46', model:'330ci',year:2004, price:5800, motor:'3.0L 231cp', km:160000, culoare:'Portocaliu',combustibil:'Benzina',cutie:'Manuala',  desc:'Editie M Sport, esapament sport, jante 18".',         badge:'M Sport',     imgs:[], active:true },
    ];
    set(KEYS.cars, cars);

    const reviews = {
      c1:[{ id:uid(), rating:4, text:'Masina frumoasa, am fost multumit!', date:now() }],
      c2:[{ id:uid(), rating:5, text:'Diesel perfect, merge ca un ceas.', date:now() }],
      c4:[{ id:uid(), rating:5, text:'M Sport arata spectaculos!', date:now() }],
    };
    set(KEYS.reviews, reviews);
    set(KEYS.messages, []);
  }

  /* =================== CARS API =================== */
  const Cars = {

    getAll() { return get(KEYS.cars) || []; },

    getActive() { return this.getAll().filter(c => c.active); },

    getById(id) { return this.getAll().find(c => c.id === id) || null; },

    add(data) {
      const cars = this.getAll();
      const car = { id: uid(), active:true, ...data, createdAt: now() };
      cars.unshift(car);
      set(KEYS.cars, cars);
      return car;
    },

    update(id, data) {
      const cars = this.getAll();
      const i = cars.findIndex(c => c.id === id);
      if(i < 0) return null;
      cars[i] = { ...cars[i], ...data, updatedAt: now() };
      set(KEYS.cars, cars);
      return cars[i];
    },

    delete(id) {
      const cars = this.getAll().filter(c => c.id !== id);
      set(KEYS.cars, cars);
    },

    filter({ series, yearRange, priceSort } = {}) {
      let list = this.getActive();
      if(series && series !== 'all') list = list.filter(c => c.series.toLowerCase() === series);
      if(yearRange) {
        const [min, max] = yearRange;
        list = list.filter(c => c.year >= min && (!max || c.year <= max));
      }
      if(priceSort === 'low')  list.sort((a,b) => a.price - b.price);
      if(priceSort === 'high') list.sort((a,b) => b.price - a.price);
      return list;
    }
  };

  /* =================== REVIEWS API =================== */
  const Reviews = {

    getForCar(carId) {
      const all = get(KEYS.reviews) || {};
      return all[carId] || [];
    },

    add(carId, { rating, text }) {
      const all = get(KEYS.reviews) || {};
      if(!all[carId]) all[carId] = [];
      const r = { id: uid(), rating: Number(rating), text, date: now() };
      all[carId].unshift(r);
      set(KEYS.reviews, all);
      return r;
    },

    avgRating(carId) {
      const revs = this.getForCar(carId);
      if(!revs.length) return 0;
      return revs.reduce((s,r) => s + r.rating, 0) / revs.length;
    }
  };

  /* =================== MESSAGES API =================== */
  const Messages = {
    getAll() { return get(KEYS.messages) || []; },
    add(data) {
      const msgs = this.getAll();
      msgs.unshift({ id: uid(), ...data, date: now(), read: false });
      set(KEYS.messages, msgs);
    }
  };

  /* =================== THEME =================== */
  const Theme = {
    get()  { return localStorage.getItem(KEYS.theme) || 'dark'; },
    set(v) { localStorage.setItem(KEYS.theme, v); document.documentElement.setAttribute('data-theme', v); },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
    init()   { document.documentElement.setAttribute('data-theme', this.get()); }
  };

  /* =================== INIT =================== */
  seed();
  Theme.init();

  return { Cars, Reviews, Messages, Theme };
})();

/* =================== SHARED UI HELPERS =================== */

// Toast notification
function showToast(msg, type = 'info') {
  let t = document.getElementById('_toast');
  if(!t) {
    t = document.createElement('div');
    t.id = '_toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast ' + type;
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

// Stars render
function starsHTML(rating = 0) {
  const r = Math.round(rating);
  return Array.from({length:5}, (_,i) => `<span style="color:${i<r?'var(--gold)':'var(--dark4)'}">${i<r?'★':'★'}</span>`).join('');
}

// Format price
function fmtPrice(n) { return '€' + Number(n).toLocaleString('ro-RO'); }

// Format date
function fmtDate(iso) { return new Date(iso).toLocaleDateString('ro-RO', {day:'2-digit',month:'short',year:'numeric'}); }

// Init shared nav behaviours (call after DOMContentLoaded)
function initNav(activeHref) {
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if(themeBtn) {
    themeBtn.addEventListener('click', () => {
      BMWDB.Theme.toggle();
      if(themeIcon) themeIcon.className = BMWDB.Theme.get() === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
    });
    if(themeIcon) themeIcon.className = BMWDB.Theme.get() === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
  }

  // Mobile menu
  const menuIcon = document.getElementById('menu-icon');
  const nav = document.querySelector('nav');
  if(menuIcon && nav) {
    menuIcon.addEventListener('click', () => nav.classList.toggle('open'));
    window.addEventListener('scroll', () => nav.classList.remove('open'));
  }

  // Active link
  if(activeHref) {
    document.querySelectorAll('nav a').forEach(a => {
      if(a.getAttribute('href') === activeHref) a.classList.add('active-link');
    });
  }

  // Header shadow
  window.addEventListener('scroll', () => {
    const h = document.querySelector('header');
    if(h) h.style.borderBottomColor = window.scrollY > 10 ? 'rgba(217,4,41,.3)' : 'var(--border)';
  });
}

// Shared header HTML — insert via JS so we don't repeat it in every file
function renderHeader(activePage) {
  const pages = {
    home:    { href:'index.html',      label:'Home' },
    cars:    { href:'CarsPage.html',   label:'Automobile' },
    addcar:  { href:'Page1.html',      label:'Adauga Anunt' },
    events:  { href:'index.html#events',label:'Evenimente' },
    contact: { href:'index.html#contact',label:'Contact' },
  };

  return `
  <header>
    <a href="index.html" class="logo">BMW<span>Moldova</span></a>
    <nav id="main-nav">
      <ul>
        <li><a href="index.html" ${activePage==='home'?'class="active-link"':''}>Home</a></li>
        <li><a href="CarsPage.html" ${activePage==='cars'?'class="active-link"':''}>Automobile</a></li>
        <li class="dropdown">
          <button class="dropbtn">Servicii <i class='bx bx-chevron-down'></i></button>
          <div class="dropdown-menu">
            <a href="Servis.html">Servisuri</a>
            <a href="MotorsPage.html">Motoristi</a>
            <a href="Electrici.html">Electrici</a>
            <a href="MotorsPage.html">Specialisti Caroserie</a>
            <a href="MotorsPage.html">Specialisti Sasiu</a>
            <a href="Servis.html">Maliar</a>
            <a href="tel:068264001" class="call-btn">📞 Suna Acum</a>
          </div>
        </li>
        <li><a href="index.html#events">Evenimente</a></li>
        <li><a href="Page1.html" ${activePage==='addcar'?'class="active-link"':''}>+ Adauga Anunt</a></li>
        <li><a href="index.html#contact">Contact</a></li>
      </ul>
    </nav>
    <div class="nav-controls">
      <button class="icon-btn" id="theme-toggle" title="Tema"><i class='bx bx-moon' id="theme-icon"></i></button>
      <button id="menu-icon"><i class='bx bx-menu'></i></button>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo">BMW<span>Moldova</span></a>
        <p>"Alege BMW Respect, ca la volan sa fii expert."</p>
        <div class="footer-social">
          <a href="#" class="social-icon"><i class='bx bxl-facebook'></i></a>
          <a href="#" class="social-icon"><i class='bx bxl-instagram'></i></a>
          <a href="#" class="social-icon"><i class='bx bxl-tiktok'></i></a>
          <a href="tel:068264001" class="social-icon"><i class='bx bx-phone'></i></a>
        </div>
      </div>
      <div class="footer-col"><h4>Pagini</h4><ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="CarsPage.html">Automobile</a></li>
        <li><a href="index.html#events">Evenimente</a></li>
        <li><a href="index.html#contact">Contact</a></li>
      </ul></div>
      <div class="footer-col"><h4>Servicii</h4><ul>
        <li><a href="Servis.html">Servisuri</a></li>
        <li><a href="MotorsPage.html">Motoristi</a></li>
        <li><a href="Electrici.html">Electrici</a></li>
        <li><a href="MotorsPage.html">Caroserie & Sasiu</a></li>
      </ul></div>
      <div class="footer-col"><h4>Legal</h4><ul>
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Termeni</a></li>
        <li><a href="#">Cookies</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>© 2024 BMW Moldova. All rights reserved.</span>
      <span>Made with ❤️ for BMW enthusiasts</span>
    </div>
  </footer>`;
}
