(() => {
  'use strict';

  const products = [
    { id:'relay', name:'Relay S1', category:'single-coil', family:'Short-scale offset', finish:'Seafoam Green', color:'#83a897', price:349,
      description:'A compact offset with clear single-coil tones and a slim neck. The shorter reach makes it a comfortable first electric.',
      pickups:'Two single-coils', scale:'24 in · 22 frets', neck:'Slim C maple · maple fingerboard', bridge:'Fixed six-saddle bridge' },
    { id:'atlas', name:'Atlas T2', category:'single-coil', family:'Classic single-cut', finish:'Butterscotch', color:'#bf8242', price:499,
      description:'A bright bridge pickup and a warmer neck pickup cover country twang, blues leads, and clean indie rhythms.',
      pickups:'Two single-coils · covered neck pickup', scale:'25.5 in · 22 frets', neck:'Modern C maple · maple fingerboard', bridge:'Fixed string-through bridge' },
    { id:'vector', name:'Vector H2', category:'humbucker', family:'Dual-humbucker double-cut', finish:'Satin Charcoal', color:'#424243', price:649,
      description:'Two passive humbuckers and a 24-fret neck give this double-cut a fuller sound and room for higher-gain leads.',
      pickups:'Two passive humbuckers', scale:'25.5 in · 24 frets', neck:'Slim C maple · rosewood fingerboard', bridge:'Fixed six-saddle bridge' },
    { id:'ember', name:'Ember H3', category:'humbucker', family:'Beveled double-cut', finish:'Wine Red', color:'#681f30', price:749,
      description:'A carved-looking double-cut with beveled edges and two zebra humbuckers. The short reach and full mids suit warm leads and driven rhythm.',
      pickups:'Two passive zebra humbuckers', scale:'24.75 in · 22 frets', neck:'Rounded C maple · rosewood fingerboard', bridge:'Fixed six-saddle bridge' },
    { id:'echo', name:'Echo J3', category:'single-coil', family:'Long-scale offset', finish:'Midnight Blue Burst', color:'#172e58', price:629,
      description:'A long-scale offset for shimmering chords and defined leads, in a gloss finish that shifts from midnight navy to cobalt at the edge.',
      pickups:'Two narrow single-coils', scale:'25.5 in · 22 frets', neck:'Modern C maple · rosewood fingerboard', bridge:'Fixed six-saddle bridge' },
    { id:'drift', name:'Drift P2', category:'single-coil', family:'P-90 single-cut', finish:'Honey Ash', color:'#ae703c', price:679,
      description:'A visible-grain ash single-cut with two soapbar P-90s. A good fit for players who like the attack of a single-coil with a thicker midrange.',
      pickups:'Two soapbar P-90 single-coils', scale:'25 in · 22 frets', neck:'Soft C maple · rosewood fingerboard', bridge:'Fixed six-saddle bridge' }
  ];
  const catalog = new Map(products.map(product => [product.id, product]));
  const categories = { '':'All guitars', 'single-coil':'Single-coil', humbucker:'Humbucker' };
  const money = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
  const format = amount => money.format(amount);
  const imagePath = name => 'assets/northline-' + name + '.jpg';
  const shippingDays = '3–5 business days';
  const handlingDays = '1–2 business days';
  const returnDays = 30;
  const warranty = 'one-year';
  const slides = [
    { image:'editorial-rehearsal', alt:'Black-and-white photo of an electric guitarist in a rehearsal room', label:'NORTHLINE ELECTRIC GUITARS', title:'Find your sound.', copy:'Six solid-body electrics. From the first chord in your room to the last song of the night.', link:'#shop', action:'Shop electric guitars' },
    { image:'editorial-stage', alt:'A guitarist playing under warm stage lights', label:'THE ATLAS T2', title:'Cut through.', copy:'Classic single-coil clarity, from clean rhythms to the edge of breakup.', link:'#product/atlas', action:'Explore Atlas T2' },
    { image:'editorial-detail', alt:'Close-up of the pickups and strings on a charcoal guitar', label:'THE VECTOR H2', title:'Turn it up.', copy:'Two humbuckers, 24 frets, and a fuller sound for heavier playing.', link:'#product/vector', action:'Explore Vector H2' }
  ];
  const faq = [
    ['What’s a good first electric guitar?', 'The Relay S1 has a short 24-inch scale, a slim C neck, and a fixed bridge. It’s a good starting point for clean playing and light overdrive.'],
    ['What’s the difference between single-coils and humbuckers?', 'The Relay S1, Atlas T2, and Echo J3 use single-coils for a brighter, more defined sound. The Drift P2 uses P-90 single-coils for a stronger midrange. The Vector H2 and Ember H3 use humbuckers for a fuller sound and reduced mains hum at higher gain.'],
    ['Do I need an amplifier or a cable?', 'You can practice unplugged. To hear the pickups through an amp, use a standard ¼-inch instrument cable. Bring your own amp and instrument cable.'],
    ['What strings come on my guitar?', 'Each model ships with .010–.046 strings in standard tuning. Switching to another gauge or tuning may call for a setup.'],
    ['Where can I track my order?', 'Open your shipping confirmation once it arrives. It contains the carrier tracking link. Demo orders stay visible in My Account on this browser.'],
    ['How long does shipping take?', 'Orders generally leave within ' + handlingDays + '. Standard delivery takes another ' + shippingDays + ' within the contiguous United States. Standard shipping is free.'],
    ['How do I start a return?', 'Contact support within ' + returnDays + ' days of delivery with your order number. Return eligible guitars in original condition and packaging. See Returns & Warranty for details.'],
    ['What does the warranty cover?', 'The ' + warranty + ' limited warranty covers manufacturing defects in materials or workmanship. It excludes normal wear, accidental damage, and modifications.']
  ];
  const helpTopics = [
    ['choosing','Choosing a guitar','Compare models, pickups, and scale lengths.'],
    ['care','Setup & care','String gauges, tuning, cleaning, and storage.'],
    ['shipping','Shipping & delivery','Shipping area, timing, and tracking.'],
    ['returns','Returns & warranty','Eligibility, refunds, and warranty coverage.'],
    ['orders','Orders & account','Order history and help with order changes.'],
    ['contact','Contact support','What to include when you reach out.']
  ];

  const ui = {
    main:document.getElementById('store-view'),
    count:document.getElementById('cart-count'),
    account:document.getElementById('account-link'),
    status:document.getElementById('store-status')
  };
  const storageKey = 'northline-guitars-store-v1';
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(storageKey));
  } catch {
    stored = null;
  }
  const state = {
    cart:Object.fromEntries(Object.entries(stored?.cart || {}).filter(([id, quantity]) => catalog.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 9)),
    signedIn:stored?.signedIn === true,
    orders:Array.isArray(stored?.orders) ? stored.orders.filter(order => order && typeof order.id === 'string' && /^NL-[A-Z0-9]+$/.test(order.id) && Number.isFinite(order.created) && Array.isArray(order.lines)) : []
  };
  let activeSlide = 0;
  let noticeTimer;
  let route = '';

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The current tab still works when browser storage is unavailable.
    }
  }

  function notify(message) {
    clearTimeout(noticeTimer);
    ui.status.hidden = false;
    ui.status.textContent = message;
    noticeTimer = setTimeout(() => { ui.status.hidden = true; }, 3200);
  }

  function cartLines() {
    return Object.entries(state.cart).map(([id, quantity]) => ({ product:catalog.get(id), quantity }));
  }

  function updateHeader() {
    const count = cartLines().reduce((total, line) => total + line.quantity, 0);
    ui.count.textContent = count;
    ui.count.setAttribute('aria-label', count + (count === 1 ? ' item' : ' items'));
    ui.account.textContent = state.signedIn ? 'My account' : 'Sign in';
    for (const link of document.querySelectorAll('.main-nav a')) {
      if (link.hash.slice(1) === route) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
  }

  const pageHeading = (title, description, label = '') => `
    <header class="page-heading">${label ? `<p class="eyebrow">${label}</p>` : ''}
      <h1>${title}</h1>${description ? `<p>${description}</p>` : ''}
    </header>`;

  function productPhotos(product, { eager = false } = {}) {
    const alt = product.name + ' electric guitar in ' + product.finish;
    return `<span class="product-photos" data-photo="scene">
      <img class="photo-scene" src="${imagePath(product.id + '-scene')}" width="920" height="920" loading="${eager ? 'eager' : 'lazy'}" alt="${alt}">
      <img class="photo-studio" src="${imagePath(product.id + '-studio')}" width="920" height="920" loading="${eager ? 'eager' : 'lazy'}" alt="">
    </span>`;
  }

  function card(product, heading = 'h2') {
    const link = '#product/' + product.id;
    return `<article class="product-card">
      <a class="product-image" href="${link}" aria-label="View ${product.name}">
        ${productPhotos(product)}
      </a>
      <div class="product-copy"><p class="eyebrow">${product.family}</p>
        <div class="product-row"><${heading}><a href="${link}">${product.name}</a></${heading}><span class="price">${format(product.price)}</span></div>
        <p>${product.description}</p>
      </div>
    </article>`;
  }

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];
    document.getElementById('hero-image').src = imagePath(slide.image);
    document.getElementById('hero-image').alt = slide.alt;
    document.getElementById('hero-label').textContent = slide.label;
    document.getElementById('hero-title').textContent = slide.title;
    document.getElementById('hero-copy').textContent = slide.copy;
    const link = document.getElementById('hero-link');
    link.href = slide.link;
    link.textContent = slide.action;
    for (const [position, button] of [...document.querySelectorAll('.hero-dots button')].entries()) {
      button.setAttribute('aria-current', String(position === activeSlide));
    }
  }

  function home() {
    const slide = slides[activeSlide];
    return `<section class="hero" aria-roledescription="carousel" aria-label="Featured guitars">
      <img id="hero-image" src="${imagePath(slide.image)}" alt="${slide.alt}" fetchpriority="high">
      <div class="container hero-inner" aria-live="polite">
        <p class="eyebrow" id="hero-label">${slide.label}</p><h1 id="hero-title">${slide.title}</h1>
        <p id="hero-copy">${slide.copy}</p><a class="button light" id="hero-link" href="${slide.link}">${slide.action}</a>
      </div>
      <div class="container hero-controls">
        <div class="hero-dots">${slides.map((item, index) => `<button type="button" data-slide="${index}" aria-label="Show slide ${index + 1}: ${item.title}" aria-current="${index === activeSlide}"></button>`).join('')}</div>
        <div class="hero-nav"><button type="button" data-action="previous-slide" aria-label="Previous slide">‹</button><button type="button" data-action="next-slide" aria-label="Next slide">›</button></div>
      </div>
    </section>
    <section class="container lineup">
      <div class="section-head"><div><h2>The lineup</h2><p class="section-intro">Compare six solid-body electrics.</p></div><a href="#shop">View all guitars</a></div>
      <div class="product-grid">${products.map(product => card(product, 'h3')).join('')}</div>
    </section>
    <section class="story story-grid">
      <img src="${imagePath('guitars-hero')}" loading="lazy" width="1536" height="1024" alt="A seafoam-green electric guitar and amp in a studio">
      <div class="story-copy"><h2>Built around how you play</h2><p>Explore compact offsets, classic single-cuts, and double-cuts. Each model has its own feel, from the short-scale Relay S1 to the longer, 24-fret Vector H2.</p><a href="#about">About Northline</a></div>
    </section>`;
  }

  function shop(category) {
    const label = categories[category];
    const selection = category ? products.filter(product => product.category === category) : products;
    return `<section class="container page">
      ${pageHeading(category ? label + ' guitars' : 'Electric guitars', 'Compare pickup configurations, scale lengths, and finishes. All prices in USD.')}
      <nav class="category-nav" aria-label="Guitar categories">
        ${Object.entries(categories).map(([id, name]) => `<a href="#shop${id ? '/' + id : ''}" ${id === category ? 'aria-current="page"' : ''}>${name}</a>`).join('')}
      </nav>
      <div class="product-grid">${selection.map(product => card(product)).join('')}</div>
    </section>`;
  }

  function productPage(product) {
    return `<section class="container page product-page">
      <p class="breadcrumb"><a href="#shop">Electric guitars</a> / <a href="#shop/${product.category}">${categories[product.category]}</a></p>
      <div class="product-layout">
        <div class="product-gallery">
          ${productPhotos(product, { eager:true })}
          <div class="photo-controls" role="group" aria-label="Product photo">
            <button type="button" data-photo-view="scene" aria-pressed="true">Lifestyle</button>
            <button type="button" data-photo-view="studio" aria-pressed="false">White background</button>
          </div>
        </div>
        <div><p class="eyebrow">${product.family}</p><h1>${product.name}</h1><p class="price">${format(product.price)}</p>
          <p class="product-description">${product.description}</p>
          <p class="finish"><span style="background:${product.color}" aria-hidden="true"></span>${product.finish}</p>
          <form class="product-actions" data-add="${product.id}">
            <label>Quantity<select name="quantity">${Array.from({length:9}, (_, index) => `<option>${index + 1}</option>`).join('')}</select></label>
            <button class="button" type="submit">Add to cart</button><a class="button outline" href="#cart">View cart</a>
          </form>
          <dl class="product-specs"><dt>Pickups</dt><dd>${product.pickups}</dd><dt>Scale</dt><dd>${product.scale}</dd>
            <dt>Neck</dt><dd>${product.neck}</dd><dt>Bridge</dt><dd>${product.bridge}</dd>
            <dt>Strings</dt><dd>.010–.046 · standard tuning</dd><dt>In the box</dt><dd>Guitar and adjustment wrench</dd></dl>
          <p class="policy-links"><a href="#help/shipping">Free standard shipping</a><a href="#help/returns">${returnDays}-day returns</a><a href="#help/choosing">Help choosing a guitar</a></p>
        </div>
      </div>
    </section>`;
  }

  function about() {
    return `<section class="container page">
      ${pageHeading('About Northline', 'We make solid-body instruments for the different ways people play.', 'ABOUT US')}
      <div class="product-layout">
        <div class="prose"><h2>Find the feel and sound you want</h2><p>Start with the compact Relay S1, the classic Atlas T2, or the long-scale Echo J3 for clean single-coil sounds. The Drift P2 adds the thicker midrange of P-90s. For humbuckers, compare the 24-fret Vector H2 with the shorter-scale Ember H3.</p>
          <h2>What the guitars share</h2><p>Every model has a fixed bridge, standard .010–.046 strings, and a clear set of specs so you can compare scale length, pickups, and neck profiles before choosing.</p>
          <h2>Help before and after you buy</h2><p>Our Help Center covers choosing a model, getting set up, shipping, and returns. If you’re deciding between two guitars, tell support what you play and which amp you use.</p>
          <p><a href="#shop">Compare the guitars</a> · <a href="#help">Visit the Help Center</a></p>
        </div>
        <figure class="story" style="margin:0"><img src="${imagePath('editorial-stage')}" alt="An electric guitarist performing under amber lights" loading="lazy"></figure>
      </div>
    </section>`;
  }

  function faqRows(items) {
    return items.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('');
  }

  function helpHome() {
    return `<section class="container page">
      ${pageHeading('Help Center', 'Find answers about choosing a guitar, setup, delivery, and returns.')}
      <div class="help-search"><label class="field">Search help articles<input type="search" id="help-search" placeholder="Try pickups, strings, or shipping" aria-controls="help-results"></label></div>
      <div class="link-grid" id="help-topics">${helpTopics.map(([id,title,description]) => `<a class="help-card" href="#help/${id}"><h2>${title}</h2><p>${description}</p></a>`).join('')}</div>
      <section class="help-results"><h2 id="help-result-title">Popular questions</h2><p id="help-result-status" class="small" role="status"></p><div id="help-results">${faqRows(faq)}</div></section>
    </section>`;
  }

  function helpPage(id) {
    const topic = helpTopics.find(entry => entry[0] === id);
    const contents = {
      choosing:`<div class="help-results">${faqRows(faq.slice(0,3))}</div><h2>Compare the lineup</h2><ul>${products.map(product => `<li><a href="#product/${product.id}">${product.name}</a> · ${product.scale} · ${product.pickups}</li>`).join('')}</ul>`,
      care:`<h2>Before your first session</h2><p>Tune to E–A–D–G–B–E, use a standard ¼-inch instrument cable, and start with your amp volume low.</p><h2>Changing strings</h2><p>${faq[3][1]} Change one string at a time if you want to keep the other strings close to pitch.</p><h2>Cleaning and storage</h2><p>Use a clean, dry microfiber cloth on the body and strings after playing. Store the guitar away from direct heat, sunlight, and sudden changes in humidity.</p>`,
      shipping:`<h2>Where we ship</h2><p>Standard shipping is free within the contiguous United States. The storefront displays prices in USD.</p><h2>When your order arrives</h2><p>${faq[5][1]}</p><h2>Tracking a shipment</h2><p>${faq[4][1]} Contact support with your order number if tracking stalls or the package appears damaged.</p>`,
      returns:`<h2>${returnDays}-day return window</h2><p>${faq[6][1]} Contact support for return instructions before shipping and keep your drop-off receipt. If the guitar arrived damaged or incorrect, include photos so support can arrange the right next step.</p><h2>Refunds</h2><p>After an eligible return is received and inspected, refunds go back to the original payment method. It may take another 5–10 business days for the credit to appear.</p><h2>Limited warranty</h2><p>${faq[7][1]} Have your order number, model name, and photos of the issue ready.</p>`,
      orders:`<h2>Order history</h2><p>Open <a href="#account">My account</a> to view demo orders placed in this browser. You can also follow the order link on the checkout confirmation page.</p><h2>Change or cancel an order</h2><p>Contact support promptly with your order number and the requested change. Once an order has shipped, use the <a href="#help/returns">returns process</a> if it’s eligible.</p><h2>Tracking</h2><p>See <a href="#help/shipping">Shipping &amp; delivery</a> for transit estimates and tracking details.</p>`,
      contact:`<h2>Chat with Northline</h2><p>Open the chat bubble when it appears on the site. For model advice, share the style you play, the guitar you’re considering, and the amp you use.</p><h2>Help with a delivery or return</h2><p>Have the order number and model name handy. For shipping damage, include photos of the packaging and the instrument.</p><h2>Support hours</h2><p>Monday–Friday, 9 am–6 pm Pacific, excluding public holidays.</p><p><a href="#help">Browse help articles</a></p>`
    };
    return `<section class="container page narrow"><p class="breadcrumb"><a href="#help">Help Center</a></p>${pageHeading(topic[1], topic[2])}<div class="prose">${contents[id]}</div></section>`;
  }

  function totals(subtotal) {
    return `<dl><div><dt>Subtotal</dt><dd>${format(subtotal)}</dd></div><div><dt>Standard shipping</dt><dd>Free</dd></div><div class="total"><dt>Demo total</dt><dd>${format(subtotal)}</dd></div></dl>`;
  }

  function cart() {
    const lines = cartLines();
    if (!lines.length) return `<section class="container page narrow">${pageHeading('Your cart', 'Your cart is empty.')}<a class="button" href="#shop">Shop electric guitars</a></section>`;
    const subtotal = lines.reduce((sum, {product, quantity}) => sum + product.price * quantity, 0);
    return `<section class="container page">
      ${pageHeading('Your cart', 'Review your guitars and quantities.')}
      <div class="cart-layout">
        <div>${lines.map(({product, quantity}) => `<article class="cart-item"><a href="#product/${product.id}" aria-label="View ${product.name}"><img src="${imagePath(product.id + '-scene')}" width="920" height="920" alt=""></a>
          <div><h2><a href="#product/${product.id}">${product.name}</a></h2><p>${product.finish} · ${format(product.price)} each</p>
            <div class="cart-controls"><button type="button" data-action="less" data-product="${product.id}" aria-label="Decrease ${product.name} quantity" ${quantity === 1 ? 'disabled' : ''}>−</button><span class="quantity">${quantity}</span>
              <button type="button" data-action="more" data-product="${product.id}" aria-label="Increase ${product.name} quantity" ${quantity === 9 ? 'disabled' : ''}>+</button>
              <button type="button" data-action="remove" data-product="${product.id}" aria-label="Remove ${product.name}">Remove</button></div></div>
          <span class="price">${format(product.price * quantity)}</span></article>`).join('')}
          <p class="policy-links"><a href="#shop">Continue shopping</a></p>
        </div>
        <aside class="cart-summary"><h2>Order summary</h2>${totals(subtotal)}<a class="button" href="#checkout">Checkout</a></aside>
      </div>
    </section>`;
  }

  function checkout() {
    const lines = cartLines();
    if (!lines.length) return cart();
    const subtotal = lines.reduce((sum, {product, quantity}) => sum + product.price * quantity, 0);
    return `<section class="container page narrow">${pageHeading('Checkout', 'Place a demo order. No delivery address or payment details are needed.')}
      <div class="cart-summary"><h2>Review your order</h2><ul>${lines.map(({product, quantity}) => `<li>${product.name} · ${quantity} × ${format(product.price)}</li>`).join('')}</ul>${totals(subtotal)}
        <form id="checkout-form"><button class="button" type="submit">Place demo order</button></form>
      </div><p class="policy-links"><a href="#cart">Return to cart</a></p>
    </section>`;
  }

  function orderCard(order) {
    const lines = order.lines.filter(line => line && catalog.has(line.id) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 9);
    return `<article class="order-box"><h2>Order ${order.id}</h2><p class="small">Demo order · ${new Date(order.created).toLocaleDateString('en-US')}</p>
      <ul>${lines.map(line => `<li><a href="#product/${line.id}">${catalog.get(line.id).name}</a> × ${line.quantity}</li>`).join('')}</ul>
      <p><strong>Total ${format(lines.reduce((sum, line) => sum + catalog.get(line.id).price * line.quantity, 0))}</strong></p></article>`;
  }

  function account() {
    if (!state.signedIn) return `<section class="container page narrow">${pageHeading('Sign in', 'Use the demo account to view orders placed in this browser.')}
      <div class="order-box"><h2>Northline demo account</h2><p>Open the account with one click. Your demo orders are saved on this device.</p>
        <div class="form-actions"><button class="button" type="button" data-action="sign-in">Sign in to demo account</button></div>
      </div></section>`;
    return `<section class="container page narrow">${pageHeading('My account', 'View your Northline demo orders.')}
      <button class="button outline" type="button" data-action="sign-out">Sign out</button>
      <div class="orders">${state.orders.length ? state.orders.map(orderCard).join('') : '<p>No orders yet. <a href="#shop">Explore the guitar lineup</a>.</p>'}</div>
    </section>`;
  }

  function orderPage(id) {
    const order = state.orders.find(item => item.id === id);
    if (!order) return missing();
    return `<section class="container page narrow">${pageHeading('Order confirmed', 'Your demo order was saved to this browser.')}${orderCard(order)}
      <div class="form-actions"><a class="button" href="#account">View my account</a><a class="button outline" href="#shop">Continue shopping</a></div>
    </section>`;
  }

  function missing() {
    return `<section class="container page narrow">${pageHeading('Page not found', 'Try the guitar lineup or Help Center to find what you’re looking for.')}<a class="button" href="#shop">Explore the lineup</a></section>`;
  }

  function render({ reset = false, focus = false } = {}) {
    const hash = location.hash.slice(1);
    route = !hash || hash === 'chat-demo' ? 'home' : hash;
    const [section, id, extra] = route.split('/');
    let markup = missing();
    if (extra === undefined) {
      if (section === 'home' && !id) markup = home();
      if (section === 'shop' && Object.hasOwn(categories, id || '')) markup = shop(id || '');
      if (section === 'product' && catalog.has(id)) markup = productPage(catalog.get(id));
      if (section === 'about' && !id) markup = about();
      if (section === 'help' && !id) markup = helpHome();
      if (section === 'help' && helpTopics.some(topic => topic[0] === id)) markup = helpPage(id);
      if (section === 'cart' && !id) markup = cart();
      if (section === 'checkout' && !id) markup = checkout();
      if (section === 'account' && !id) markup = account();
      if (section === 'order' && id) markup = orderPage(id);
    }
    ui.main.innerHTML = markup;
    const heading = ui.main.querySelector('h1');
    document.title = route === 'home' ? 'Northline Guitars | Electric Guitars' : heading.textContent + ' | Northline Guitars';
    updateHeader();
    if (reset) window.scrollTo(0, 0);
    if (focus) ui.main.focus({ preventScroll:true });
  }

  ui.main.addEventListener('input', event => {
    if (event.target.id !== 'help-search') return;
    const query = event.target.value.trim().toLowerCase();
    const words = query.split(/\s+/);
    const results = faq.filter(entry => words.every(word => entry.join(' ').toLowerCase().includes(word)));
    document.getElementById('help-topics').hidden = Boolean(query);
    document.getElementById('help-result-title').textContent = query ? 'Search results' : 'Popular questions';
    document.getElementById('help-result-status').textContent = query ? results.length + (results.length === 1 ? ' result' : ' results') : '';
    document.getElementById('help-results').innerHTML = results.length ? faqRows(results) : '<p>Try a shorter search, such as pickups, strings, or shipping.</p>';
  });

  ui.main.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.photoView) {
      const gallery = button.closest('.product-gallery');
      gallery.querySelector('.product-photos').dataset.photo = button.dataset.photoView;
      for (const control of gallery.querySelectorAll('[data-photo-view]')) {
        control.setAttribute('aria-pressed', String(control === button));
      }
      return;
    }
    if (button.dataset.slide !== undefined) showSlide(Number(button.dataset.slide));
    const { action, product:id } = button.dataset;
    if (action === 'previous-slide') showSlide(activeSlide - 1);
    if (action === 'next-slide') showSlide(activeSlide + 1);
    if (action === 'sign-in' || action === 'sign-out') {
      state.signedIn = action === 'sign-in';
      persist();
      render({ focus:true });
      notify(state.signedIn ? 'Signed in to the demo account.' : 'Signed out.');
    }
    if (!catalog.has(id)) return;
    const quantity = state.cart[id] || 0;
    if (action === 'more') state.cart[id] = Math.min(9, quantity + 1);
    if (action === 'less') state.cart[id] = Math.max(1, quantity - 1);
    if (action === 'remove') delete state.cart[id];
    persist();
    render();
    const previous = ui.main.querySelector(`[data-action="${action}"][data-product="${id}"]:not(:disabled)`);
    if (previous) previous.focus({ preventScroll:true });
    else ui.main.focus({ preventScroll:true });
  });

  ui.main.addEventListener('submit', event => {
    const form = event.target;
    const id = form.dataset.add;
    if (catalog.has(id)) {
      event.preventDefault();
      const quantity = Number(new FormData(form).get('quantity'));
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9) return;
      const current = state.cart[id] || 0;
      const added = Math.min(quantity, 9 - current);
      if (!added) {
        notify('Your cart already contains 9 of this guitar.');
        return;
      }
      state.cart[id] = current + added;
      persist();
      updateHeader();
      notify(added + ' × ' + catalog.get(id).name + ' added to your cart.');
    }
    if (form.id === 'checkout-form') {
      event.preventDefault();
      const lines = cartLines().map(({product, quantity}) => ({ id:product.id, quantity }));
      if (!lines.length) return;
      const created = Date.now();
      const order = { id:'NL-' + created.toString(36).toUpperCase(), created, lines };
      state.orders.unshift(order);
      state.cart = {};
      persist();
      location.hash = '#order/' + order.id;
    }
  });

  window.addEventListener('hashchange', () => render({ reset:true, focus:true }));
  render();
})();
