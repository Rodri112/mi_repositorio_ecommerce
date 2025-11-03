// 1. ESTO ES MUY IMPORTANTE: Le dice a Next.js que es un componente interactivo.
"use client";

// 2. Importamos React y el hook 'useEffect' para cargar tu JavaScript.
import React, { useEffect } from 'react';

// (No necesitas importar Image de Next.js si usamos <img> simple por ahora)

export default function HomePage() {

  // 3. TODO TU JAVASCRIPT va aquí adentro.
  useEffect(() => {
    
    // --- INICIO DE TU SCRIPT ORIGINAL (Corregido para TypeScript) ---

    // Damos tiempo a que los scripts de layout.tsx carguen
    const timer = setTimeout(() => {
      // @ts-expect-error AOS se carga globalmente desde layout.tsx
      if (typeof window.AOS !== 'undefined') {
        // @ts-expect-error AOS se carga globalmente desde layout.tsx
        window.AOS.init();
      }
      // @ts-expect-error feather se carga globalmente desde layout.tsx
      if (typeof window.feather !== 'undefined') {
        // @ts-expect-error feather se carga globalmente desde layout.tsx
        window.feather.replace();
      } else {
        console.warn('Feather icons script no se ha cargado a tiempo.');
      }
    }, 500); // 500ms de retraso para asegurar la carga

    // --- Definición de Funciones (para evitar errores de "no definido") ---
    
    // Elementos del Encabezado
    const header = document.querySelector('.main-header') as HTMLElement;
    const menuToggleButton = document.querySelector('.menu-toggle-button') as HTMLButtonElement;
    const mainNav = document.querySelector('.main-nav') as HTMLElement;
    
    // --- Lógica del Modal de Categorías ---
    const categoriesLink = document.getElementById('categories-link');
    const categoriesModal = document.getElementById('categories-modal');
    const modalCloseButton = document.querySelector('.modal-close-button'); 
    const mainCategoryItems = document.querySelectorAll('.main-categories-list .category-item');
    
    // --- Lógica del Modal de Autenticación ---
    const authModal = document.getElementById('auth-modal');
    const authCloseButton = document.querySelector('.auth-close-button');
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    const registerForm = document.getElementById('register-form') as HTMLFormElement;
    const registerPassword = document.getElementById('register-password') as HTMLInputElement;
    const registerPasswordConfirm = document.getElementById('register-password-confirm') as HTMLInputElement;
    const passwordMatchError = document.getElementById('password-match-error');
    
    // Botones que abren el modal de Auth 
    const loginRegisterTriggers = document.querySelectorAll('.auth-trigger, .hero-buttons .primary-button, .hero-buttons .secondary-button');

    // Botón de subir
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');


    // Función para Abrir cualquier Modal
    function openModal(modalElement: HTMLElement | null) {
      if (!modalElement) return;
      modalElement.style.display = 'block';
      document.body.style.overflow = 'hidden';
      if (window.innerWidth < 768 && mainNav) {
        mainNav.classList.remove('mobile-active');
      }
    }

    // Función para Cerrar cualquier Modal
    function closeModal(modalElement: HTMLElement | null) {
      if (!modalElement) return;
      modalElement.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    
    // --- Lógica de Scroll ---
    const handleScroll = () => {
        if (!header || !scrollToTopBtn) return; // Comprobación de nulidad
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
            scrollToTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            scrollToTopBtn.classList.remove('show');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Lógica del botón de subir arriba de todo
    scrollToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    
    // --- Lógica del Side Menu (off-canvas derecha) ---
    const sideMenu = document.getElementById('side-menu');
    const sideBackdrop = document.getElementById('side-menu-backdrop');
    
    function openSideMenuLocal(){
        if (!sideMenu || !sideBackdrop) return;
        sideMenu.classList.add('open');
        sideBackdrop.classList.add('visible');
        sideMenu.setAttribute('aria-hidden','false');
        sideBackdrop.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        try {
            document.querySelectorAll('.accordion-content, .sub-list').forEach(el => {
                const htmlEl = el as HTMLElement;
                if (el.classList.contains('open')) {
                    htmlEl.style.maxHeight = htmlEl.scrollHeight + 'px';
                } else {
                    htmlEl.style.maxHeight = '0px';
                }
            });
        } catch { /* Ignoramos el error, 'e' no se usa */ }
    }

    function closeSideMenuLocal(){
        if (!sideMenu || !sideBackdrop) return;
        sideMenu.classList.remove('open');
        sideBackdrop.classList.remove('visible');
        sideMenu.setAttribute('aria-hidden','true');
        sideBackdrop.setAttribute('aria-hidden','true');
        document.body.style.overflow = 'auto';
    }

    // Lógica del menú hamburguesa para móviles
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', (e) => { // 'e' SÍ se usa aquí
            e.preventDefault();
            if (window.innerWidth <= 599) {
                openSideMenuLocal(); 
            } else if (mainNav) {
                mainNav.classList.toggle('mobile-active');
            }
        });
    } else {
        console.warn('menuToggleButton not found; hamburger will not be interactive');
    }

    function initializeSideMenu() {
        const sideCloseBtn = document.querySelector('.side-menu-close');
        const accordionBtns = Array.from(document.querySelectorAll('.side-accordion .accordion-btn'));

        if (!sideMenu || !sideBackdrop) return console.warn('Side menu or backdrop missing');

        if (sideCloseBtn) sideCloseBtn.addEventListener('click', closeSideMenuLocal);
        sideBackdrop?.addEventListener('click', closeSideMenuLocal);

        accordionBtns.forEach(btn => {
            const parent = btn.parentElement;
            const content = parent?.querySelector('.accordion-content') as HTMLElement;
            if (!content) return;
            content.style.maxHeight = '0px';
            btn.setAttribute('aria-expanded','false');
            btn.addEventListener('click', (ev) => { // 'ev' SÍ se usa aquí
                ev.preventDefault();
                const open = content.classList.contains('open');
                accordionBtns.forEach(other => {
                    const p = other.parentElement;
                    const c = p?.querySelector('.accordion-content') as HTMLElement;
                    if (c && c !== content) {
                        c.classList.remove('open'); c.style.maxHeight = '0px'; p?.classList.remove('expanded'); other.setAttribute('aria-expanded','false');
                    }
                });
                if (open) {
                    content.classList.remove('open'); content.style.maxHeight = '0px'; parent?.classList.remove('expanded'); btn.setAttribute('aria-expanded','false');
                } else {
                    content.classList.add('open'); parent?.classList.add('expanded'); btn.setAttribute('aria-expanded','true');
                    try {
                        const computed = window.getComputedStyle(content).getPropertyValue('max-height');
                        if (computed && computed !== 'none') content.style.maxHeight = computed;
                        else content.style.maxHeight = content.scrollHeight + 'px';
                    } catch { content.style.maxHeight = content.scrollHeight + 'px'; }
                    try { (sideMenu as HTMLElement).scrollTo({ top: Math.max(content.offsetTop - 16, 0), behavior: 'smooth' }); } catch {}
                }
            });
        });

        document.querySelectorAll('.side-accordion .sub-list').forEach(sub => {
            const li = sub.parentElement;
            const link = li?.querySelector('a');
            if (!link) return;
            const toggle = document.createElement('button'); toggle.className = 'sub-toggle'; toggle.setAttribute('aria-expanded','false'); toggle.innerHTML = '<i data-feather="chevron-down"></i>';
            link.parentNode?.insertBefore(toggle, link.nextSibling);
            link.addEventListener('click', (e) => { // 'e' SÍ se usa aquí
                e.preventDefault();
                try { toggle.click(); } catch { /* ignore */ }
            });
            (sub as HTMLElement).style.maxHeight = '0px';
            toggle.addEventListener('click', (ev) => { // 'ev' SÍ se usa aquí
                ev.preventDefault();
                const open = sub.classList.contains('open');
                const siblings = li?.parentElement?.querySelectorAll('.sub-list');
                siblings?.forEach(s => { if (s !== sub) { s.classList.remove('open'); (s as HTMLElement).style.maxHeight='0px'; const ot = s.previousElementSibling; if (ot && ot.classList) ot.setAttribute('aria-expanded','false'); }});
                if (open) { sub.classList.remove('open'); (sub as HTMLElement).style.maxHeight='0px'; toggle.setAttribute('aria-expanded','false'); }
                else { sub.classList.add('open'); 
                    try { const computed = window.getComputedStyle(sub).getPropertyValue('max-height'); if (computed && computed !== 'none') (sub as HTMLElement).style.maxHeight = computed; else (sub as HTMLElement).style.maxHeight = sub.scrollHeight + 'px'; } catch { (sub as HTMLElement).style.maxHeight = sub.scrollHeight + 'px'; } toggle.setAttribute('aria-expanded','true'); 
                    try{ (sideMenu as HTMLElement).scrollTo({ top: Math.max((li as HTMLElement).offsetTop - 12,0), behavior:'smooth'}); } catch {} 
                }
            });
        });
    }
    initializeSideMenu(); // Ejecutamos la función
    // --- Fin Lógica Side Menu ---


    // ABRIR/CERRAR Modal de Categorías
    categoriesLink?.addEventListener('click', (event) => { // 'event' SÍ se usa aquí
        event.preventDefault();
        openModal(categoriesModal);
    });

    (modalCloseButton as HTMLElement)?.addEventListener('click', () => {
        closeModal(categoriesModal);
    });

    // Lógica de pestañas para el modal de categorías
    mainCategoryItems.forEach(item => {
        item.addEventListener('click', (event) => { // 'event' SÍ se usa aquí
            event.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;
            
            const currentActiveItem = document.querySelector('.main-categories-list .category-item.active');
            if(currentActiveItem) currentActiveItem.classList.remove('active');
            item.classList.add('active');
            
            const currentActiveList = document.querySelector('.sub-category-list.active');
            if(currentActiveList) currentActiveList.classList.remove('active');
            document.getElementById(targetId)?.classList.add('active');
        });
    });

    // Ocultar modal si se hace clic fuera (Categorías)
    window.addEventListener('click', (event) => { // 'event' SÍ se usa aquí
        if (event.target === categoriesModal) {
            closeModal(categoriesModal);
        }
    });

    // Adaptar la ventana modal a diferentes tamaños de pantalla
    function setModalSize() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            categoriesModal?.classList.add('mobile-modal');
        } else {
            categoriesModal?.classList.remove('mobile-modal');
        }
    }
    window.addEventListener('resize', setModalSize);
    setModalSize();

    function setAuthModalSize() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            authModal?.classList.add('mobile-modal');
        } else {
            authModal?.classList.remove('mobile-modal');
        }
    }
    window.addEventListener('resize', setAuthModalSize);
    setAuthModalSize();


    // --- LÓGICA ESPECÍFICA DEL MODAL DE AUTENTICACIÓN ---

    function validatePassword() {
        if (!registerPassword || !registerPasswordConfirm || !passwordMatchError) return false;
        if (registerPassword.value !== registerPasswordConfirm.value) {
            passwordMatchError.style.display = 'block';
            registerPasswordConfirm.setCustomValidity("Las contraseñas no coinciden");
            return false;
        } else {
            passwordMatchError.style.display = 'none';
            registerPasswordConfirm.setCustomValidity("");
            return true;
        }
    }

    registerPassword?.addEventListener('input', validatePassword);
    registerPasswordConfirm?.addEventListener('input', validatePassword);

    // Event listener para validar al enviar el formulario
    registerForm?.addEventListener('submit', async (event) => { // 'event' SÍ se usa aquí
        event.preventDefault();
        if (!validatePassword() || !passwordMatchError) return;
        
        const nombre = (document.getElementById('register-name') as HTMLInputElement).value.trim();
        const email = (document.getElementById('register-email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('register-password') as HTMLInputElement).value;
        const msgEl = passwordMatchError;

        try {
            alert('LÓGICA DE SUPABASE PENDIENTE AQUÍ');
            console.log('Datos de registro:', { nombre, email, password });
            
            // Simulación de éxito:
            msgEl.style.color = 'green';
            msgEl.style.display = 'block';
            msgEl.textContent = 'Registro exitoso (Simulación). Revisa tu correo.';

        } catch (err: unknown) { 
            if (!msgEl) return;
            msgEl.style.color = 'red';
            msgEl.style.display = 'block';
            if (err instanceof Error) {
                msgEl.textContent = 'Error de red (Simulación): ' + err.message;
            } else {
                msgEl.textContent = 'Un error desconocido ocurrió.';
            }
        }
    });

    // ABRIR Modal de Autenticación
    loginRegisterTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => { // 'event' SÍ se usa aquí
            event.preventDefault();
            setAuthModalSize();
            openModal(authModal);

            const isRegisterButton = trigger.classList.contains('primary-button') || trigger.classList.contains('auth-button-text');
            const targetTab = isRegisterButton ? 'register' : 'login';
            
            const targetButton = document.querySelector(`.auth-tab-btn[data-tab="${targetTab}"]`);
            if (targetButton && !targetButton.classList.contains('active')) {
                const activeTab = document.querySelector('.auth-tab-btn.active');
                if(activeTab) activeTab.classList.remove('active');
                
                const activePanel = document.querySelector('.auth-panel.active');
                if(activePanel) activePanel.classList.remove('active');
                
                targetButton.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) targetPanel.classList.add('active');
            }
        });
    });

    // CERRAR Modal de Autenticación
    (authCloseButton as HTMLElement)?.addEventListener('click', () => {
        closeModal(authModal);
    });

    // Ocultar modal si se hace clic fuera (Autenticación)
    window.addEventListener('click', (event) => { // 'event' SÍ se usa aquí
        if (event.target === authModal) {
            closeModal(authModal);
        }
    });

    // Lógica de Pestañas (Tabs) de Autenticación
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const activeTab = document.querySelector('.auth-tab-btn.active');
            if (activeTab) activeTab.classList.remove('active');
            const activePanel = document.querySelector('.auth-panel.active');
            if (activePanel) activePanel.classList.remove('active');
            
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            if (target) {
                const targetPanel = document.getElementById(target);
                if (targetPanel) targetPanel.classList.add('active');
            }
        });
    });


    document.addEventListener('transitionend', (ev) => {
        const el = ev.target as HTMLElement;
        if (!el || !(el.classList)) return;
        if (el.classList.contains('accordion-content')) {
            if (el.classList.contains('open')) {
                el.style.maxHeight = '';
            } else {
                el.style.maxHeight = '0px';
            }
        }
        if (el.classList.contains('sub-list')) {
            if (el.classList.contains('open')) {
                el.style.maxHeight = '';
            } else {
                el.style.maxHeight = '0px';
            }
        }
    });

    const handleResize = () => {
        if (window.innerWidth > 599) {
            closeSideMenuLocal();
        }
    };
    window.addEventListener('resize', handleResize);

    // --- LÓGICA DEL CARRITO (UI SIMPLE EN CLIENTE) ---
    const cart: { title: string, price: number }[] = [];
    const cartButtonEl = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = document.querySelector('.cart-close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmountEl = document.getElementById('cart-total-amount');
    const cartBadge = document.querySelector('.cart-badge');
    const cartTotalHeader = document.querySelector('.header-cart-btn .cart-total');

    function formatPrice(value: number) {
        return '$' + value.toFixed(2);
    }

    function updateCartUI() {
        const total = cart.reduce((sum, it) => sum + (it.price || 0), 0);
        if (cartTotalAmountEl) cartTotalAmountEl.textContent = formatPrice(total);
        if (cartTotalHeader) cartTotalHeader.textContent = formatPrice(total);
        if (cartBadge) {
            cartBadge.textContent = cart.length.toString();
            (cartBadge as HTMLElement).style.display = cart.length ? 'inline-block' : 'none';
        }

        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
            return;
        }

        cart.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `<div class="item-title">${item.title}</div><div class="item-price">${formatPrice(item.price || 0)}</div><button class="remove-item" data-index="${idx}" aria-label="Eliminar">✕</button>`;
            cartItemsContainer.appendChild(row);
        });

        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.getAttribute('data-index') || '', 10);
                if (!isNaN(i)) {
                    cart.splice(i, 1);
                    updateCartUI();
                }
            });
        });
    }

    function openCartModal() {
        if (!cartModal) return;
        (cartModal as HTMLElement).style.display = 'block';
        cartModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCartModal() {
        if (!cartModal) return;
        (cartModal as HTMLElement).style.display = 'none';
        cartModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (cartButtonEl) {
        cartButtonEl.addEventListener('click', (e) => { // 'e' SÍ se usa aquí
            e.preventDefault();
            openCartModal();
        });
    }
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartModal);
    window.addEventListener('click', (e) => { if (e.target === cartModal) closeCartModal(); }); // 'e' SÍ se usa aquí

    document.querySelectorAll('.add-to-cart-button').forEach(btn => {
        btn.addEventListener('click', (e) => { // 'e' SÍ se usa aquí
            e.preventDefault();
            const card = (btn as HTMLElement).closest('.product-card');
            if (!card) return;
            const titleEl = card.querySelector('.product-title') as HTMLElement;
            const priceEl = (card.querySelector('.new-price') || card.querySelector('.product-price-info .new-price') || card.querySelector('.prices .new-price')) as HTMLElement;
            const title = titleEl ? titleEl.innerText.trim() : 'Producto';
            let price = 0;
            if (priceEl) {
                const raw = priceEl.innerText.replace(/[^0-9,\.]/g, '').replace(/\./g, '').replace(/,/g, '.');
                const parsed = parseFloat(raw);
                price = isNaN(parsed) ? 0 : parsed;
            }
            cart.push({ title, price });
            updateCartUI();
            if (cartBadge) {
                cartBadge.classList.add('bumped');
                setTimeout(() => cartBadge.classList.remove('bumped'), 300);
            }
        });
    });

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) checkoutButton.addEventListener('click', () => {
        alert('Simulación: proceder al pago. Total: ' + (cartTotalAmountEl ? cartTotalAmountEl.textContent : '$0.00'));
    });

    updateCartUI();
    
    // --- FIN DE TU SCRIPT ORIGINAL ---


    // Cleanup: Remove event listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', setModalSize);
      window.removeEventListener('resize', setAuthModalSize);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer); // Limpiamos el temporizador
    };

  }, []); // El [] vacío asegura que este código se ejecute SÓLO UNA VEZ.


  // 4. ESTO ES TU HTML (convertido a JSX)
  return (
    <>
      {/* Tu HTML convertido. 
        He cambiado 'class' por 'className'
        He cerrado etiquetas como <img ... />
        He cambiado 'src="images/..."' por 'src="/..."' (DEBES MOVER 'images' a 'public/')
        CORREGIDO: He envuelto texto problemático (como '¡...!') con {'...'}
      */}

      <div className="top-bar">
        <div className="container top-bar-content">
            <div className="shipping-info">
                <a href="#" className="top-link"><i data-feather="truck"></i>{' Seguir Envío'}</a>
                <a href="#" className="top-link"><i data-feather="tool"></i>{' Servicio Técnico'}</a>
                <a href="#" className="top-link"><i data-feather="mail"></i>{' Contacto'}</a>
            </div>
            
            <div className="promo-marquee">
                <div className="marquee" aria-hidden="true">
                    <div className="marquee__inner">
                        <span className="marquee__text">{'🚚 ¡ENVÍO GRATIS en compras superiores a $50.000! | 💳 3 y 6 Cuotas Sin Interés con Visa y Mastercard.'}</span>
                        <span className="marquee__gap">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className="marquee__text">{'🚚 ¡ENVÍO GRATIS en compras superiores a $50.000! | 💳 3 y 6 Cuotas Sin Interés con Visa y Mastercard.'}</span>
                    </div>
                </div>
            </div>
            
            <div className="user-links-empty"></div>
        </div>
      </div>

      <header className="main-header">
        <div className="container header-content">
            <div className="logo">
                <a href="#">
                    {/* CORREGIDO: la ruta es /images/logoferre.jpg */}
                    <img src="/images/logoferre.jpg" alt="Logo de la ferretería" className="header-logo" />
                    <div className="logo-text-container">
                        <span className="logo-main-text">CASA MENENDEZ</span>
                        <small className="logo-sub-text">Ferretería Industrial</small>
                    </div>
                </a>
            </div>
            <div className="search-bar">
                <div className="search-container">
                    <input type="text" placeholder="Buscar productos..." />
                    <button className="search-button">
                        <i data-feather="search"></i>
                    </button>
                </div>
            </div>

            <div className="header-actions">
                <button className="auth-trigger auth-button-text">
                    <i data-feather="user"></i> <span className="auth-text-label">{'Iniciar Sesión / Registrarse'}</span>
                </button>
                
                <div className="header-icons-group">
                    <a href="#" className="header-icon-link"><i data-feather="heart"></i></a>
                    <button id="cart-button" className="header-cart-btn header-icon-link" aria-label="Ver carrito">
                        <i data-feather="shopping-cart"></i>
                        <span className="cart-total">$0.00</span>
                        <span className="cart-badge" aria-hidden="true">0</span>
                    </button>
                    <button className="menu-toggle-button" aria-label="Abrir menú">
                        <i data-feather="menu"></i>
                    </button>
                </div>
            </div>

            <nav className="main-nav">
                <ul>
                    <li className="mobile-only"><a href="#" className="nav-link">Seguir Envío</a></li>
                    <li className="mobile-only"><a href="#" className="nav-link">Servicio Técnico</a></li>
                    <li className="mobile-only"><a href="#" className="nav-link">Contacto</a></li>
                    <li><a href="#" className="nav-link active">Inicio</a></li>
                    <li><a href="#" className="nav-link">Ofertas</a></li>
                    <li><a href="#" className="nav-link">Despieces</a></li>
                    <li><a href="#" className="nav-link">Servicio Técnico</a></li>
                    <li><a href="#" id="categories-link" className="nav-link">{'Categorías '}<i data-feather="chevron-down" className="dropdown-icon"></i></a></li>
                </ul>
            </nav>
            
        </div>
      </header>

      <div id="side-menu-backdrop" className="side-menu-backdrop" aria-hidden="true"></div>
      <aside id="side-menu" className="side-menu" aria-hidden="true">
        <button className="side-menu-close" aria-label="Cerrar menú">&times;</button>

        <div className="side-menu-search">
            <input type="search" id="side-search-input" placeholder="Buscar productos..." />
            <button id="side-search-btn" aria-label="Buscar">Buscar</button>
        </div>

        <div className="side-accordion" id="side-accordion-menu">
            <button className="accordion-btn" aria-expanded="false">Menú</button>
            <div className="accordion-content">
                <ul>
                    <li><a href="#">Servicio Técnico</a></li>
                    <li><a href="#">Contacto</a></li>
                    <li><a href="#">Despieces</a></li>
                    <li><a href="#">Preguntas Frecuentes</a></li>
                </ul>
            </div>
        </div>

        <div className="side-accordion" id="side-accordion-products">
            <button className="accordion-btn" aria-expanded="false">Productos</button>
            <div className="accordion-content">
                <ul>
                    <li>
                        <a href="#">Máquinas</a>
                        <ul className="sub-list">
                            <li><a href="#">Taladros</a></li>
                            <li><a href="#">Sierras</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Ferretería</a>
                        <ul className="sub-list">
                            <li><a href="#">Tornillos</a></li>
                            <li><a href="#">Tuercas</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">{'Insumos y Accesorios'}</a>
                        <ul className="sub-list">
                            <li><a href="#">Abrasivos</a></li>
                            <li><a href="#">Cintas</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Repuestos</a>
                        <ul className="sub-list">
                            <li><a href="#">Repuestos Eléctricos</a></li>
                            <li><a href="#">Repuestos Manuales</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Ofertas</a></li>
                </ul>
            </div>
        </div>
      </aside>

      <div id="categories-modal" className="modal">
        <div className="modal-content">
            <span className="close-button modal-close-button">&times;</span>
            <div className="modal-header">
                <h2 className="modal-title">Explora Nuestras Categorías</h2>
            </div>
            <div className="modal-body-content">
                <div className="main-categories-panel">
                    <ul className="main-categories-list">
                        <li className="category-item active" data-target="herramientas-sub">
                            <a href="#">{'Herramientas '}<i data-feather="chevron-right"></i></a>
                        </li>
                        <li className="category-item" data-target="repuestos-sub">
                            <a href="#">{'Repuestos De Herramientas '}<i data-feather="chevron-right"></i></a>
                        </li>
                        <li className="category-item" data-target="buloneria-sub">
                            <a href="#">{'Buloneria '}<i data-feather="chevron-right"></i></a>
                        </li>
                        <li className="category-item" data-target="carpinteria-sub">
                            <a href="#">{'Carpinteria '}<i data-feather="chevron-right"></i></a>
                        </li>
                        <li className="category-item" data-target="pintureria-sub">
                            <a href="#">{'Pintureria '}<i data-feather="chevron-right"></i></a>
                        </li>
                        <li className="category-item" data-target="consumibles-sub">
                            <a href="#">{'Consumibles de Ferretería '}<i data-feather="chevron-right"></i></a>
                        </li>
                    </ul>
                </div>
                
                <div className="sub-categories-panel">
                    <div id="herramientas-sub" className="sub-category-list active">
                        <h3 className="sub-category-title">Herramientas</h3>
                        <ul>
                            <li><a href="#">Herramientas Manuales</a></li>
                            <li><a href="#">Herramientas Eléctricas</a></li>
                            <li><a href="#">{'Herramientas a Explosión'}</a></li>
                            <li><a href="#">Herramientas Neumáticas</a></li>
                            <li><a href="#">{'Herramientas a Batería'}</a></li>
                            <li><a href="#">Ver Todas las Herramientas</a></li>
                        </ul>
                    </div>

                    <div id="repuestos-sub" className="sub-category-list">
                        <h3 className="sub-category-title">Repuestos De Herramientas</h3>
                        <ul>
                            <li><a href="#">Repuestos Manuales</a></li>
                            <li><a href="#">Repuestos Eléctricas</a></li>
                            <li><a href="#">{'Repuestos a Explosión'}</a></li>
                            <li><a href="#">Repuestos Neumáticas</a></li>
                            <li><a href="#">{'Repuestos a Batería'}</a></li>
                            <li><a href="#">Ver Todos los Repuestos</a></li>
                        </ul>
                    </div>
                    
                    <div id="buloneria-sub" className="sub-category-list">
                        <h3 className="sub-category-title">Buloneria</h3>
                        <ul>
                            <li><a href="#">Tuercas</a></li>
                            <li><a href="#">Tornillos</a></li>
                            <li><a href="#">Arandelas</a></li>
                            <li><a href="#">Espárragos</a></li>
                            <li><a href="#">Remaches</a></li>
                        </ul>
                    </div>
                    
                    <div id="carpinteria-sub" className="sub-category-list">
                        <h3 className="sub-category-title">Carpinteria</h3>
                        <ul>
                            <li><a href="#">Clavos</a></li>
                            <li><a href="#">Adhesivos</a></li>
                            <li><a href="#">Escuadras</a></li>
                            <li><a href="#">Lijas y Abrasivos</a></li>
                            <li><a href="#">Cierres y Herrajes</a></li>
                        </ul>
                    </div>
                    
                    <div id="pintureria-sub" className="sub-category-list">
                        <h3 className="sub-category-title">Pintureria</h3>
                        <ul>
                            <li><a href="#">Pinturas</a></li>
                            <li><a href="#">Pinceles</a></li>
                            <li><a href="#">Rodillos</a></li>
                            <li><a href="#">Diluyentes</a></li>
                            <li><a href="#">Protectores de Superficie</a></li>
                        </ul>
                    </div>
                    
                    <div id="consumibles-sub" className="sub-category-list">
                        <h3 className="sub-category-title">Consumibles de Ferretería</h3>
                        <ul>
                            <li><a href="#">Abrasivos</a></li>
                            <li><a href="#">Selladores</a></li>
                            <li><a href="#">Lubricantes</a></li>
                            <li><a href="#">Cintas</a></li>
                            <li><a href="#">{'Guantes y Protección'}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <section className="hero-section">
        <div className="container hero-content">
            <div className="hero-image" data-aos="fade-right">
                <div className="carousel-container">
                    <div className="carousel-slide">
                        <img src="/images/fotomostrador.jpg" alt="Fotomostrador" />
                    </div>
                    <div className="carousel-slide">
                        <img src="/images/fotolocal.jpg" alt="Fotolocal" />
                    </div>
                    <div className="carousel-slide">
                        <img src="/images/fotomostrador.jpg" alt="Fotomostrador 2" />
                    </div>
                </div>
            </div>
            <div className="hero-text" data-aos="fade-left">
                <h1>{'Bienvenidos a Casa Menendez'}</h1>
                <p>{'Tu proveedor de confianza en repuestos, consumibles y herramientas industriales. Expertos en bulonería, herrajes y servicio técnico profesional.'}</p>
                
                <p className="small-text-cta">{'¡Crea tu cuenta ahora!'}</p>
                <div className="hero-buttons">
                    <button className="primary-button auth-trigger">Regístrate</button>
                    <button className="secondary-button auth-trigger">Iniciar sesión</button>
                </div>
            </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
            <h2 className="section-title">Comprar por Categoría</h2>
            <div className="categories-grid">
                <a href="#" className="category-card" data-aos="zoom-in">
                    <div className="category-icon-bg bg-blue">
                        <i data-feather="tool"></i>
                    </div>
                    <h3 className="category-title">Herramientas Eléctricas</h3>
                    <p className="category-description">{'Taladros, Sierras y Más'}</p>
                </a>
                <a href="#" className="category-card" data-aos="zoom-in" data-aos-delay="100">
                    <div className="category-icon-bg bg-green">
                        <i data-feather="home"></i>
                    </div>
                    <h3 className="category-title">Mejoras para el Hogar</h3>
                    <p className="category-description">{'Pintura, Ferretería y Más'}</p>
                </a>
                <a href="#" className="category-card" data-aos="zoom-in" data-aos-delay="200">
                    <div className="category-icon-bg bg-yellow">
                        <i data-feather="droplet"></i>
                    </div>
                    <h3 className="category-title">Plomería</h3>
                    <p className="category-description">{'Tuberías, Conexiones y Más'}</p>
                </a>
                <a href="#" className="category-card" data-aos="zoom-in" data-aos-delay="300">
                    <div className="category-icon-bg bg-red">
                        <i data-feather="zap"></i>
                    </div>
                    <h3 className="category-title">Electricidad</h3>
                    <p className="category-description">{'Cables, Interruptores y Más'}</p>
                </a>
            </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
            <div className="products-header">
                <h2 className="section-title">Productos Destacados</h2>
                <a href="#" className="view-all-link">Ver Todos</a>
            </div>
            <div className="products-grid">
                <div className="product-card" data-aos="fade-up">
                    <div className="product-image-container">
                        <img src="https://static.photos/tools/640x360/1" alt="Taladro Eléctrico" />
                        <div className="product-badge sale-badge">-15%</div>
                    </div>
                    <h3 className="product-title">Taladro Eléctrico Profesional</h3>
                    <div className="product-rating">
                        <div className="stars filled">
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                        </div>
                        <span className="rating-count">(42)</span>
                    </div>
                    <div className="product-price-info">
                        <div className="prices">
                            <span className="old-price">$129.99</span>
                            <span className="new-price">$109.99</span>
                        </div>
                        <button className="add-to-cart-button">
                            <i data-feather="shopping-cart"></i>
                        </button>
                    </div>
                </div>

                <div className="product-card" data-aos="fade-up" data-aos-delay="100">
                    <div className="product-image-container">
                        <img src="https://static.photos/tools/640x360/2" alt="Sierra Circular" />
                    </div>
                    <h3 className="product-title">Sierra Circular de Uso Pesado</h3>
                    <div className="product-rating">
                        <div className="stars filled">
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                        </div>
                        <span className="rating-count">(28)</span>
                    </div>
                    <div className="product-price-info">
                        <div className="prices">
                            <span className="new-price">$149.99</span>
                        </div>
                        <button className="add-to-cart-button">
                            <i data-feather="shopping-cart"></i>
                        </button>
                    </div>
                </div>

                <div className="product-card" data-aos="fade-up" data-aos-delay="200">
                    <div className="product-image-container">
                        <img src="https://static.photos/tools/640x360/3" alt="Juego de Herramientas" />
                        <div className="product-badge new-badge">Nuevo</div>
                    </div>
                    <h3 className="product-title">Juego Completo de Herramientas</h3>
                    <div className="product-rating">
                        <div className="stars filled">
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                        </div>
                        <span className="rating-count">(56)</span>
                    </div>
                    <div className="product-price-info">
                        <div className="prices">
                            <span className="new-price">$199.99</span>
                        </div>
                        <button className="add-to-cart-button">
                            <i data-feather="shopping-cart"></i>
                        </button>
                    </div>
                </div>

                <div className="product-card" data-aos="fade-up" data-aos-delay="300">
                    <div className="product-image-container">
                        <img src="https://static.photos/tools/640x360/4" alt="Pulverizador de Pintura" />
                    </div>
                    <h3 className="product-title">Pulverizador de Pintura Profesional</h3>
                    <div className="product-rating">
                        <div className="stars filled">
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                            <i data-feather="star"></i>
                        </div>
                        <span className="rating-count">(19)</span>
                    </div>
                    <div className="product-price-info">
                        <div className="prices">
                            <span className="new-price">$89.99</span>
                        </div>
                        <button className="add-to-cart-button">
                            <i data-feather="shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="promo-banner-section">
        <div className="container promo-content">
            <h2 className="promo-title" data-aos="fade-up">{'Venta de Verano - Hasta 30% de Descuento'}</h2>
            <p className="promo-text" data-aos="fade-up" data-aos-delay="100">{'Descuentos especiales en todas las herramientas eléctricas y equipos. ¡Oferta por tiempo limitado!'}</p>
            <button className="promo-button" data-aos="fade-up" data-aos-delay="200">Comprar en la Venta</button>
        </div>
      </section>

      <section className="brands-section">
        <div className="container">
            <h2 className="section-title">Nuestras Marcas de Confianza</h2>
            <div className="brands-grid">
                <img src="https://static.photos/technology/320x240/1" alt="Marca 1" className="brand-logo" data-aos="zoom-in" />
                <img src="https://static.photos/technology/320x240/2" alt="Marca 2" className="brand-logo" data-aos="zoom-in" data-aos-delay="100" />
                <img src="https://static.photos/technology/320x240/3" alt="Marca 3" className="brand-logo" data-aos="zoom-in" data-aos-delay="200" />
                <img src="https://static.photos/technology/320x240/4" alt="Marca 4" className="brand-logo" data-aos="zoom-in" data-aos-delay="300" />
                <img src="https://static.photos/technology/320x240/5" alt="Marca 5" className="brand-logo" data-aos="zoom-in" data-aos-delay="400" />
                <img src="httpsG://static.photos/technology/320x240/6" alt="Marca 6" className="brand-logo" data-aos="zoom-in" data-aos-delay="500" />
            </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
            <h2 className="section-title">Lo que Dicen Nuestros Clientes</h2>
            <div className="testimonials-grid">
                <div className="testimonial-card" data-aos="fade-up">
                    <div className="testimonial-stars filled">
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                    </div>
                    <p className="testimonial-text">{'"El taladro que compré funciona perfectamente. Envío rápido y excelente servicio al cliente. ¡Definitivamente compraré aquí de nuevo!"'}</p>
                    <div className="customer-info">
                        <img src="https://static.photos/people/200x200/1" alt="Cliente" className="customer-photo" />
                        <div className="customer-details">
                            <h4 className="customer-name">John D.</h4>
                            <p className="customer-job">Contratista Profesional</p>
                        </div>
                    </div>
                </div>

                <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
                    <div className="testimonial-stars filled">
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                    </div>
                    <p className="testimonial-text">{'"Gran selección de herramientas a precios competitivos. El juego de herramientas completo era exactamente lo que necesitaba para mis proyectos en casa."'}</p>
                    <div className="customer-info">
                        <img src="https://static.photos/people/200x200/2" alt="Cliente" className="customer-photo" />
                        <div className="customer-details">
                            <h4 className="customer-name">Sarah M.</h4>
                            <p className="customer-job">Aficionada al Bricolaje</p>
                        </div>
                    </div>
                </div>

                <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
                    <div className="testimonial-stars filled">
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                        <i data-feather="star"></i>
                    </div>
                    <p className="testimonial-text">{'"Herramientas de excelente calidad que duran. He estado usando sus productos durante años en mi negocio de construcción."'}</p>
                    <div className="customer-info">
                        <img src="https://static.photos/people/200x200/3" alt="Cliente" className="customer-photo" />
                        <div className="customer-details">
                            <h4 className="customer-name">Michael T.</h4>
                            <p className="customer-job">Propietario de Negocio de Construcción</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="opinion-form-container" data-aos="fade-up" data-aos-delay="300">
                <h3 className="form-title">Comparte Tu Experiencia</h3>
                <form action="#" method="post" className="opinion-form">
                    <div className="form-group">
                        <label htmlFor="customer-name">Tu Nombre:</label>
                        <input type="text" id="customer-name" name="customer-name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rating">Calificación:</label>
                        <select id="rating" name="rating" required>
                            <option value="5">{'★★★★★'}</option>
                            <option value="4">{'★★★★☆'}</option>
                            <option value="3">{'★★★☆☆'}</option>
                            <option value="2">{'★★☆☆☆'}</option>
                            <option value="1">{'★☆☆☆☆'}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="opinion-text">Tu Opinión:</label>
                        <textarea id="opinion-text" name="opinion-text" rows={5} required></textarea>
                    </div>
                    <button type="submit" className="submit-button">Enviar Opinión</button>
                </form>
            </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container newsletter-content">
            <h2 className="section-title" data-aos="fade-up">Mantente Actualizado</h2>
            <p className="newsletter-text" data-aos="fade-up" data-aos-delay="100">Suscríbete a nuestro boletín para conocer los últimos productos, ofertas y consejos.</p>
            <div className="newsletter-form" data-aos="fade-up" data-aos-delay="200">
                <input type="email" placeholder="Tu dirección de correo electrónico" />
                <button>Suscribirse</button>
            </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="container footer-grid-container">
            <div className="footer-about">
                <h3 className="footer-title">Casa Menendez</h3>
                <p>{'Desde hace más de 50 años, Casa Menendez ha sido el punto de referencia para profesionales y aficionados. Fundada con el compromiso de ofrecer herramientas y materiales de la más alta calidad, nuestra historia es la de una pasión por el servicio y la excelencia en cada proyecto. Hoy, continuamos ese legado, proveyendo a nuestros clientes con todo lo que necesitan para construir, reparar y crear.'}</p>
                <div className="social-links">
                    <a href="https://www.facebook.com/share/1GM2hij6FD/"><i data-feather="facebook"></i></a>
                    <a href="https://www.instagram.com/ferrecasamenendez/"><i data-feather="instagram"></i></a>
                    <a href="#"><i data-feather="tiktok"></i></a>
                </div>
            </div>
            
            <div className="footer-links">
                <h4 className="footer-subtitle">Métodos de Pago</h4>
                <div className="payment-methods">
                    <p>Espacio para los logos de las tarjetas y métodos de pago.</p>
                </div>
            </div>
            
            <div className="footer-links">
                <h4 className="footer-subtitle">Atención al Cliente</h4>
                <ul>
                    <li><a href="#">Mi Cuenta</a></li>
                    <li><a href="#">Seguimiento de Pedido</a></li>
                    <li><a href="#">Política de Envío</a></li>
                    <li><a href="#">Devoluciones y Reembolsos</a></li>
                </ul>
            </div>
            
            <div className="footer-contact">
                <h4 className="footer-subtitle">Contáctanos</h4>
                <ul>
                    <li><i data-feather="mail"></i>{' Ferreteriacasamenendez@gmail.com'}</li>
                    <li><i data-feather="map-pin"></i>{' Av Presidente Peron 2956, Haedo'}</li>
                    <li><a href="tel:+5491126941966"><i data-feather="phone"></i>{' 54+ 11 2694-1966'}</a></li> {/* Envuelto en <a> para que sea clickeable */}
                    <li><i data-feather="clock"></i>{' Lun/Vie: 7:30-3:30'}</li>
                    <li><i data-feather="clock"></i>{' Sab: 8:30-12:30'}</li>
                </ul>
            </div>
        </div>
        
        <div className="footer-bottom">
            <p>© Casa Menendez 2025. Todos los derechos reservados.</p>
            <div className="legal-links">
                <a href="/admin">Administración</a>
                <a href="#">Política de Privacidad</a>
                <a href="#">Términos de Servicio</a>
                <a href="#">Mapa del Sitio</a>
            </div>
        </div>
      </footer>

      <a href="https://wa.me/5491126941966" className="whatsapp-button whatsapp-left" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>Chatear</span>
      </a>

      <button id="scrollToTopBtn" className="scroll-to-top-button">
        <i data-feather="chevron-up"></i>
      </button>

      <div id="auth-modal" className="modal auth-modal">
        <div className="modal-content auth-modal-content">
            <span className="close-button auth-close-button">&times;</span>
            <div className="auth-tabs">
                <button className="auth-tab-btn active" data-tab="login">Iniciar Sesión</button>
                <button className="auth-tab-btn" data-tab="register">Registrarse</button>
            </div>

            <div id="login" className="auth-panel active">
                <h3 className="auth-panel-title">Bienvenido de Vuelta</h3>
                <form className="auth-form">
                    <div className="form-group form-field-group">
                        <label htmlFor="login-email">Correo Electrónico:</label>
                        <input type="email" id="login-email" required />
                    </div>
                    <div className="form-group form-field-group">
                        <label htmlFor="login-password">Contraseña:</label>
                        <input type="password" id="login-password" required />
                    </div>
                    
                    <button type="submit" className="submit-button primary-button">Entrar</button>
                    <a href="#" className="forgot-password-link">{'¿Olvidaste tu contraseña?'}</a>
                </form>
                
                <div className="social-login-divider">
                    <span>O Continúa con</span>
                </div>
                
                <button className="social-login-button google-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" />
                    {' Iniciar Sesión con Google'}
                </button>
                
            </div>

            <div id="register" className="auth-panel">
                <h3 className="auth-panel-title">Crear una Cuenta</h3>
                <form className="auth-form" id="register-form">
                    <div className="form-group form-field-group">
                        <label htmlFor="register-name">Nombre Completo:</label>
                        <input type="text" id="register-name" required />
                    </div>
                    <div className="form-group form-field-group">
                        <label htmlFor="register-email">Correo Electrónico:</label>
                        <input type="email" id="register-email" required />
                    </div>
                    <div className="form-group form-field-group">
                        <label htmlFor="register-password">Contraseña:</label>
                        <input type="password" id="register-password" required />
                    </div>
                    <div className="form-group form-field-group">
                        <label htmlFor="register-password-confirm">Confirmar Contraseña:</label>
                        <input type="password" id="register-password-confirm" required />
                        <small id="password-match-error" style={{color: 'red', display: 'none'}}>Las contraseñas no coinciden.</small>
                    </div>
                    
                    <div className="form-group form-field-group">
                        <label htmlFor="register-type">Tipo de Cuenta:</label>
                        <select id="register-type" required>
                            <option value="cliente">{'Cliente (Uso Personal)'}</option>
                            <option value="proveedor">Proveedor</option>
                            <option value="empresa">{'Empresa / Profesional'}</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="submit-button primary-button">Crear Cuenta</button>
                </form>

                <div className="social-login-divider">
                    <span>O Regístrate con</span>
                </div>
                
                <button className="social-login-button google-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" />
                    {' Registrarse con Google'}
                </button>
            </div>
        </div>
      </div>
      
      <div id="cart-modal" className="modal cart-modal" aria-hidden="true">
        <div className="modal-content">
            <span className="close-button cart-close-button">&times;</span>
            <h2>Tu Carrito</h2>
            <div id="cart-items" className="cart-items-list">
                <p className="empty-cart">Tu carrito está vacío.</p>
            </div>
            <div className="cart-summary">
                <div className="cart-total-line">{'Total: '}<strong id="cart-total-amount">$0.00</strong></div>
                <div className="cart-actions">
                    <button id="checkout-button" className="primary-button">Ir a Pagar</button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}