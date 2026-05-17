/**
 * 321 GO! â€” API de Upload de Imagens
 * POST /api/upload
 * Recebe base64, sobe para o GitHub em /imagens/, retorna URL pÃºblica.
 * CORREÃ‡ÃƒO: branch = 'master' (nÃ£o 'main')
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

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

    const { filename, base64, secret } = body;

    // Verifica senha
    const adminSecret = process.env.ADMIN_SECRET || 'LCViagens@2026';
    if (secret !== adminSecret) {
        return res.status(401).json({ error: 'NÃ£o autorizado' });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'GITHUB_TOKEN nÃ£o configurado no Vercel' });
    }

    const owner  = process.env.GITHUB_OWNER || 'lcviagens';
    const repo   = process.env.GITHUB_REPO  || 'lc-viagens';
    // CRÃTICO: usar a branch correta do repositÃ³rio
    const branch = process.env.GITHUB_BRANCH || 'master';

    // Valida extensÃ£o
    const ext     = (filename.split('.').pop() || '').toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowed.includes(ext)) {
        return res.status(400).json({ error: 'Formato nÃ£o permitido. Use JPG, PNG, WEBP ou GIF.' });
    }

    const safeName = `upload_${Date.now()}.${ext}`;
    const path     = `imagens/${safeName}`;
    const apiBase  = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers  = {
        'Authorization': `token ${token}`,
        'Accept':        'application/vnd.github.v3+json',
        'User-Agent':    '321go-editor/1.0'
    };

    try {
        const putRes = await fetch(apiBase, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Upload imagem via editor: ${safeName}`,
                content: base64,
                branch
            })
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            return res.status(500).json({ error: err.message || 'Erro no upload para o GitHub' });
        }

        // URL pÃºblica via raw.githubusercontent.com (sem cache do CDN, aparece imediatamente)
        const publicUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
        return res.status(200).json({ url: publicUrl });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

