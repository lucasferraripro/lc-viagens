# Historico operacional - LC Viagens

Atualizado em: 18/05/2026

## Dados do projeto

- Cliente: LC Viagens
- Responsavel: Clebert Rocha
- Site: https://lc-viagens.vercel.app/
- Painel: https://lc-viagens.vercel.app/admin/login.html
- GitHub: https://github.com/lucasferraripro/lc-viagens
- Vercel project: `lc-viagens`
- Branch principal: `master`
- Admin email: `admin@lcviagens.com.br`
- Admin senha: `LCViagens@2026`

## O que foi feito

1. Criado projeto novo no Vercel para LC Viagens.
2. Publicado site em `https://lc-viagens.vercel.app/`.
3. Confirmado repositorio proprio no GitHub: `lucasferraripro/lc-viagens`.
4. Corrigido painel admin que ainda tinha identidade antiga do projeto `321 GO`.
5. Refeito `admin/login.html` com identidade LC Viagens.
6. Corrigidos textos visiveis quebrados no painel/editor.
7. Adicionada foto `EMPRESA.png` na secao "Somos a LC Viagens".
8. Commit enviado para o GitHub:
   - `d022160` - Corrige painel admin e publica foto da empresa
9. Configuradas variaveis de ambiente no Vercel.
10. Feito redeploy para aplicar variaveis.
11. Testado `/api/auth`.
12. Testado `/api/publish`.

## Variaveis no Vercel

Projeto: `lc-viagens`

Variaveis configuradas em Production:

```text
ADMIN_SECRET
GITHUB_OWNER
GITHUB_REPO
GITHUB_BRANCH
GITHUB_TOKEN
```

Valores conceituais:

```text
ADMIN_SECRET = senha do painel
GITHUB_OWNER = lucasferraripro
GITHUB_REPO = lc-viagens
GITHUB_BRANCH = master
GITHUB_TOKEN = token GitHub com permissao repo
```

Nao salvar o valor real do token neste arquivo.

## Testes confirmados

Auth:

```text
/api/auth => 200 {"ok":true}
```

Publish:

```text
/api/publish => 200 {"success":true}
```

Commit gerado pelo editor:

```text
9d99011 - Editor LC Viagens: atualiza site (18/05/2026, 02:37:15)
```

## Erro que aconteceu

No painel, ao clicar em Publicar, apareceu:

```text
Erro: GITHUB_TOKEN nao configurado no Vercel.
```

Depois, com token sem permissao, apareceu:

```text
Resource not accessible by personal access token
```

## Causa

O painel nao publica direto no Vercel. Ele chama `/api/publish`, que grava `content.json` no GitHub. Para isso, o Vercel precisa da variavel `GITHUB_TOKEN` com permissao de escrita no repositorio.

## Solucao correta

1. Criar token GitHub com permissao de escrita no repo.
2. Adicionar no Vercel como `GITHUB_TOKEN`.
3. Fazer redeploy.
4. Testar `/api/auth`.
5. Testar `/api/publish`.

Token que funcionou: classic token com escopo `repo`.

## Checklist para futuras alteracoes

Antes de mexer:

- Confirmar que esta na pasta `lc-viagens`.
- Confirmar `git remote -v` aponta para `lucasferraripro/lc-viagens`.
- Confirmar `.vercel/project.json` aponta para projeto `lc-viagens`.
- Nunca mexer em Lovisa, Asas Brasil, 321 GO ou outros projetos.

Depois de mexer:

1. Testar local se possivel.
2. `git status --short`
3. `git add` apenas arquivos do site.
4. `git commit`
5. `git push origin master`
6. `vercel --prod --yes --scope lucasferraris-projects-65d9de34`
7. Abrir site e painel.
8. Testar Publicar no painel.

## Observacoes de seguranca

- Nao salvar tokens reais em arquivos.
- Se um token for exposto em conversa, considerar revogar e gerar outro depois.
- Se trocar `GITHUB_TOKEN`, sempre redeployar.
