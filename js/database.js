/**
 * LC Viagens — Banco de Dados Centralizado de Pacotes
 * Fonte única de verdade: home, pacote.html e editor usam este arquivo.
 */

/* ── DADOS DA AGÊNCIA ── */
const SITE = {
    nome:     'LC Viagens',
    whatsapp: '5582988017594',
    email:    'agencialcviagens@gmail.com',
    tel:      '(82) 98801-7594',
    insta:    'lc_viagenss'
};

/* ── THUMB MAP ── */
const THUMB = {
    milao_bernina: 'imagens/lc_foto1.jpg',
    balneario:     'imagens/balneario_camboriu.png',
    maceio:        'imagens/maceio.png',
    gramado:       'imagens/gramado.png',
    bariloche:     'imagens/bariloche.png',
    curitiba:      'imagens/curitiba.png',
    porto:         'imagens/porto_seguro.png'
};

/* ── BANCO DE PACOTES ── */
const DB = {

    /* ════ INTERNACIONAIS ════ */
    milao_bernina: {
        category: 'internacional',
        title:    'De Milão: Trem Bernina e São Moritz',
        subtitle: 'Paisagens espetaculares dos Alpes Suíços a bordo do trem turístico vermelho',
        location: 'Milão, Itália / São Moritz, Suíça',
        duration: '1 dia (excursão)',
        price:       '1.138,74',
        priceCartao: '1.198,67',
        parcelas:    '10x de R$ 119,87 sem juros',
        flag:  'Itália / Suíça 🇮🇹🇨🇭',
        badge: '⭐ 4,5 (4733 avaliações)',
        images: [
            'imagens/lc_foto1.jpg',
            'imagens/lc_foto2.jpg',
            'imagens/lc_foto3.jpg',
            'imagens/lc_foto4.jpg',
            'imagens/lc_foto5.jpg',
            'imagens/lc_foto6.jpg'
        ],
        dates: '⚠️ Esgota rápido — Consulte disponibilidade',
        desc: 'Faça uma excursão pelas paisagens espetaculares dos Alpes Suíços a bordo do trem turístico vermelho Bernina até o resort de luxo de St. Moritz. Termine sua viagem com uma volta a Milão de ônibus.\n\nParta de Milão em uma incrível viagem de um dia pelas paisagens deslumbrantes dos Alpes Suíços. Viaje a bordo do famoso trem panorâmico Bernina, percorrendo uma das ferrovias mais altas da Europa, alcançando até 2256 metros acima do nível do mar, com vistas impressionantes de geleiras, montanhas e vales.\n\nDurante o trajeto, aproveite para tirar fotos incríveis enquanto o trem serpenteia por paisagens naturais praticamente intocadas. O percurso inclui a ida de ônibus até a charmosa cidade de Tirano, na região de Valtellina, onde começa a experiência ferroviária.\n\nEm seguida, embarque no trem Bernina rumo ao luxuoso destino de St. Moritz. Ao chegar, tenha tempo livre para explorar a cidade, conhecer suas lojas elegantes e apreciar o charme desse famoso resort alpino.\n\nObservação: O itinerário pode sofrer alterações para garantir a melhor experiência.',
        incluso: [
            '🚌 Transfer de ônibus Milão → Tirano',
            '🚂 Trem panorâmico Bernina (Tirano → St. Moritz)',
            '🏔 Tempo livre em St. Moritz',
            '🚌 Retorno de ônibus St. Moritz → Milão',
            '🗺 Guia turístico durante o percurso'
        ],
        nao_incluso: ['Refeições', 'Compras em St. Moritz', 'Seguro viagem', 'Gorjetas'],
        roteiro: [
            { dia: 'Manhã', title: 'Saída de Milão', desc: 'Partida de Milão de ônibus em direção à cidade de Tirano, na região de Valtellina, na fronteira com a Suíça.' },
            { dia: 'Meio-dia', title: 'Embarque no Trem Bernina', desc: 'Embarque no famoso trem panorâmico vermelho Bernina em Tirano. Início da viagem pelos Alpes Suíços, alcançando até 2.256m de altitude com vistas de geleiras e montanhas.' },
            { dia: 'Tarde', title: 'Chegada a St. Moritz', desc: 'Chegada ao luxuoso resort alpino de St. Moritz. Tempo livre para explorar a cidade, suas lojas elegantes e apreciar as paisagens deslumbrantes.' },
            { dia: 'Noite', title: 'Retorno a Milão', desc: 'Retorno de ônibus de St. Moritz para Milão, finalizando uma experiência completa e inesquecível pelos Alpes.' }
        ]
    },

    /* ════ NACIONAIS ════ */
    balneario: {
        category: 'nacional',
        title:    'Balneário Camboriú + Beto Carrero',
        subtitle: 'O melhor de SC: praia, roda gigante e parque temático',
        location: 'Balneário Camboriú, SC',
        duration: '5 dias / 4 noites',
        price:       '2.486,13',
        priceCartao: '2.605,80',
        parcelas:    '10x de R$ 260,58 sem juros',
        flag:  'Brasil 🇧🇷',
        badge: '🔥 Oferta',
        images: [
            'imagens/balneario_camboriu.png',
            'imagens/bc_roda_gigante.png',
            'imagens/bc_beto_carrero.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Localizada no litoral norte de Santa Catarina, Balneário Camboriú tem além de praias lindas, uma infraestrutura moderna com comércio forte e farta opção gastronômica. Conheça a Barra Sul, o Letreiro I AMO BC, a passarela histórica, o píer do Barco Pirata e o Parque Unipraias — único complexo turístico que une duas praias no mundo! O Parque Beto Carrero World é o maior centro de lazer e entretenimento da América Latina.',
        incluso: [
            '✈ Passagem aérea ida e volta',
            '🏨 4 noites com café da manhã',
            '🎡 Bilhete Roda Gigante FG Big Wheel',
            '🚐 Transfer In/Out Aeroporto',
            '🔒 Seguro viagem incluído'
        ],
        nao_incluso: ['Ingresso Beto Carrero World', 'Almoços e jantares', 'Passeios extras', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Balneário Camboriú', desc: 'Transfer do aeroporto ao hotel. Check-in, descanso e primeira caminhada pela orla da Barra Sul.' },
            { dia: '2º Dia', title: 'Parque Unipraias + Barra Sul', desc: 'Dia para explorar o Parque Unipraias, o Letreiro I AMO BC e a Passarela. Tarde livre na praia.' },
            { dia: '3º Dia', title: 'Beto Carrero World', desc: 'Transfer até o maior parque temático da América Latina! Áreas temáticas, shows, zoológico e brinquedos radicais.' },
            { dia: '4º Dia', title: 'Roda Gigante + Cidade Livre', desc: 'Experiência única na Roda Gigante FG Big Wheel — 65 metros de altura e vista panorâmica de BC.' },
            { dia: '5º Dia', title: 'Retorno', desc: 'Café da manhã. Check-out e transfer ao aeroporto. Voo de volta.' }
        ]
    },

    maceio: {
        category: 'nacional',
        title:    'Maceió – Praias Paradisíacas',
        subtitle: 'O Caribe Brasileiro com piscinas naturais de tirar o fôlego',
        location: 'Maceió, AL',
        duration: '8 dias / 7 noites',
        price:       '4.281,83',
        priceCartao: '4.502,69',
        parcelas:    '10x de R$ 450,27 sem juros',
        flag:  'Brasil 🌊',
        badge: '⭐ Popular',
        images: [
            'imagens/maceio.png',
            'imagens/maceio_maragogi.png',
            'imagens/maceio_pajucara.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Maceió é a capital de Alagoas — 40 km de praias com águas transparentes que variam entre o azul e o verde, formando piscinas naturais únicas. Entre a Lagoa Mundaú e o Oceano Atlântico, a cidade encanta com praias urbanas movimentadas e selvagens totalmente desertas.',
        incluso: [
            '✈ Passagem aérea ida e volta',
            '🏨 7 noites com café da manhã',
            '🌊 City Tour Maceió + Praia do Francês',
            '🚐 Transfer In/Out Aeroporto',
            '🔒 Seguro viagem incluído'
        ],
        nao_incluso: ['Almoços e jantares', 'Passeios opcionais', 'Snorkel e equipamentos', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Maceió', desc: 'Transfer ao hotel. Check-in e primeira caminhada pela orla de Ponta Verde.' },
            { dia: '2º Dia', title: 'Piscinas de Pajuçara', desc: 'Passeio de jangada até as piscinas naturais — nadar entre peixes coloridos em águas rasas e cristalinas.' },
            { dia: '3º Dia', title: 'Praia do Francês + City Tour', desc: 'Excursão panorâmica por Maceió incluindo os principais pontos históricos.' },
            { dia: '4º Dia', title: 'Praia de Ipioca', desc: 'Dia livre para explorar praias mais afastadas como Ipioca ou Ponta do Gamela.' },
            { dia: '5º Dia', title: 'Lagoa Mundaú', desc: 'Passeio pela Lagoa Mundaú, com ilhotes e restaurantes flutuantes.' },
            { dia: '6º Dia', title: 'Maragogi (opcional)', desc: 'Excursão opcional para Maragogi — o Caribe Brasileiro a 130km de Maceió.' },
            { dia: '7º Dia', title: 'Dia Livre', desc: 'Dia livre para revisitar praias favoritas ou relaxar na piscina do hotel.' },
            { dia: '8º Dia', title: 'Retorno', desc: 'Café da manhã. Check-out e transfer ao aeroporto.' }
        ]
    },

    gramado: {
        category: 'nacional',
        title:    'Gramado + Noite Gaúcha',
        subtitle: 'A Serra Gaúcha europeia com cultura, vinhos e fondue',
        location: 'Gramado, RS',
        duration: '7 dias / 6 noites',
        price:       '2.550,00',
        priceCartao: '2.680,00',
        parcelas:    '10x de R$ 268,00 sem juros',
        flag:  'Brasil 🍷',
        badge: '⭐ Popular',
        images: [
            'imagens/gramado.png',
            'imagens/bariloche.png',
            'imagens/curitiba_trem.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Gramado é a joia da Serra Gaúcha — uma cidade que encanta com sua arquitetura enxaimel, ruas floridas, chocolates artesanais, cafés coloniais e fondue. A famosa Noite Gaúcha leva os visitantes para um espetáculo cultural com danças, músicas e gastronomia típica.',
        incluso: [
            '✈ Passagem aérea ida e volta',
            '🏨 6 noites com café da manhã',
            '🎭 Noite Gaúcha (jantar + show cultural)',
            '🚐 Transfer in/out aeroporto',
            '🗺 City Tour por Gramado e Canela'
        ],
        nao_incluso: ['Parque do Caracol (ingresso a pagar)', 'Almoços', 'Gorjetas'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Porto Alegre', desc: 'Desembarque em POA e transfer para Gramado (1h30). Check-in e primeira caminhada pela Rua Coberta.' },
            { dia: '2º Dia', title: 'Gramado City Tour', desc: 'Mini Mundo, Rua Coberta, Lago Negro, fábricas de chocolate e lojas artesanais.' },
            { dia: '3º Dia', title: 'Canela + Caracol', desc: 'Excursão a Canela: Parque do Caracol (Cascata 131m) e Catedral de Pedra.' },
            { dia: '4º Dia', title: 'Noite Gaúcha', desc: 'O famoso espetáculo com jantar típico, danças e música gaúcha num ambiente encantador.' },
            { dia: '5º Dia', title: 'Vale dos Vinhedos', desc: 'Excursão à região produtora de vinhos: vinícolas, degustações e gastronomia italiana.' },
            { dia: '6º Dia', title: 'Dia Livre em Gramado', desc: 'Último dia para chocolates, compras e desfrutar dos cafés com fondue clássico.' },
            { dia: '7º Dia', title: 'Retorno', desc: 'Transfer a Porto Alegre e voo de retorno.' }
        ]
    },

    bariloche: {
        category: 'internacional',
        title:    'Bariloche – Circuito Chico + Cerro Catedral',
        subtitle: 'A Suíça Argentina com neve, lagos e montanhas deslumbrantes',
        location: 'Bariloche, Argentina',
        duration: '6 dias / 5 noites',
        price:       '10.704,00',
        priceCartao: '11.240,00',
        parcelas:    '12x de R$ 936,67 sem juros',
        flag:  'Argentina 🇦🇷',
        badge: '💎 Premium',
        images: [
            'imagens/bariloche.png',
            'imagens/curitiba_opera.png',
            'imagens/gramado.png'
        ],
        dates: '📅 Consulte datas disponíveis',
        desc: 'Bariloche é o destino dos sonhos na Patagônia Argentina — lagos cristalinos, montanhas nevadas, chocolates artesanais e a charmosa arquitetura alpina que lembra a Suíça. O Circuito Chico é considerado um dos passeios mais bonitos da América do Sul.',
        incluso: [
            '✈ Passagem aérea ida e volta',
            '🏨 5 noites com café da manhã',
            '🗺 Tour panorâmico Circuito Chico completo',
            '⛷ Excursão ao Cerro Catedral',
            '🚐 Transfer in/out aeroporto Bariloche'
        ],
        nao_incluso: ['Aluguel de equipamentos de ski', 'Almoços e jantares', 'Passeios extras', 'Seguro viagem'],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada a Bariloche', desc: 'Transfer ao hotel. Tarde de aclimatação e passeio pelo Centro Cívico e chocolaterie.' },
            { dia: '2º Dia', title: 'Circuito Chico', desc: 'O passeio mais famoso: Cerro Campanário (vista 360°), Villa Angliru, Llao Llao, Bahía Lopez.' },
            { dia: '3º Dia', title: 'Cerro Catedral', desc: 'Excursão ao maior complexo de ski da América do Sul. Opções de ski ou passeio de teleférico.' },
            { dia: '4º Dia', title: 'Circuito Grande', desc: 'Lago Nahuel Huapi de barco, Villa Traful e cachoeiras. A Patagônia mais selvagem.' },
            { dia: '5º Dia', title: 'Chocolate + Artesanato', desc: 'Tarde livre para as famosas lojas de chocolate de Bariloche e cervejarias artesanais.' },
            { dia: '6º Dia', title: 'Retorno', desc: 'Café da manhã, check-out e transfer ao aeroporto BRC. Voo de retorno.' }
        ]
    }
};
