# LC Viagens — Registro Completo do Projeto

## 📋 DADOS DA EMPRESA

| Campo | Valor |
|-------|-------|
| **Nome** | LC Viagens |
| **Responsável** | Clebert Rocha |
| **WhatsApp** | (82) 98801-7594 |
| **WhatsApp Reservas** | @lc_viagenss2 |
| **Instagram** | @lc_viagenss |
| **E-mail** | agencialcviagens@gmail.com |
| **Localização** | Alagoas, AL |
| **Registro** | CADASTUR |

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
lc-viagens/
├── index.html          → Página principal do site
├── pacote.html         → Página de detalhes de cada pacote
├── style.css           → Estilos visuais (design premium)
├── main.js             → Lógica do site (menu, formulário, animações)
├── editor.js           → Editor visual CMS (modo admin)
├── content.json        → Dados do CMS (editados pelo admin)
├── vercel.json         → Configuração de deploy (Vercel)
├── REGISTRO-PROJETO.md → Este arquivo de documentação
│
├── js/
│   └── database.js     → Banco de dados dos pacotes
│
├── admin/
│   └── login.html      → Painel de login do administrador
│
├── api/
│   ├── auth.js         → API de autenticação
│   ├── content.js      → API de leitura do CMS
│   ├── publish.js      → API de publicação (GitHub)
│   └── upload.js       → API de upload de imagens
│
└── imagens/
    ├── logo_lc.jfif           → Logo da LC Viagens
    ├── lc_foto1.jpg           → Foto enviada pelo cliente
    ├── lc_foto2.jpg           → Foto enviada pelo cliente
    ├── lc_foto3.jpg           → Foto enviada pelo cliente
    ├── lc_foto4.jpg           → Foto enviada pelo cliente
    ├── balneario_camboriu.png → Imagem destino
    ├── maceio.png             → Imagem destino
    ├── gramado.png            → Imagem destino
    ├── bariloche.png          → Imagem destino
    ├── curitiba.png           → Imagem destino
    └── ... (demais imagens)
```

---

## ✈️ PACOTES CADASTRADOS

### 🌍 Internacional

#### 1. De Milão: Trem Bernina e São Moritz
- **ID:** `milao_bernina`
- **Localização:** Milão, Itália / São Moritz, Suíça
- **Duração:** 1 dia (excursão)
- **Preço PIX:** R$ 1.138,74
- **Preço Cartão:** R$ 1.198,67
- **Parcelas:** 10x de R$ 119,87 sem juros
- **Badge:** ⭐ 4,5 (4733 avaliações)
- **Incluso:** Transfer ônibus Milão→Tirano, Trem Bernina, Tempo livre em St. Moritz, Retorno ônibus, Guia turístico

#### 2. Bariloche – Circuito Chico + Cerro Catedral
- **ID:** `bariloche`
- **Localização:** Bariloche, Argentina
- **Duração:** 6 dias / 5 noites
- **Preço PIX:** R$ 10.704,00
- **Preço Cartão:** R$ 11.240,00
- **Parcelas:** 12x de R$ 936,67 sem juros
- **Badge:** 💎 Premium

---

### 🇧🇷 Nacional

#### 3. Balneário Camboriú + Beto Carrero
- **ID:** `balneario`
- **Localização:** Balneário Camboriú, SC
- **Duração:** 5 dias / 4 noites
- **Preço PIX:** R$ 2.486,13
- **Preço Cartão:** R$ 2.605,80
- **Parcelas:** 10x de R$ 260,58 sem juros
- **Badge:** 🔥 Oferta

#### 4. Maceió – Praias Paradisíacas
- **ID:** `maceio`
- **Localização:** Maceió, AL
- **Duração:** 8 dias / 7 noites
- **Preço PIX:** R$ 4.281,83
- **Preço Cartão:** R$ 4.502,69
- **Parcelas:** 10x de R$ 450,27 sem juros
- **Badge:** ⭐ Popular

#### 5. Gramado + Noite Gaúcha
- **ID:** `gramado`
- **Localização:** Gramado, RS
- **Duração:** 7 dias / 6 noites
- **Preço PIX:** R$ 2.550,00
- **Preço Cartão:** R$ 2.680,00
- **Parcelas:** 10x de R$ 268,00 sem juros
- **Badge:** ⭐ Popular

---

## 🔐 ACESSO ADMIN / CMS

| Campo | Valor |
|-------|-------|
| **URL Admin** | `/admin/login.html` |
| **E-mail** | admin@lcviagens.com.br |
| **Senha local** | LCViagens@2026 |
| **Chave CMS localStorage** | `lc_cms_v1` |
| **Chave Auth localStorage** | `lc_auth` |
| **Chave Secret localStorage** | `lc_secret` |

---

## 🚀 DEPLOY (VERCEL)

### Variáveis de Ambiente necessárias no Vercel:
```
ADMIN_SECRET=LCViagens@2026
GITHUB_TOKEN=<token do GitHub>
GITHUB_OWNER=<usuario do GitHub>
GITHUB_REPO=lc-viagens
GITHUB_BRANCH=master
```

### Como fazer deploy:
1. Criar repositório no GitHub chamado `lc-viagens`
2. Fazer push de todos os arquivos desta pasta
3. Conectar o repositório ao Vercel
4. Configurar as variáveis de ambiente acima
5. Deploy automático!

---

## 🎨 DESIGN / PALETA DE CORES

| Variável | Cor | Uso |
|----------|-----|-----|
| `--orange` | #E05220 | Cor principal, botões, destaques |
| `--orange-dark` | #c04418 | Hover dos botões |
| `--blue` | #22A8C9 | Cor secundária, badges |
| `--dark` | #0f1623 | Fundo escuro, header pacote |
| Font | Poppins | Toda a tipografia |

---

## 📱 LINKS IMPORTANTES

- **WhatsApp direto:** https://wa.me/5582988017594
- **Instagram:** https://instagram.com/lc_viagenss
- **Instagram Reservas:** https://instagram.com/lc_viagenss2
- **E-mail:** agencialcviagens@gmail.com

---

## 📝 HISTÓRICO DE CRIAÇÃO

- **Data de criação:** 2026
- **Base:** Site 321 GO! (Patrícia e Tatiana) — mesmo padrão e tecnologia
- **Tecnologia:** HTML5 + CSS3 + JavaScript puro (sem frameworks)
- **CMS:** Editor visual próprio com publicação via GitHub API
- **Hospedagem recomendada:** Vercel (gratuito)

---

## ✅ CHECKLIST DE ENTREGA

- [x] index.html — Página principal
- [x] pacote.html — Página de detalhes
- [x] style.css — Estilos
- [x] main.js — JavaScript principal
- [x] editor.js — CMS visual
- [x] js/database.js — Banco de pacotes
- [x] admin/login.html — Painel admin
- [x] api/ — APIs completas
- [x] content.json — CMS limpo
- [x] vercel.json — Config deploy
- [x] Pacote Milão/Bernina cadastrado
- [x] Pacotes nacionais cadastrados
- [x] WhatsApp: (82) 98801-7594
- [x] E-mail: agencialcviagens@gmail.com
- [x] Instagram: @lc_viagenss
- [ ] Logo real inserida (substituir imagens/logo_lc.jfif)
- [ ] Deploy no Vercel
- [ ] Configurar variáveis de ambiente

---

*Projeto desenvolvido com o padrão LC Viagens — mesmo sistema do 321 GO!*
