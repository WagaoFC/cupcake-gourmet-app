(() => {
    const keys = { products: 'doce-forno.products.v1', cart: 'doce-forno.cart.v1', orders: 'doce-forno.orders.v1' };
    const sampleProducts = [
        { id: 'framboesa', name: 'Baunilha & framboesa', category: 'Frutados', description: 'Massa leve de baunilha, recheio de framboesa e cobertura delicada de cream cheese.', price: 14.5, stock: 12, tone: 'berry' },
        { id: 'chocolate', name: 'Chocolate salgado', category: 'Chocolate', description: 'Chocolate intenso, caramelo macio e um toque final de flor de sal.', price: 16, stock: 8, tone: 'cocoa' },
        { id: 'limao', name: 'Limão siciliano', category: 'Cítricos', description: 'Massa cítrica e fresca, com cobertura de merengue tostado.', price: 13, stock: 10, tone: 'citrus' },
        { id: 'pistache', name: 'Pistache & rosa', category: 'Especiais', description: 'Pistache torrado, baunilha e um perfume sutil de água de rosas.', price: 17.5, stock: 6, tone: 'pistachio' },
        { id: 'cenoura', name: 'Cenoura & cacau', category: 'Chocolate', description: 'Massa úmida de cenoura com ganache de chocolate meio amargo.', price: 12.5, stock: 0, tone: 'carrot' },
        { id: 'coco', name: 'Coco tostado', category: 'Especiais', description: 'Coco fresco, baunilha e cobertura cremosa levemente tostada.', price: 14, stock: 9, tone: 'coconut' }
    ];
    const root = document.querySelector('#view-root');
    const notice = document.querySelector('#announcement');
    let categoryFilter = 'Todos';
    let search = '';
    let noticeTimer;

    function read(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
        catch (error) { console.warn('Falha ao ler dados locais.', error); return fallback; }
    }
    function save(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (error) { console.warn('Falha ao salvar dados locais.', error); announce('Não foi possível salvar. Verifique o espaço disponível no navegador.'); return false; }
    }
    const products = () => read(keys.products, sampleProducts);
    const cart = () => read(keys.cart, {});
    const orders = () => read(keys.orders, []);
    const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const safe = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const route = () => location.hash.replace(/^#\/?/, '') || 'catalogo';

    function announce(message) {
        notice.textContent = message;
        notice.hidden = false;
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => { notice.hidden = true; }, 3200);
    }
    function updateHeader() {
        const itemCount = Object.values(cart()).reduce((sum, amount) => sum + Number(amount), 0);
        document.querySelector('#cart-count').textContent = itemCount;
        document.querySelector('.cart-link').setAttribute('aria-label', `Sacola, ${itemCount} itens`);
        const section = route().split('/')[0];
        document.querySelectorAll('[data-nav]').forEach((link) => {
            const active = link.dataset.nav === section || (section === 'produto' && link.dataset.nav === 'catalogo');
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
    }
    function productCard(item) {
        const sold = Number(item.stock) < 1;
        return `<article class="product-card tone-${safe(item.tone)}"><a class="product-art" href="#/produto/${encodeURIComponent(item.id)}" aria-label="Ver ${safe(item.name)}"><span class="cupcake-illustration" aria-hidden="true"><i></i><b></b><em></em></span><span class="art-caption">feito em pequenos lotes</span></a><div class="product-meta"><span>${safe(item.category)}</span><strong>${money(item.price)}</strong></div><h3><a href="#/produto/${encodeURIComponent(item.id)}">${safe(item.name)}</a></h3><p>${safe(item.description)}</p><div class="product-bottom"><span class="stock ${sold ? 'sold' : ''}">${sold ? 'Esgotado hoje' : `${item.stock} disponíveis`}</span><button class="text-action" data-action="add" data-id="${safe(item.id)}" ${sold ? 'disabled' : ''}>${sold ? 'Indisponível' : 'Adicionar +'}</button></div></article>`;
    }
    function renderCatalog() {
        const all = products();
        const categories = ['Todos', ...new Set(all.map((item) => item.category))];
        const visible = all.filter((item) => (categoryFilter === 'Todos' || item.category === categoryFilter) && `${item.name} ${item.description}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
        root.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">ATELIÊ DE CUPCAKES · PEQUENOS LOTES</p><h1>Um intervalo<br>com gosto de <em>festa.</em></h1><p>Cupcakes autorais, assados em pequenos lotes e finalizados com calma.</p><a class="button button-dark" href="#cardapio">Explorar o cardápio <span aria-hidden="true">↓</span></a><small class="hero-caption">VITRINE DE DEMONSTRAÇÃO · SEM COBRANÇA</small></div><div class="hero-art"><img src="./image.jfif" alt="Cupcake Gourmet, imagem do projeto"><span class="round-stamp">feito<br>com afeto</span><span class="hero-side-note">COZINHA ARTESANAL · DESDE 2024</span></div></section><section id="cardapio" class="catalog-section"><div class="section-title"><div><p class="eyebrow">DA NOSSA COZINHA</p><h2>O cardápio de hoje</h2></div><label class="search-box"><span aria-hidden="true">⌕</span><input id="product-search" type="search" value="${safe(search)}" placeholder="Buscar sabor" aria-label="Buscar cupcake"></label></div><div class="catalog-tools"><div class="filters">${categories.map((name) => `<button class="filter ${name === categoryFilter ? 'selected' : ''}" data-action="filter" data-category="${safe(name)}" aria-pressed="${name === categoryFilter}">${safe(name)}</button>`).join('')}</div><span class="result-count">${visible.length} sabores</span></div>${visible.length ? `<div class="product-grid">${visible.map(productCard).join('')}</div>` : '<p class="empty-state">Nenhum sabor encontrado com esse filtro.</p>'}</section><section class="local-note"><span aria-hidden="true">i</span><p><strong>Modo de estudo.</strong> Sacola, estoque e pedidos ficam salvos só neste navegador.</p><button class="text-action" data-action="reset">Reiniciar demonstração</button></section>`;
    }
    function renderProduct(id) {
        const item = products().find((product) => product.id === decodeURIComponent(id));
        if (!item) return renderNotFound();
        const sold = Number(item.stock) < 1;
        root.innerHTML = `<section class="detail-page"><a class="back-link" href="#/catalogo">← Voltar ao cardápio</a><div class="detail-grid"><div class="detail-art tone-${safe(item.tone)}"><span class="cupcake-illustration" aria-hidden="true"><i></i><b></b><em></em></span></div><div class="detail-copy"><p class="eyebrow">${safe(item.category)} · PEQUENO LOTE</p><h1>${safe(item.name)}</h1><p class="detail-description">${safe(item.description)}</p><p class="detail-price">${money(item.price)} <small>/ unidade</small></p><p class="stock ${sold ? 'sold' : ''}">${sold ? 'Esgotado neste lote' : `${item.stock} unidades disponíveis`}</p><button class="button button-dark full-button" data-action="add" data-id="${safe(item.id)}" ${sold ? 'disabled' : ''}>${sold ? 'Indisponível' : 'Adicionar à sacola'}</button><p class="fine-print">Pedido demonstrativo: não há cobrança nem envio para uma loja.</p></div></div></section>`;
    }
    function renderCart() {
        const all = products();
        const currentCart = cart();
        const entries = Object.entries(currentCart).map(([id, quantity]) => ({ item: all.find((product) => product.id === id), quantity: Number(quantity) })).filter(({ item, quantity }) => item && quantity > 0);
        const total = entries.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
        root.innerHTML = `<section class="checkout-page"><a class="back-link" href="#/catalogo">← Continuar escolhendo</a><p class="eyebrow">SUA SACOLA</p><h1>Quase na hora<br>do primeiro pedaço.</h1>${entries.length ? `<div class="checkout-grid"><div class="cart-list">${entries.map(({ item, quantity }) => `<article class="cart-row"><span class="mini-cupcake tone-${safe(item.tone)}"><i></i></span><div class="cart-name"><a href="#/produto/${encodeURIComponent(item.id)}">${safe(item.name)}</a><small>${money(item.price)} / unidade</small></div><div class="quantity"><button data-action="quantity" data-id="${safe(item.id)}" data-delta="-1" aria-label="Diminuir">−</button><output>${quantity}</output><button data-action="quantity" data-id="${safe(item.id)}" data-delta="1" aria-label="Aumentar" ${quantity >= item.stock ? 'disabled' : ''}>+</button></div><strong>${money(item.price * quantity)}</strong><button class="remove" data-action="remove" data-id="${safe(item.id)}" aria-label="Remover ${safe(item.name)}">×</button></article>`).join('')}</div><aside class="summary"><p class="eyebrow">RESUMO</p><div class="summary-line"><span>Subtotal</span><strong>${money(total)}</strong></div><div class="summary-line"><span>Entrega</span><span>A combinar</span></div><div class="summary-total"><span>Total estimado</span><strong>${money(total)}</strong></div><form id="checkout-form"><label for="customer-name">Seu nome</label><input id="customer-name" name="name" maxlength="80" autocomplete="name" placeholder="Como podemos te chamar?" required><label for="payment">Pagamento demonstrativo</label><select id="payment" name="payment" required><option value="">Selecione</option><option>Pix (simulado)</option><option>Dinheiro (simulado)</option></select><p class="fine-print">Não informe senha, endereço ou cartão. Este app não processa pagamentos.</p><button class="button button-dark full-button" type="submit">Salvar pedido de estudo</button></form></aside></div>` : `<div class="empty-cart"><span aria-hidden="true">✳</span><h2>Sacola esperando um sabor.</h2><p>Escolha um cupcake no cardápio para começar.</p><a class="button button-dark" href="#/catalogo">Ver cardápio</a></div>`}</section>`;
    }
    function renderOrders() {
        const list = orders().slice().reverse();
        root.innerHTML = `<section class="orders-page"><p class="eyebrow">HISTÓRICO NESTE NAVEGADOR</p><h1>Meus pedidos</h1><p class="orders-intro">Pedidos demonstrativos salvos localmente neste dispositivo.</p>${list.length ? `<div class="orders-list">${list.map((order) => `<a class="order-entry" href="#/pedido/${encodeURIComponent(order.id)}"><span>#${safe(order.id.replace(/-/g, '').slice(-6))}</span><span><strong>${order.items.map((item) => `${item.quantity} × ${safe(item.name)}`).join(', ')}</strong><small>${new Date(order.createdAt).toLocaleString('pt-BR')}</small></span><strong>${money(order.total)}</strong><b>→</b></a>`).join('')}</div>` : `<div class="empty-cart"><span aria-hidden="true">01</span><h2>Nenhum pedido por aqui ainda.</h2><p>Ao salvar um pedido de estudo, ele aparecerá nesta lista.</p><a class="button button-dark" href="#/catalogo">Explorar sabores</a></div>`}</section>`;
    }
    function renderOrder(id) {
        const order = orders().find((item) => item.id === decodeURIComponent(id));
        if (!order) return renderNotFound();
        root.innerHTML = `<section class="confirmation"><span class="confirmation-mark" aria-hidden="true">✓</span><p class="eyebrow">PEDIDO DE DEMONSTRAÇÃO #${safe(order.id.replace(/-/g, '').slice(-6))}</p><h1>Pedido anotado,<br>${safe(order.name)}.</h1><p>Os dados foram salvos só neste navegador. Não houve cobrança.</p><div class="confirmation-box">${order.items.map((item) => `<div class="summary-line"><span>${item.quantity} × ${safe(item.name)}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}<div class="summary-total"><span>Total demonstrativo</span><strong>${money(order.total)}</strong></div><small>${safe(order.payment)} · ${new Date(order.createdAt).toLocaleString('pt-BR')}</small></div><div class="confirmation-links"><a class="button button-dark" href="#/catalogo">Voltar ao cardápio</a><a class="text-action" href="#/pedidos">Ver meus pedidos</a></div></section>`;
    }
    function renderNotFound() { root.innerHTML = '<section class="empty-cart"><span aria-hidden="true">?</span><h1>Não encontramos essa página.</h1><a class="button button-dark" href="#/catalogo">Ir ao cardápio</a></section>'; }
    function render() {
        const [page, id] = route().split('/');
        updateHeader();
        if (page === 'produto' && id) renderProduct(id);
        else if (page === 'carrinho') renderCart();
        else if (page === 'pedidos') renderOrders();
        else if (page === 'pedido' && id) renderOrder(id);
        else renderCatalog();
    }
    function add(id) {
        const item = products().find((product) => product.id === id);
        if (!item || Number(item.stock) < 1) return;
        const current = cart();
        if (Number(current[id] || 0) >= Number(item.stock)) return announce('Você já adicionou todo o estoque deste sabor.');
        current[id] = Number(current[id] || 0) + 1;
        if (save(keys.cart, current)) { updateHeader(); announce(`${item.name} foi para a sacola.`); }
    }
    function checkout(form) {
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const payment = String(data.get('payment') || '');
        const current = cart();
        const all = products();
        const items = Object.entries(current).map(([id, quantity]) => {
            const item = all.find((product) => product.id === id);
            return item ? { id, name: item.name, price: Number(item.price), quantity: Number(quantity) } : null;
        }).filter(Boolean);
        if (!name || !payment || !items.length) return;
        if (items.some((entry) => entry.quantity > Number(all.find((item) => item.id === entry.id).stock))) {
            announce('Estoque alterado. Confira a sacola antes de continuar.');
            return;
        }
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, payment, items, total, createdAt: new Date().toISOString() };
        const nextOrders = [...orders(), order];
        const nextProducts = all.map((product) => {
            const ordered = items.find((item) => item.id === product.id);
            return ordered ? { ...product, stock: Number(product.stock) - ordered.quantity } : product;
        });
        if (!save(keys.orders, nextOrders) || !save(keys.products, nextProducts) || !save(keys.cart, {})) return;
        location.hash = `#/pedido/${encodeURIComponent(order.id)}`;
    }

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const { action, id } = button.dataset;
        if (action === 'add') add(id);
        if (action === 'filter') { categoryFilter = button.dataset.category; renderCatalog(); }
        if (action === 'quantity') {
            const current = cart();
            const item = products().find((product) => product.id === id);
            const next = Number(current[id] || 0) + Number(button.dataset.delta);
            if (next < 1) delete current[id]; else if (item && next <= item.stock) current[id] = next;
            save(keys.cart, current); renderCart(); updateHeader();
        }
        if (action === 'remove') { const current = cart(); delete current[id]; save(keys.cart, current); renderCart(); updateHeader(); }
        if (action === 'reset') { Object.values(keys).forEach((key) => localStorage.removeItem(key)); categoryFilter = 'Todos'; search = ''; renderCatalog(); updateHeader(); announce('Demonstração reiniciada.'); }
    });
    document.addEventListener('input', (event) => {
        if (event.target.id !== 'product-search') return;
        search = event.target.value;
        const cursor = event.target.selectionStart;
        renderCatalog();
        const input = document.querySelector('#product-search');
        input.focus(); input.setSelectionRange(cursor, cursor);
    });
    document.addEventListener('submit', (event) => {
        if (event.target.id === 'checkout-form') { event.preventDefault(); checkout(event.target); }
    });
    window.addEventListener('hashchange', render);
    render();
})();