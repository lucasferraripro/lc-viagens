/**
 * 321 GO! â€” EDITOR VISUAL CMS v2
 *
 * SINCRONIZAÃ‡ÃƒO TOTAL: campos de preÃ§o/tÃ­tulo/parcelas editados em qualquer
 * pÃ¡gina sÃ£o salvos em __db_overrides[pkgId] e aplicados ao DB antes de
 * renderizar â€” home e pÃ¡gina do pacote sempre mostram os mesmos valores.
 */
(function () {
    'use strict';

    /* â”€â”€â”€ CHAVES (mesmo valor usado no login.html) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const CMS_KEY     = 'lc_cms_v1';
    const AUTH_KEY    = 'lc_auth';       // DEVE ser igual ao login.html
    const SECRET_KEY  = 'lc_secret';     // DEVE ser igual ao login.html
    const CONTENT_URL = '/api/content';

    /* â”€â”€â”€ AUTH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
       Usa localStorage (nÃ£o sessionStorage) para que o token persista
       entre pÃ¡ginas quando testando via file:// no Chrome â€” cada arquivo
       tem origem diferente e sessionStorage nÃ£o atravessa origens. */
    const auth     = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin  = auth && auth.expires > Date.now();
    const params   = new URLSearchParams(location.search);
    const editMode = isAdmin && (params.get('editor') === '1' || sessionStorage.getItem('editor_active') === '1');

    /* â”€â”€â”€ APLICAR CONTEÃšDO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    function applyContent(cms) {
        if (!cms || typeof cms !== 'object' || !Object.keys(cms).length) return;

        if (cms.colors && typeof cms.colors === 'object') {
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
            });
        }
        if (cms.whatsapp) {
            document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cms.whatsapp);
            });
        }

        // â”€â”€ SINCRONIZAÃ‡ÃƒO: aplica __db_overrides ao DB antes de qualquer render â”€â”€
        // Isso garante que home e pacote.html sempre mostrem os mesmos valores.
        if (cms.__db_overrides && typeof cms.__db_overrides === 'object' && typeof DB !== 'undefined') {
            Object.entries(cms.__db_overrides).forEach(([pkgId, overrides]) => {
                if (DB[pkgId] && typeof overrides === 'object') {
                    Object.assign(DB[pkgId], overrides);
                }
            });
        }

        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.html  != null) el.innerHTML = d.html;
            if (d.text  != null) el.textContent = d.text;
            if (d.src   != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href  != null) el.setAttribute('href', d.href);
            if (d.target!= null) el.setAttribute('target', d.target);
            if (d.style && typeof d.style === 'object') Object.assign(el.style, d.style);
        });

        // Mesclar pacotes novos publicados no DB (para visitantes sem rascunho)
        if (cms.__new_packages && typeof cms.__new_packages === 'object' && typeof DB !== 'undefined') {
            Object.assign(DB, cms.__new_packages);
        }

        // Remover cards marcados para remoÃ§Ã£o
        if (Array.isArray(cms.__removed_cards)) {
            cms.__removed_cards.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        }

        // Injetar cards de novos pacotes na home (index.html)
        if (cms.__new_packages && typeof cms.__new_packages === 'object') {
            const grid = document.querySelector('.cards-grid');
            if (grid) {
                const removed = Array.isArray(cms.__removed_cards) ? cms.__removed_cards : [];
                Object.entries(cms.__new_packages).forEach(([pkgId, pkg]) => {
                    const cardId = 'card-new-' + pkgId;
                    if (removed.includes(cardId)) return;
                    if (document.getElementById(cardId)) return;
                    const article = document.createElement('article');
                    article.className = 'card';
                    article.id = cardId;
                    article.setAttribute('onclick', "location.href='pacote.html?id=" + pkgId + "'");
                    article.style.cursor = 'pointer';
                    const img = pkg.images && pkg.images[0] ? pkg.images[0] : 'imagens/balneario_camboriu.png';
                    const badgeClass = (pkg.badge||'').includes('Popular') ? 'card-badge--popular' : (pkg.badge||'').includes('Premium') ? 'card-badge--premium' : 'card-badge--hot';
                    article.innerHTML = `
                        <div class="card-img-wrap">
                            <img src="${img}" alt="${pkg.title}" class="card-img" loading="lazy">
                            <div class="card-badge ${badgeClass}">${pkg.badge || 'ðŸ†• Novo'}</div>
                        </div>
                        <div class="card-body">
                            <div class="card-dest">${pkg.location || ''}</div>
                            <h3 class="card-title">${pkg.title}</h3>
                            <div class="card-dates">${pkg.duration || ''}</div>
                            <div class="card-price-block">
                                <div class="card-pix">Pix: <strong>R$ ${pkg.price || 'â€”'}</strong></div>
                                <div class="card-parcel">${pkg.parcelas || ''}</div>
                            </div>
                            <a href="pacote.html?id=${pkgId}" class="btn btn-card">Ver detalhes completos â†’</a>
                        </div>`;
                    grid.appendChild(article);
                });
            }
        }
    }

    /* â”€â”€â”€ FETCH CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    async function fetchContent() {
        // file:// nÃ£o tem servidor â€” retorna {} sem tentar fetch
        if (location.protocol === 'file:') return {};
        try {
            const r = await fetch(CONTENT_URL + '?_=' + Date.now());
            if (!r.ok) return {};
            const data = await r.json();
            return (data && typeof data === 'object') ? data : {};
        } catch (_) { return {}; }
    }

    async function loadAndApply(srv) {
        let merged = (srv && typeof srv === 'object') ? { ...srv } : {};
        // Expor CMS do servidor globalmente para que pacote.html possa mesclar
        if (srv) window.__LC_SRV_CMS = srv;
        if (editMode) {
            try {
                const draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');
                merged = { ...merged, ...draft };
            } catch (_) { /* localStorage corrompido, ignora */ }
        }
        applyContent(merged);
        return merged;
    }

    /* â”€â”€â”€ CSS DO EDITOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    function injectCSS() {
        if (document.getElementById('go-cms-css')) return;
        const s = document.createElement('style');
        s.id = 'go-cms-css';
        s.textContent = `
        #go-bar{position:fixed;top:0;left:0;right:0;z-index:99999;height:54px;background:#0f1623;display:flex;align-items:center;gap:6px;padding:0 14px;box-shadow:0 2px 20px rgba(0,0,0,.6);font-family:'Poppins',-apple-system,sans-serif;font-size:13px;border-bottom:1px solid rgba(255,255,255,.08);}
        #go-bar *{box-sizing:border-box;}
        .go-brand{color:#fff;font-weight:800;display:flex;align-items:center;gap:8px;padding-right:14px;border-right:1px solid rgba(255,255,255,.12);white-space:nowrap;margin-right:4px;font-size:14px;letter-spacing:-.01em;}
        .go-brand .go-logo-text{color:#E05220;}
        .go-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;flex-shrink:0;animation:gopulse 1.5s infinite;}
        @keyframes gopulse{0%,100%{opacity:1}50%{opacity:.3}}
        .go-hint{color:rgba(255,255,255,.5);font-size:12px;white-space:nowrap;}
        .go-btn{padding:7px 13px;border:none;border-radius:8px;background:transparent;color:rgba(255,255,255,.75);cursor:pointer;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap;outline:none;font-family:inherit;}
        .go-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
        .go-btn.orange{background:#E05220;color:#fff;}
        .go-btn.orange:hover{background:#c04418;}
        .go-btn.green{background:#16A34A;color:#fff;}
        .go-btn.green:hover{background:#15803D;}
        .go-btn.red{color:rgba(255,255,255,.4);font-size:12px;}
        .go-btn.red:hover{color:#F87171;background:rgba(248,113,113,.1);}
        .go-sep{width:1px;height:28px;background:rgba(255,255,255,.1);margin:0 3px;flex-shrink:0;}
        .go-spacer{flex:1;}
        .go-last-pub{color:rgba(255,255,255,.3);font-size:11px;white-space:nowrap;}

        body.go-on{padding-top:54px!important;}
        body.go-on [data-eid]{cursor:pointer!important;position:relative;transition:outline .1s;}
        body.go-on [data-eid]:hover{outline:2px dashed #E05220!important;outline-offset:3px;}
        body.go-on [data-eid]:hover::after{content:attr(data-elabel);position:absolute;top:-26px;left:0;background:#E05220;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;z-index:99997;pointer-events:none;font-family:-apple-system,sans-serif;}
        body.go-on [data-eid].go-sel{outline:2px solid #22A8C9!important;outline-offset:3px;}

        .go-panel{position:fixed;top:64px;right:18px;width:320px;border-radius:16px;z-index:99998;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:'Poppins',-apple-system,sans-serif;overflow:hidden;background:#1a2436 !important;color:#e8edf5 !important;}
        .go-ph{background:#0f1623;color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;border-bottom:2px solid #E05220;}
        .go-ph h3{font-size:13px;font-weight:700;margin:0;color:#fff !important;}
        .go-px{background:none;border:none;color:rgba(255,255,255,.55);font-size:18px;cursor:pointer;padding:0 2px;line-height:1;}
        .go-px:hover{color:#fff;}
        .go-pb{padding:16px;max-height:calc(100vh - 130px);overflow-y:auto;background:#1a2436 !important;color:#e8edf5 !important;}
        .go-f{margin-bottom:13px;}
        .go-f label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,.55) !important;margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
        .go-f input[type=text],.go-f input[type=url],.go-f input[type=password],.go-f textarea,.go-f select{width:100%;padding:8px 11px;border:1.5px solid rgba(255,255,255,.15);border-radius:8px;font-size:13px;outline:none;font-family:inherit;resize:vertical;transition:border .15s;background:#0f1623 !important;color:#e8edf5 !important;}
        .go-f input:focus,.go-f textarea:focus,.go-f select:focus{border-color:#E05220;}
        .go-rich{min-height:70px;padding:9px 11px;border:1.5px solid rgba(255,255,255,.15);border-radius:8px;font-size:13px;outline:none;transition:border .15s;line-height:1.5;background:#0f1623 !important;color:#e8edf5 !important;}
        .go-rich:focus{border-color:#E05220;}
        #gor,#gor *{background:#e2e2e2 !important;color:#1a1a1a !important;}
        .go-fmts{display:flex;gap:5px;margin-top:6px;}
        .go-fmts button{padding:4px 11px;border:1.5px solid rgba(255,255,255,.15);border-radius:6px;background:#243048 !important;color:#e8edf5 !important;cursor:pointer;font-size:13px;font-weight:700;transition:background .1s;}
        .go-fmts button:hover{background:#3a4a65 !important;}
        .go-cr{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
        .go-cr label{flex:1;font-size:12.5px;color:rgba(255,255,255,.7) !important;}
        .go-cr input[type=color]{width:40px;height:32px;padding:2px;border:1.5px solid rgba(255,255,255,.2);border-radius:6px;cursor:pointer;}
        .go-prev{width:100%;height:110px;object-fit:cover;border-radius:9px;margin-bottom:10px;background:#243048;display:block;}
        .go-acts{display:flex;gap:8px;margin-top:14px;}
        .go-ok{flex:1;padding:9px;background:#E05220;color:#fff !important;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:background .15s;font-family:inherit;}
        .go-ok:hover{background:#c04418;}
        .go-ko{padding:9px 14px;background:#243048 !important;color:rgba(255,255,255,.8) !important;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;}
        .go-ko:hover{background:#3a4a65 !important;}
        .go-hint-txt{font-size:11px;color:rgba(255,255,255,.4) !important;margin-top:4px;line-height:1.5;}
        .go-hr{border:none;border-top:1px solid rgba(255,255,255,.08);margin:12px 0;}
        .go-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .go-info{font-size:12px;color:rgba(255,255,255,.6) !important;background:rgba(255,255,255,.06) !important;border-radius:8px;padding:10px;margin-bottom:12px;line-height:1.5;}

        .go-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#0f1623;color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:999999;opacity:0;transition:all .28s;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:inherit;}
        .go-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .go-toast.ok{background:#16A34A;}
        .go-toast.err{background:#DC2626;}

        .go-pub-box{background:rgba(22,163,74,.15);border:1px solid rgba(22,163,74,.4);border-radius:10px;padding:14px;font-size:13px;color:#4ade80 !important;line-height:1.6;}
        .go-pub-err{background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.4);border-radius:10px;padding:14px;font-size:13px;color:#f87171 !important;line-height:1.6;}
        .go-spin{font-size:26px;animation:gospin 1s linear infinite;display:block;margin-bottom:8px;}
        @keyframes gospin{to{transform:rotate(360deg)}}
        .go-loading{text-align:center;padding:24px 16px;color:rgba(255,255,255,.5) !important;font-size:13px;}
        .go-dirty-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#FCD34D;margin-right:4px;flex-shrink:0;}

        .go-local-warn{background:rgba(224,82,32,.15);border:1px solid rgba(224,82,32,.3);border-radius:8px;padding:10px 12px;font-size:11px;color:#f07040 !important;margin-bottom:12px;line-height:1.5;}

        body.go-on .go-incluso{cursor:pointer!important;border-radius:6px;padding:3px 6px!important;transition:background .15s;}
        body.go-on .go-incluso:hover{background:rgba(224,82,32,.12)!important;outline:2px dashed #E05220!important;outline-offset:2px;}
        body.go-on .go-incluso.go-sel{outline:2px solid #22A8C9!important;outline-offset:2px;}

        @media(max-width:600px){
            #go-bar{padding:0 8px;gap:2px;}
            .go-hint,.go-sep,.go-last-pub{display:none;}
            .go-brand{padding-right:8px;font-size:12px;}
            .go-btn{padding:7px 9px;font-size:13px;}
            .go-btn-lbl{display:none;}
            .go-panel{left:6px;right:6px;width:auto;top:60px;}
            .go-pb{max-height:none;padding:14px;}
            .go-ph{cursor:default;}
        }
        `;
        document.head.appendChild(s);
    }

    /* â”€â”€â”€ EDITOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const isLocal = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    const ED = {
        cms: {},
        panel: null,

        async start(srv) {
            injectCSS();
            let draft = {};
            try { draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}'); } catch (_) {}
            this.cms = { ...(srv || {}), ...draft };

            document.body.classList.add('go-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildBar();
            this.bindAll();
            this.injectRemoveButtons();
            if (Object.keys(draft).length > 0) this.markDirty();
        },

        buildBar() {
            if (document.getElementById('go-bar')) return;
            const bar = document.createElement('div');
            bar.id = 'go-bar';
            const lastPub = localStorage.getItem('lc_last_pub') || '';
            bar.innerHTML = `
            <div class="go-brand"><span class="go-logo-text">LC Viagens v1</span><span class="go-dot"></span></div>
            <span class="go-hint">ðŸ‘† Clique em qualquer elemento para editar</span>
            <div class="go-spacer"></div>
            ${lastPub ? `<span class="go-last-pub">Pub: ${lastPub}</span><div class="go-sep"></div>` : ''}
            <button class="go-btn" id="go-pages">ðŸ“„ <span class="go-btn-lbl">PÃ¡ginas</span></button>
            <div class="go-sep"></div>
            <button class="go-btn" id="go-add-pkg">âž• <span class="go-btn-lbl">Pacote</span></button>
            <div class="go-sep"></div>
            <button class="go-btn orange" id="go-colors">ðŸŽ¨ <span class="go-btn-lbl">Cores</span></button>
            <div class="go-sep"></div>
            <button class="go-btn green" id="go-pub">ðŸš€ <span class="go-btn-lbl">Publicar</span></button>
            <div class="go-sep"></div>
            <button class="go-btn" id="go-revert" title="Descartar rascunho">â†© <span class="go-btn-lbl">Reverter</span></button>
            <button class="go-btn red" id="go-exit">âœ• <span class="go-btn-lbl">Sair</span></button>`;
            document.body.prepend(bar);
            document.getElementById('go-pages').onclick   = () => this.pPages();
            document.getElementById('go-add-pkg').onclick = () => this.pAddPacote();
            document.getElementById('go-colors').onclick  = () => this.pColors();
            document.getElementById('go-pub').onclick     = () => this.publish();
            document.getElementById('go-revert').onclick  = () => this.revert();
            document.getElementById('go-exit').onclick    = () => this.exit();
        },

        bindAll() {
            if (this._goDelegated) return;
            this._goDelegated = true;
            document.addEventListener('click', e => {
                const el = e.target.closest('[data-eid]');
                if (el && document.body.classList.contains('go-on')) {
                    // Ignora se estiver clicando dentro do painel do editor
                    if (e.target.closest('.go-panel') || e.target.closest('#go-bar')) return;

                    e.preventDefault();
                    e.stopPropagation();
                    document.querySelectorAll('.go-sel').forEach(x => x.classList.remove('go-sel'));
                    el.classList.add('go-sel');
                    this.dispatch(el);
                }
            }, true); // Usa capture para interceptar antes de qualquer onclick nativo
        },

        dispatch(el) {
            if (el.tagName === 'IMG')                      this.pImage(el);
            else if (el.tagName === 'A')                   this.pLink(el);
            else if (el.classList.contains('go-incluso'))  this.pInclusoItem(el);
            else                                           this.pText(el);
            this.addNavLink(el);
        },

        /* â”€â”€ BotÃ£o de navegaÃ§Ã£o para cards com onclick â”€â”€ */
        addNavLink(el) {
            const article = el.closest('article[onclick]');
            if (!article) return;
            const match = article.getAttribute('onclick').match(/href='([^']+)'/);
            if (!match) return;
            const url = match[1];
            const pb = this.panel && this.panel.querySelector('.go-pb');
            if (!pb) return;
            const nav = document.createElement('div');
            nav.style.cssText = 'margin-bottom:12px;padding:10px 14px;background:#f0f4fa;border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;';
            nav.innerHTML = `<span style="font-size:12px;color:#374151;">Quer ir para a pÃ¡gina?</span>
                <a href="${url}" style="font-size:12px;font-weight:700;color:#E05220;white-space:nowrap;">Abrir pacote â†’</a>`;
            pb.prepend(nav);
        },

        /* â”€â”€ PÃGINAS DO SITE â”€â”€ */
        pPages() {
            const pages = [
                { label: 'ðŸ  Home',          url: 'index.html' },
                { label: 'ðŸ§­ Quem Somos',    url: 'sobre.html' },
                { label: 'â­ Clientes',       url: 'clientes.html' },
                { label: 'ðŸ– BalneÃ¡rio',      url: 'pacote.html?id=balneario' },
                { label: 'âš½ Copa do Mundo',  url: 'pacote.html?id=copa-canada' },
                { label: 'ðŸ‡²ðŸ‡½ MÃ©xico',        url: 'pacote.html?id=copa-mexico' },
                { label: 'ðŸ‡ºðŸ‡¸ EUA',           url: 'pacote.html?id=copa-eua' },
                { label: 'ðŸŒŽ AmÃ©rica do Sul', url: 'pacote.html?id=copa-amsul' },
            ];
            const p = this.panel_('ðŸ“„ NavegaÃ§Ã£o â€” PÃ¡ginas do Site');
            const links = pages.map(pg => {
                const isActive = location.pathname.endsWith(pg.url.split('?')[0]) &&
                                 location.search === (pg.url.includes('?') ? '?' + pg.url.split('?')[1] : '');
                return `<a href="${pg.url}" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:${isActive?'#FFF7ED':'#F9FAFB'};border:1px solid ${isActive?'#FED7AA':'#E5E7EB'};border-radius:8px;margin-bottom:8px;font-size:13px;font-weight:600;color:${isActive?'#C2410C':'#1F2937'};text-decoration:none;">
                    <span>${pg.label}</span>
                    <span style="font-size:11px;color:#9CA3AF;">${isActive ? 'â† atual' : 'abrir â†’'}</span>
                </a>`;
            }).join('');
            p.innerHTML += `<div class="go-pb">
                <div style="font-size:11px;color:#6B7280;margin-bottom:12px;">O modo editor continua ativo ao navegar entre pÃ¡ginas.</div>
                ${links}
            </div>`;
        },

        /* â”€â”€ TEXTO â”€â”€ */
        pText(el) {
            const origHTML  = el.innerHTML;
            const origStyle = el.getAttribute('style') || '';
            const cs = getComputedStyle(el);
            let colorChanged = false, sizeChanged = false;
            const p = this.panel_('âœï¸ Editar Texto â€” ' + (el.dataset.elabel || ''));
            /* strip inline color/background from content so editor shows dark text on white */
            const _tmp = document.createElement('div');
            _tmp.innerHTML = el.innerHTML;
            _tmp.querySelectorAll('*').forEach(n => { n.style.color = ''; n.style.background = ''; n.style.backgroundColor = ''; });
            const _clean = _tmp.innerHTML;
            p.innerHTML += `<div class="go-pb">
                <div class="go-f"><label>ConteÃºdo</label>
                    <div class="go-rich" contenteditable="true" id="gor" style="background:#e2e2e2;color:#1a1a1a;border:2px solid #718096;min-height:70px;padding:9px 11px;border-radius:8px;font-size:13px;line-height:1.5;">${_clean}</div>
                    <div class="go-fmts">
                        <button onmousedown="event.preventDefault();document.execCommand('bold')"><b>N</b></button>
                        <button onmousedown="event.preventDefault();document.execCommand('italic')"><i>I</i></button>
                        <button onmousedown="event.preventDefault();document.execCommand('underline')"><u>S</u></button>
                    </div>
                </div>
                <div class="go-g2">
                    <div class="go-f"><label>Cor do texto</label><input type="color" id="gotc" value="${this.hex(cs.color)}"></div>
                    <div class="go-f"><label>Tamanho (px)</label><input type="text" id="gofs" value="${parseInt(cs.fontSize)||16}"></div>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">âœ“ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const rich = p.querySelector('#gor');
            const tc   = p.querySelector('#gotc');
            const fs   = p.querySelector('#gofs');
            rich.oninput = () => el.innerHTML = rich.innerHTML;
            tc.oninput   = () => { colorChanged = true; el.style.color = tc.value; };
            fs.oninput   = () => { sizeChanged  = true; el.style.fontSize = fs.value + 'px'; };
            p.querySelector('#goa').onclick = () => {
                const styleOverride = {};
                if (colorChanged) styleOverride.color = tc.value;
                if (sizeChanged)  styleOverride.fontSize = fs.value + 'px';
                const entry = { html: el.innerHTML };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('âœ“ Texto salvo no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                this.closePanel();
            };
        },

        /* â”€â”€ IMAGEM â”€â”€ */
        pImage(el) {
            const origSrc  = el.src;
            const origAttr = el.getAttribute('src') || el.src;
            const p = this.panel_('ðŸ–¼ï¸ Trocar Imagem â€” ' + (el.dataset.elabel || ''));
            const localWarn = isLocal ? `<div class="go-local-warn">âš ï¸ <strong>Modo local:</strong> Upload de arquivos sÃ³ funciona no site publicado (Vercel). Use uma URL de imagem abaixo.</div>` : '';
            p.innerHTML += `<div class="go-pb">
                ${localWarn}
                <img class="go-prev" id="goprev" src="${origSrc}" style="background:#F3F4F6;">
                <div class="go-f">
                    <label>Enviar do computador</label>
                    <button id="gobtn" style="width:100%;padding:10px;border:2px dashed #E5E7EB;border-radius:8px;background:#F9FAFB;cursor:pointer;font-size:13px;color:#374151;transition:border .15s;"${isLocal?' disabled title="DisponÃ­vel apenas no site publicado"':''}>
                        ðŸ“‚ Escolher arquivo (JPG, PNG, WEBP)
                    </button>
                    <input type="file" id="gofile" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none">
                    <div id="goupstatus" class="go-hint-txt" style="margin-top:6px;"></div>
                </div>
                <div class="go-f">
                    <label>Ou cole uma URL de imagem</label>
                    <input type="url" id="goiu" value="${origAttr}" placeholder="https://site.com/foto.jpg">
                    <p class="go-hint-txt">Cole qualquer URL de imagem da internet (JPG, PNG, WEBP)</p>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">âœ“ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const ui     = p.querySelector('#goiu');
            const pv     = p.querySelector('#goprev');
            const btn    = p.querySelector('#gobtn');
            const file   = p.querySelector('#gofile');
            const status = p.querySelector('#goupstatus');
            let debounce;

            if (!isLocal) {
                btn.onclick = () => file.click();
                btn.onmouseenter = () => btn.style.borderColor = '#E05220';
                btn.onmouseleave = () => btn.style.borderColor = '#E5E7EB';

                file.onchange = async () => {
                    const f = file.files[0];
                    if (!f) return;
                    if (f.size > 3 * 1024 * 1024) {
                        status.textContent = 'âŒ Arquivo muito grande (mÃ¡x 3MB). Comprima antes.';
                        status.style.color = '#DC2626';
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = async ev => {
                        const dataUrl = ev.target.result;
                        el.src = dataUrl;
                        pv.src = dataUrl;
                        btn.textContent = 'â³ Enviandoâ€¦';
                        btn.disabled = true;
                        status.textContent = 'Enviando para o servidorâ€¦';
                        status.style.color = '#6B7280';
                        try {
                            const b64 = dataUrl.split(',')[1];
                            const secret = localStorage.getItem(SECRET_KEY) || '';
                            const res = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ filename: f.name, base64: b64, secret })
                            });
                            const data = await res.json();
                            if (res.ok && data.url) {
                                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                                    if (e.tagName === 'IMG') e.src = data.url;
                                });
                                pv.src = data.url;
                                ui.value = data.url;
                                btn.textContent = 'âœ… Imagem enviada!';
                                status.textContent = 'Clique em âœ“ Aplicar para salvar.';
                                status.style.color = '#16A34A';
                            } else {
                                throw new Error(data.error || 'Erro no upload');
                            }
                        } catch (err) {
                            el.src = origSrc;
                            pv.src = origSrc;
                            btn.textContent = 'ðŸ“‚ Escolher arquivo';
                            btn.disabled = false;
                            status.textContent = 'âŒ ' + err.message;
                            status.style.color = '#DC2626';
                        }
                    };
                    reader.readAsDataURL(f);
                };
            }

            ui.oninput = () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const v = ui.value.trim();
                    if (v) { el.src = v; pv.src = v; }
                }, 500);
            };
            p.querySelector('#goa').onclick = () => {
                clearTimeout(debounce);
                const src = ui.value.trim() || origSrc;
                pv.src = src;
                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                    if (e.tagName === 'IMG') e.src = src;
                });
                this.store(el.dataset.eid, { src });
                this.closePanel();
                this.toast('âœ“ Imagem salva no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.src = origSrc;
                this.closePanel();
            };
        },

        /* â”€â”€ LINK â”€â”€ */
        pLink(el) {
            const origHTML   = el.innerHTML;
            const origStyle  = el.getAttribute('style') || '';
            const origHref   = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const cs = getComputedStyle(el);
            const p = this.panel_('ðŸ”— Editar BotÃ£o/Link â€” ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="go-pb">
                <div class="go-f"><label>Texto</label><input type="text" id="gobt" value="${el.textContent.trim()}"></div>
                <div class="go-f"><label>Link (URL)</label><input type="url" id="gobh" value="${origHref}" placeholder="https://wa.me/..."></div>
                <div class="go-f"><label>Abrir em</label>
                    <select id="gotgt">
                        <option value="_self" ${origTarget!=='_blank'?'selected':''}>Mesma aba</option>
                        <option value="_blank" ${origTarget==='_blank'?'selected':''}>Nova aba</option>
                    </select>
                </div>
                <div class="go-g2">
                    <div class="go-f"><label>Cor de fundo</label><input type="color" id="gobbg" value="${this.hex(cs.backgroundColor)}"></div>
                    <div class="go-f"><label>Cor do texto</label><input type="color" id="gobfg" value="${this.hex(cs.color)}"></div>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">âœ“ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const bt  = p.querySelector('#gobt');
            const bh  = p.querySelector('#gobh');
            const tgt = p.querySelector('#gotgt');
            const bbg = p.querySelector('#gobbg');
            const bfg = p.querySelector('#gobfg');
            let bgChanged = false, fgChanged = false;
            bt.oninput  = () => { const ic = el.querySelector('i'); el.textContent = bt.value; if(ic) el.prepend(ic.cloneNode(true)); };
            bbg.oninput = () => { bgChanged = true; el.style.backgroundColor = bbg.value; };
            bfg.oninput = () => { fgChanged = true; el.style.color = bfg.value; };
            p.querySelector('#goa').onclick = () => {
                el.setAttribute('href', bh.value);
                el.setAttribute('target', tgt.value);
                const styleOverride = {};
                if (bgChanged) styleOverride.backgroundColor = bbg.value;
                if (fgChanged) styleOverride.color = bfg.value;
                const entry = { html: el.innerHTML, href: bh.value, target: tgt.value };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('âœ“ BotÃ£o salvo no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                el.setAttribute('href', origHref);
                this.closePanel();
            };
        },

        /* â”€â”€ ITEM INCLUSO (emoji + texto) â”€â”€ */
        pInclusoItem(el) {
            const origHTML = el.innerHTML;
            const eid = el.dataset.eid;
            // Separar emoji do texto: o emoji Ã© o primeiro "token" antes do espaÃ§o
            const full = el.textContent.trim();
            const spaceIdx = full.indexOf(' ');
            const origEmoji = spaceIdx > -1 ? full.slice(0, spaceIdx) : '';
            const origText  = spaceIdx > -1 ? full.slice(spaceIdx + 1) : full;

            const p = this.panel_('âœï¸ Editar Item â€” ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="go-pb">
                <div class="go-f">
                    <label>Emoji / Ãcone</label>
                    <input type="text" id="go-emoji" value="${origEmoji}" placeholder="âœˆ ðŸ¨ ðŸŽŸ ðŸš ðŸ”’" style="font-size:20px;text-align:center;">
                    <p class="go-hint-txt">Cole ou digite qualquer emoji. Ex: âœˆ ðŸ¨ ðŸŽ¡ ðŸš ðŸ”’ ðŸŽŸ ðŸ– ðŸ” ðŸŒ¿</p>
                </div>
                <div class="go-f">
                    <label>Texto do item</label>
                    <input type="text" id="go-itext" value="${origText.replace(/"/g,'&quot;')}">
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">âœ“ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const emojiInp = p.querySelector('#go-emoji');
            const textInp  = p.querySelector('#go-itext');

            const preview = () => {
                const e = emojiInp.value.trim();
                const t = textInp.value.trim();
                el.textContent = e ? e + ' ' + t : t;
            };
            emojiInp.oninput = preview;
            textInp.oninput  = preview;

            p.querySelector('#goa').onclick = () => {
                const e = emojiInp.value.trim();
                const t = textInp.value.trim();
                const newText = e ? e + ' ' + t : t;
                el.textContent = newText;
                this.store(eid, { text: newText });
                this.closePanel();
                this.toast('âœ“ Item salvo no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.innerHTML = origHTML;
                this.closePanel();
            };
        },

        /* â”€â”€ BOTÃ•ES DE REMOÃ‡ÃƒO NOS CARDS DA HOME â”€â”€ */
        injectRemoveButtons() {
            // Cards de pacotes nacionais
            document.querySelectorAll('article.card[id]').forEach(article => {
                if (article.querySelector('.go-remove-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'go-remove-btn';
                btn.title = 'Remover este pacote';
                btn.innerHTML = 'âœ•';
                btn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:99990;width:28px;height:28px;border-radius:50%;background:#DC2626;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4);transition:all .15s;';
                btn.onmouseenter = () => btn.style.transform = 'scale(1.15)';
                btn.onmouseleave = () => btn.style.transform = '';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.confirmRemoveCard(article);
                };
                article.style.position = 'relative';
                article.appendChild(btn);
            });
            // Cards Copa 2026
            document.querySelectorAll('article.copa-card[id]').forEach(article => {
                if (article.querySelector('.go-remove-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'go-remove-btn';
                btn.title = 'Remover este pacote';
                btn.innerHTML = 'âœ•';
                btn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:99990;width:28px;height:28px;border-radius:50%;background:#DC2626;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4);transition:all .15s;';
                btn.onmouseenter = () => btn.style.transform = 'scale(1.15)';
                btn.onmouseleave = () => btn.style.transform = '';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.confirmRemoveCard(article);
                };
                article.style.position = 'relative';
                article.appendChild(btn);
            });
        },

        confirmRemoveCard(article) {
            const title = article.querySelector('[data-elabel]')?.dataset.elabel || article.id || 'este pacote';
            const p = this.panel_('ðŸ—‘ï¸ Remover Pacote');
            p.innerHTML += `<div class="go-pb">
                <div class="go-pub-err" style="margin-bottom:14px;">
                    âš ï¸ Tem certeza que deseja <strong>remover</strong> o card <em>"${title}"</em> da pÃ¡gina inicial?<br><br>
                    <span style="font-size:11px;opacity:.8;">Esta aÃ§Ã£o pode ser desfeita clicando em "Reverter" antes de publicar.</span>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa" style="background:#DC2626;">ðŸ—‘ï¸ Sim, remover</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#goc').onclick = () => this.closePanel();
            p.querySelector('#goa').onclick = () => {
                article.style.transition = 'all .3s';
                article.style.opacity = '0';
                article.style.transform = 'scale(.95)';
                setTimeout(() => article.remove(), 320);

                // Salvar lista de removidos no CMS
                const removed = this.cms.__removed_cards || [];
                if (!removed.includes(article.id)) removed.push(article.id);
                this.store('__removed_cards', removed);

                // Se for card de pacote novo, remove tambÃ©m de __new_packages
                if (article.id.startsWith('card-new-')) {
                    const pkgId = article.id.replace('card-new-', '');
                    const newPkgs = this.cms.__new_packages || {};
                    if (newPkgs[pkgId]) {
                        delete newPkgs[pkgId];
                        this.store('__new_packages', newPkgs);
                    }
                }

                this.closePanel();
                this.toast('âœ“ Card removido do rascunho', 'ok');
            };
        },

        /* â”€â”€ ADICIONAR NOVO PACOTE â”€â”€ */
        pAddPacote() {
            const p = this.panel_('âž• Adicionar Novo Pacote');
            p.innerHTML += `<div class="go-pb">
                <div class="go-info">Preencha os dados bÃ¡sicos. O pacote serÃ¡ adicionado Ã  lista e ficarÃ¡ disponÃ­vel via <code>pacote.html?id=SEU_ID</code>.</div>
                <div class="go-f"><label>ID do pacote (sem espaÃ§os)</label>
                    <input type="text" id="gp-id" placeholder="ex: cancun, dubai, paris2026">
                    <p class="go-hint-txt">Use letras minÃºsculas, nÃºmeros e _ (underline). Ex: cancun, copa_dubai</p>
                </div>
                <div class="go-f"><label>TÃ­tulo</label><input type="text" id="gp-title" placeholder="Ex: CancÃºn â€“ Caribe Mexicano"></div>
                <div class="go-f"><label>SubtÃ­tulo</label><input type="text" id="gp-sub" placeholder="Ex: Praias paradisÃ­acas e resorts all inclusive"></div>
                <div class="go-f"><label>LocalizaÃ§Ã£o</label><input type="text" id="gp-loc" placeholder="Ex: CancÃºn, MÃ©xico"></div>
                <div class="go-f"><label>DuraÃ§Ã£o</label><input type="text" id="gp-dur" placeholder="Ex: 7 dias / 6 noites"></div>
                <div class="go-f"><label>PreÃ§o PIX (R$)</label><input type="text" id="gp-price" placeholder="Ex: 8.900,00"></div>
                <div class="go-f"><label>PreÃ§o CartÃ£o (R$)</label><input type="text" id="gp-cartao" placeholder="Ex: 9.350,00"></div>
                <div class="go-f"><label>Parcelas</label><input type="text" id="gp-parc" placeholder="Ex: 10x de R$ 935,00 sem juros"></div>
                <div class="go-f"><label>Flag / PaÃ­s</label><input type="text" id="gp-flag" placeholder="Ex: MÃ©xico ðŸŒ®"></div>
                <div class="go-f"><label>Badge</label><input type="text" id="gp-badge" placeholder="Ex: ðŸ”¥ Oferta  ou  â­ Popular"></div>
                <div class="go-f"><label>Categoria</label>
                    <select id="gp-cat" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:.9rem;" >
                        <option value="nacional">ðŸ‡§ðŸ‡· Nacional (aparece na aba Nacional)</option>
                        <option value="internacional">ðŸŒ Internacional (aparece na aba Internacional)</option>
                        <option value="copa">ðŸ† Copa 2026 (seÃ§Ã£o Copa)</option>
                    </select>
                </div>
                <div class="go-f"><label>Imagem 1 â€” Principal (URL)</label>
                    <input type="url" id="gp-img" placeholder="https://site.com/foto1.jpg">
                </div>
                <div class="go-f"><label>Imagem 2 (URL) â€” opcional</label>
                    <input type="url" id="gp-img2" placeholder="https://site.com/foto2.jpg">
                </div>
                <div class="go-f"><label>Imagem 3 (URL) â€” opcional</label>
                    <input type="url" id="gp-img3" placeholder="https://site.com/foto3.jpg">
                    <p class="go-hint-txt">As 3 imagens aparecem no carrossel da pÃ¡gina do pacote.</p>
                </div>
                <div class="go-f"><label>DescriÃ§Ã£o do destino</label>
                    <textarea id="gp-desc" rows="4" placeholder="Descreva o destino e os destaques do pacoteâ€¦"></textarea>
                </div>
                <div class="go-f"><label>O que estÃ¡ incluso</label>
                    <textarea id="gp-incluso" rows="5" placeholder="Um item por linha. Ex:&#10;âœˆ Passagem aÃ©rea ida e volta&#10;ðŸ¨ Hotel 4â˜… com cafÃ© da manhÃ£&#10;ðŸš Transfer In/Out"></textarea>
                    <p class="go-hint-txt">Um item por linha. Comece com o emoji desejado.</p>
                </div>
                <div class="go-f"><label>NÃ£o incluso</label>
                    <textarea id="gp-nao" rows="3" placeholder="Um item por linha. Ex:&#10;AlmoÃ§os e jantares&#10;Gorjetas"></textarea>
                </div>
                <div class="go-f"><label>Roteiro (um dia por linha)</label>
                    <textarea id="gp-rot" rows="6" placeholder="Formato: TÃ­tulo do dia | DescriÃ§Ã£o&#10;Ex:&#10;Chegada a CancÃºn | Transfer ao resort. Check-in e tarde livre.&#10;Praia + Piscina | Dia de relaxamento no resort all inclusive."></textarea>
                    <p class="go-hint-txt">Separe tÃ­tulo e descriÃ§Ã£o com <strong>|</strong>. Um dia por linha.</p>
                </div>
                <div class="go-acts" style="margin-top:16px;">
                    <button class="go-ok" id="goa">âœ“ Criar Pacote</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#goc').onclick = () => this.closePanel();
            p.querySelector('#goa').onclick = () => {
                const id      = p.querySelector('#gp-id').value.trim().replace(/[^a-z0-9_]/gi,'_').toLowerCase();
                const title   = p.querySelector('#gp-title').value.trim();
                const imgUrl  = p.querySelector('#gp-img').value.trim();
                const imgUrl2 = p.querySelector('#gp-img2').value.trim();
                const imgUrl3 = p.querySelector('#gp-img3').value.trim();

                if (!id)    { p.querySelector('#gp-id').focus();    p.querySelector('#gp-id').style.borderColor='#DC2626';    return; }
                if (!title) { p.querySelector('#gp-title').focus(); p.querySelector('#gp-title').style.borderColor='#DC2626'; return; }

                const incluso = p.querySelector('#gp-incluso').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const nao     = p.querySelector('#gp-nao').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const rotLines = p.querySelector('#gp-rot').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const roteiro = rotLines.map((line, i) => {
                    const [t, d] = line.split('|').map(s=>s.trim());
                    return { dia: (i+1) + 'Âº Dia', title: t || ('Dia ' + (i+1)), desc: d || '' };
                });

                const images = [imgUrl, imgUrl2, imgUrl3].filter(Boolean);
                if (!images.length) images.push('imagens/balneario_camboriu.png');

                const novoPacote = {
                    category:    p.querySelector('#gp-cat').value || 'nacional',
                    title:       title,
                    subtitle:    p.querySelector('#gp-sub').value.trim(),
                    location:    p.querySelector('#gp-loc').value.trim(),
                    duration:    p.querySelector('#gp-dur').value.trim(),
                    price:       p.querySelector('#gp-price').value.trim(),
                    priceCartao: p.querySelector('#gp-cartao').value.trim(),
                    parcelas:    p.querySelector('#gp-parc').value.trim(),
                    flag:        p.querySelector('#gp-flag').value.trim(),
                    badge:       p.querySelector('#gp-badge').value.trim(),
                    images,
                    desc:        p.querySelector('#gp-desc').value.trim(),
                    incluso,
                    nao_incluso: nao,
                    roteiro
                };

                // Salvar no CMS como __new_packages
                const existing = this.cms.__new_packages || {};
                existing[id] = novoPacote;
                this.store('__new_packages', existing);

                this.closePanel();
                this.toast('âœ“ Pacote "' + title + '" criado! Acesse: pacote.html?id=' + id, 'ok');

                // Mostrar link de acesso
                setTimeout(() => {
                    const info = document.createElement('div');
                    info.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1a2436;color:#e8edf5;padding:14px 22px;border-radius:12px;font-size:13px;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,.4);text-align:center;border:1px solid rgba(255,255,255,.1);';
                    info.innerHTML = `ðŸ“¦ Pacote criado!<br><a href="pacote.html?id=${id}" style="color:#E05220;font-weight:700;" target="_blank">â†’ Abrir pacote.html?id=${id}</a><br><span style="font-size:11px;opacity:.6;margin-top:4px;display:block;">Publique para tornar permanente.</span>`;
                    document.body.appendChild(info);
                    setTimeout(() => info.remove(), 7000);
                }, 400);
            };
        },

        /* â”€â”€ CORES GLOBAIS â”€â”€ */
        pColors() {
            const root = document.documentElement;
            const g = v => getComputedStyle(root).getPropertyValue(v).trim() || '#000000';
            const p = this.panel_('ðŸŽ¨ Cores Globais do Site');
            p.innerHTML += `<div class="go-pb">
                <div class="go-info">Altera as cores principais em todo o site de uma sÃ³ vez.</div>
                <div class="go-cr"><label>ðŸŸ  Laranja principal</label><input type="color" id="gog1" value="${this.hex(g('--orange'))||'#E05220'}"></div>
                <div class="go-cr"><label>ðŸŸ  Laranja escuro</label><input type="color" id="gog2" value="${this.hex(g('--orange-dark'))||'#c04418'}"></div>
                <div class="go-cr"><label>ðŸ”µ Azul destaque</label><input type="color" id="gog3" value="${this.hex(g('--blue'))||'#22A8C9'}"></div>
                <div class="go-cr"><label>â¬› Fundo dark</label><input type="color" id="gog4" value="${this.hex(g('--dark'))||'#0f1623'}"></div>
                <hr class="go-hr">
                <div class="go-f"><label>ðŸ“± NÃºmero do WhatsApp</label>
                    <input type="text" id="gogwa" value="${this.cms.whatsapp||''}" placeholder="5521966501302">
                    <p class="go-hint-txt">Somente nÃºmeros com DDD e cÃ³digo do paÃ­s. Atualiza todos os botÃµes do site.</p>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">âœ“ Aplicar cores</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const vars   = ['--orange','--orange-dark','--blue','--dark'];
            const inputs = ['gog1','gog2','gog3','gog4'].map(id => p.querySelector('#'+id));
            const waInp  = p.querySelector('#gogwa');
            inputs.forEach((inp, i) => {
                inp.oninput = () => root.style.setProperty(vars[i], inp.value);
            });
            waInp.oninput = () => {
                const num = waInp.value.replace(/\D/g, '');
                if (num) document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + num);
                });
            };
            p.querySelector('#goa').onclick = () => {
                const colors = {};
                vars.forEach((v, i) => colors[v] = inputs[i].value);
                this.cms.colors = { ...(this.cms.colors || {}), ...colors };
                const num = waInp.value.replace(/\D/g, '');
                if (num) this.cms.whatsapp = num;
                localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
                this.markDirty();
                this.closePanel();
                this.toast('âœ“ Cores salvas no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                vars.forEach(v => root.style.removeProperty(v));
                applyContent(this.cms);
                this.closePanel();
            };
        },

        /* â”€â”€ REVERTER â”€â”€ */
        revert() {
            let hasDraft = false;
            try { hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0; } catch (_) {}
            if (!hasDraft) { this.toast('NÃ£o hÃ¡ rascunho para descartar', ''); return; }
            if (!confirm('Descartar todas as alteraÃ§Ãµes nÃ£o publicadas? O site voltarÃ¡ ao conteÃºdo publicado.')) return;
            localStorage.removeItem(CMS_KEY);
            document.querySelectorAll('.go-dirty-dot').forEach(d => d.remove());
            this.toast('Rascunho descartado. Recarregandoâ€¦', '');
            setTimeout(() => location.reload(), 900);
        },

        /* â”€â”€ PUBLICAR â”€â”€ */
        async publish() {
            if (isLocal) {
                this.toast('âš ï¸ Publicar sÃ³ funciona no site no Vercel', 'err');
                this.panel_('âš ï¸ PublicaÃ§Ã£o IndisponÃ­vel').innerHTML += `<div class="go-pb">
                    <div class="go-local-warn" style="margin-bottom:0;">
                        <strong>VocÃª estÃ¡ no modo local.</strong><br>
                        Para publicar, acesse o editor pelo site publicado:<br><br>
                        <a href="https://321go-psi.vercel.app/admin/login.html" target="_blank" style="color:#C2410C;font-weight:700;">
                            â†’ Abrir site no Vercel
                        </a>
                    </div>
                    <button class="go-ko" style="width:100%;margin-top:14px" onclick="this.closest('.go-panel').remove()">Fechar</button>
                </div>`;
                return;
            }

            const elems   = Object.keys(this.cms).filter(k => k !== 'colors' && k !== 'whatsapp');
            const hasCols = this.cms.colors && Object.keys(this.cms.colors).length > 0;
            const hasWA   = !!this.cms.whatsapp;
            const total   = elems.length + (hasCols ? 1 : 0) + (hasWA ? 1 : 0);

            if (total === 0) { this.toast('Nenhuma alteraÃ§Ã£o para publicar', ''); return; }

            let items = '';
            if (elems.length) items += `<li>${elems.length} elemento(s) editados</li>`;
            if (hasCols) items += `<li>Cores globais do site</li>`;
            if (hasWA)   items += `<li>WhatsApp: ${this.cms.whatsapp}</li>`;

            const hasSavedSecret = !!localStorage.getItem(SECRET_KEY);
            const p = this.panel_('ðŸš€ Publicar AlteraÃ§Ãµes');
            p.innerHTML += `<div class="go-pb">
                <div class="go-info" style="background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:10px;padding:14px;margin-bottom:14px;line-height:1.8;">
                    <strong>O que serÃ¡ publicado:</strong><ul style="margin:8px 0 0 16px;">${items}</ul>
                </div>
                ${!hasSavedSecret ? `<div class="go-f"><label>ðŸ”‘ Senha de acesso</label>
                    <input type="password" id="gopwd" placeholder="Digite sua senha admin"></div>` : ''}
                <p class="go-hint-txt">Estas mudanÃ§as ficarÃ£o visÃ­veis para todos os visitantes em ~30 segundos.</p>
                <div class="go-acts" style="margin-top:14px;">
                    <button class="go-ok" id="goa">âœ“ Confirmar e publicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#goc').onclick = () => this.closePanel();
            p.querySelector('#goa').onclick = async () => {
                const pwdEl = p.querySelector('#gopwd');
                let secret = localStorage.getItem(SECRET_KEY) || '';
                if (pwdEl) {
                    if (!pwdEl.value) { pwdEl.focus(); pwdEl.style.borderColor='#DC2626'; return; }
                    secret = pwdEl.value;
                    localStorage.setItem(SECRET_KEY, secret);
                }
                p.querySelector('.go-pb').innerHTML = `<div class="go-loading"><span class="go-spin">â³</span>Publicando alteraÃ§Ãµesâ€¦</div>`;
                try {
                    const res = await fetch('/api/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: this.cms, secret })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        localStorage.removeItem(CMS_KEY);
                        const now = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
                        localStorage.setItem('lc_last_pub', now);
                        document.querySelectorAll('.go-dirty-dot').forEach(d => d.remove());
                        const lp = document.querySelector('.go-last-pub');
                        if (lp) lp.textContent = 'Pub: ' + now;
                        applyContent(this.cms);
                        p.querySelector('.go-pb').innerHTML = `
                            <div class="go-pub-box">âœ… <strong>Publicado com sucesso!</strong><br>
                            Visitantes verÃ£o as mudanÃ§as em alguns segundos.</div>
                            <button class="go-ok" style="width:100%;margin-top:12px" onclick="this.closest('.go-panel').remove()">âœ“ OK</button>`;
                        this.toast('âœ… Publicado com sucesso!', 'ok');
                    } else {
                        throw new Error(data.error || 'Erro desconhecido');
                    }
                } catch (err) {
                    p.querySelector('.go-pb').innerHTML = `
                        <div class="go-pub-err">âŒ <strong>Erro:</strong> ${err.message}</div>
                        <button class="go-ko" style="width:100%;margin-top:12px" onclick="this.closest('.go-panel').remove()">Fechar</button>`;
                    this.toast('âŒ Erro ao publicar', 'err');
                }
            };
        },

        /* â”€â”€ SAIR â”€â”€ */
        exit() {
            let hasDraft = false;
            try { hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0; } catch (_) {}
            if (hasDraft && !confirm('Sair do editor? VocÃª tem alteraÃ§Ãµes nÃ£o publicadas (rascunho salvo).')) return;
            sessionStorage.removeItem('editor_active');
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(SECRET_KEY);
            const u = new URL(location.href);
            u.searchParams.delete('editor');
            location.replace(u.toString());
        },

        /* â”€â”€ HELPERS â”€â”€ */
        panel_(title) {
            this.closePanel();
            const p = document.createElement('div');
            p.className = 'go-panel';
            p.style.cssText = 'color:#e8edf5;background:#1a2436;';
            p.innerHTML = `<div class="go-ph"><h3>${title}</h3><button class="go-px" title="Fechar">âœ•</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.go-px').onclick = () => this.closePanel();
            this.drag_(p);
            this.panel = p;
            return p;
        },

        closePanel() {
            document.querySelectorAll('.go-panel').forEach(x => x.remove());
            document.querySelectorAll('.go-sel').forEach(x => x.classList.remove('go-sel'));
            this.panel = null;
        },

        drag_(el) {
            if (window.matchMedia('(max-width:600px)').matches) return;
            const h = el.querySelector('.go-ph');
            let d=false, sx=0, sy=0, ox=0, oy=0;
            h.onmousedown = e => { d=true; sx=e.clientX; sy=e.clientY; ox=el.offsetLeft; oy=el.offsetTop; e.preventDefault(); };
            document.addEventListener('mousemove', e => { if(!d) return; el.style.left=ox+e.clientX-sx+'px'; el.style.top=oy+e.clientY-sy+'px'; });
            document.addEventListener('mouseup', () => d=false);
        },

        store(key, val) {
            // â”€â”€ SINCRONIZAÃ‡ÃƒO AUTOMÃTICA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            // Qualquer ediÃ§Ã£o de preÃ§o/tÃ­tulo/parcela em qualquer pÃ¡gina
            // Ã© salva em __db_overrides[pkgId][campo] â€” fonte Ãºnica de verdade.
            const DB_FIELDS = {
                'pkg-price':        'price',
                'pkg-price-cartao': 'priceCartao',
                'pkg-parcelas':     'parcelas',
                'pkg-title':        'title',
                'pkg-subtitle':     'subtitle',
                'pkg-badge':        'badge',
                'pkg-desc':         'desc',
            };
            const HOME_FIELDS = {
                'pix':    'priceCartao',
                'parcel': 'parcelas',
                'titulo': 'title',
                'dest':   'location',
                'badge':  'badge',
            };

            // Extrai o valor numÃ©rico/texto limpo do HTML
            // Ex: "No cartÃ£o: <strong>R$ 2.550,50</strong>" â†’ "2.550,50"
            // Ex: "ou 10x de <strong>R$ 255,00</strong> sem juros" â†’ "10x de R$ 255,00 sem juros"
            function extractValue(html, dbField) {
                if (!html) return '';
                const plain = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim();
                // Para preÃ§o cartÃ£o: extrai sÃ³ o nÃºmero apÃ³s "R$"
                if (dbField === 'priceCartao') {
                    const m = plain.match(/R\$\s*([\d.,]+)/);
                    return m ? m[1] : plain;
                }
                // Para preÃ§o PIX: extrai sÃ³ o nÃºmero apÃ³s "R$"
                if (dbField === 'price') {
                    const m = plain.match(/R\$\s*([\d.,]+)/);
                    return m ? m[1] : plain;
                }
                return plain;
            }

            // PadrÃ£o pacote.html: "gramado-pkg-price"
            const pkgMatch = key.match(/^([a-z0-9_]+)-pkg-(.+)$/);
            if (pkgMatch) {
                const [, pkgId, field] = pkgMatch;
                const dbField = DB_FIELDS['pkg-' + field];
                if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
                    const overrides = this.cms.__db_overrides || {};
                    if (!overrides[pkgId]) overrides[pkgId] = {};
                    const rawVal = val.html != null
                        ? extractValue(val.html, dbField)
                        : (val.text || '');
                    if (rawVal) overrides[pkgId][dbField] = rawVal;
                    this.cms.__db_overrides = overrides;
                    Object.assign(DB[pkgId], overrides[pkgId]);
                }
            }

            // PadrÃ£o home: "pix-gramado" ou "parcel-gramado"
            const homeMatch = key.match(/^(pix|parcel|titulo|dest|badge)-([a-z0-9_]+)$/);
            if (homeMatch) {
                const [, field, pkgId] = homeMatch;
                const dbField = HOME_FIELDS[field];
                if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
                    const overrides = this.cms.__db_overrides || {};
                    if (!overrides[pkgId]) overrides[pkgId] = {};
                    const rawVal = val.html != null
                        ? extractValue(val.html, dbField)
                        : (val.text || '');
                    if (rawVal) overrides[pkgId][dbField] = rawVal;
                    this.cms.__db_overrides = overrides;
                    Object.assign(DB[pkgId], overrides[pkgId]);
                }
            }

            this.cms[key] = val;
            localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
            this.markDirty();
        },

        markDirty() {
            const btn = document.getElementById('go-pub');
            if (btn && !btn.querySelector('.go-dirty-dot')) {
                const dot = document.createElement('span');
                dot.className = 'go-dirty-dot';
                btn.prepend(dot);
            }
        },

        toast(msg, type='') {
            document.querySelectorAll('.go-toast').forEach(t => t.remove());
            const t = document.createElement('div');
            t.className = 'go-toast' + (type?' '+type:'');
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 320); }, 3000);
        },

        hex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
            if (rgb.startsWith('#')) return rgb;
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return '#ffffff';
            return '#' + m.slice(0,3).map(n => (+n).toString(16).padStart(2,'0')).join('');
        }
    };

    /* â”€â”€â”€ BOOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    document.addEventListener('DOMContentLoaded', async () => {
        const srv = await fetchContent();
        await loadAndApply(srv);
        if (editMode) {
            await ED.start(srv);
            setTimeout(() => { ED.bindAll(); ED.injectRemoveButtons(); }, 500);
        }
    });

    window._GO_CMS = ED;
})();

