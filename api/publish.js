/**
 * 321 GO! â€” API de PublicaÃ§Ã£o
 * POST /api/publish
 * Recebe o content.json do editor, commita no GitHub,
 * e o Vercel faz deploy automÃ¡tico em ~30 segundos.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        if (!body) {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            body = JSON.parse(Buffer.concat(chunks).toString());
        }
    } catch {
        return res.status(400).json({ error: 'Body invÃ¡lido' });
    }

    const { content, secret } = body;

    // Verifica senha admin
    const adminSecret = process.env.ADMIN_SECRET || 'LCViagens@2026';
    if (secret !== adminSecret) {
        return res.status(401).json({ error: 'NÃ£o autorizado' });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'GITHUB_TOKEN nÃ£o configurado no Vercel. Veja o README.' });
    }

    const owner  = process.env.GITHUB_OWNER || 'lcviagens';
    const repo   = process.env.GITHUB_REPO  || 'lc-viagens';
    const path   = 'content.json';
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': '321go-editor/1.0'
    };

    try {
        // 1. Pega o SHA atual do arquivo (se existir)
        let sha = null;
        try {
            const getRes = await fetch(apiBase, { headers });
            if (getRes.ok) {
                const getJson = await getRes.json();
                sha = getJson.sha || null;
            }
        } catch (_) { /* arquivo nÃ£o existe ainda, tudo bem */ }

        // 2. Codifica o conteÃºdo em base64
        const contentStr = JSON.stringify(content, null, 2);
        const contentB64 = Buffer.from(contentStr).toString('base64');

        // 3. Commita no GitHub
        const putBody = {
            message: `Editor LC Viagens: atualiza site (${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })})`,
            content: contentB64,
            ...(sha ? { sha } : {})
        };

        const putRes = await fetch(apiBase, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
            return res.status(200).json({
                success: true,
                message: 'Publicado! O site serÃ¡ atualizado em ~30 segundos.'
            });
        } else {
            const err = await putRes.json();
            return res.status(500).json({ error: err.message || 'Erro ao commitar no GitHub' });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

