## 🧩 Fase 1 — Fechar o Grafo & Timeline (o que já estamos no meio)

Objetivo: GraphView / Timeline estáveis, usáveis e com interação sólida.

1. [x] **11.5 – Relações & direções**

   - Mapear e consolidar os tipos de relação no front (`GraphLink.type`):
     - Temporais: `PREVIOUS`, `NEXT`, `PARALLEL` (EVENT ↔ EVENT).
     - Outras: personagem–evento, local–evento, objeto–evento etc.
   - Criar um `RELATION_DEFS` com:
     - `directional: boolean`
     - categoria (ex: `"TEMPORAL"`, `"APPEARS_IN"`, etc).
   - Atualizar renderização de edges:
     - Só mostra setas quando `directional === true`.
     - Em especial entre eventos na Timeline.
   - Garantir que Timeline usa este catálogo para leitura temporal mínima.

2. [x] **Infra de câmera (pan & zoom do background)**

   - Adicionar estado de câmera em `GraphVisualization`:
     - `{ x, y, scale }`.
   - Aplicar `transform` (`translate` + `scale`) num `<g>` wrapper.
   - Implementar:
     - Drag do background para mover o grafo.
     - Zoom com scroll na posição do mouse (corrigindo pan para focar onde o cursor está).

3. [x] **Clique esquerdo no node**

   - Definir `selectedNodeId` (provavelmente no contexto ou na página).
   - Comportamentos:
     1. **Foco + zoom opcional**:

        - Se `displaySettings.autoZoomOnClick === true`, centralizar o node e dar um zoom leve usando a câmera.

     2. **Popup read-only**:

        - Mostrar name, type, descrição (por enquanto texto simples), talvez grau / relações.
        - Não edita nada aqui, só visualização rápida.

4. [x] **Clique direito no node**

   - Interceptar `contextmenu` no node.
   - Abrir popup de **edição**, inspirado na TimelinePage:
     - Editar nome / descrição.
     - Gerenciar links (criar/remover relações).
     - Excluir o node.
   - Reutilizar as mesmas rotas/DTOs do backend da TimelinePage pra não duplicar regra de negócio.
   - Ao salvar:
     - Atualizar `graphData` no contexto.
     - Remover/atualizar posições em `nodePositions` quando o node mudar/deletar.

5. [x] **Clique direito no background**

   - `contextmenu` no “vazio”:
     - Mostrar menu:
       - `Create event`
       - `Create character`
       - `Create location`
       - `Create object`
     - Usar as coordenadas do clique (convertidas para coords do mundo via câmera) como posição inicial sugerida.
   - Criar entidade via backend.
   - Adicionar ao `graphData` e `nodePositions` de forma suave (sem quebrar layout atual).

6. [ ] **Customize / cores por tipo (nodes & relações)**

   - Criar painel `Customize` ou uma aba dentro de `Display`:
     1. **Cores de node por tipo (E/C/L/O)**:

        - Editar `{ fill, stroke }` por `GraphNodeType`.

     2. **Cores por tipo de relação**:

        - Para cada `GraphLink.type` conhecido:
          - escolher cor (stroke) base.
   - Refatorar `getNodeColor` e `edgeColor` pra usar essas configs.
   - Persistir essas configs em:
     - `localStorage` por campanha (`campaign:{id}:graph-style`).

7. [ ] **Ajustes finos da física & timeline**

   - Usar o painel `Forces` + opacidade em ondas + timeline para:
     - Chegar em presets “agradáveis” (tipo preset “Obsidian-like”).
   - Ajustar:
     - `alphaDecay`,
     - intensidades default,
     - suavidade de transição entre `graph` e `timeline` (reutilizando `nodePositions`).

> Resultado da Fase 1: Interação básica (drag, zoom, click, context menu) redonda.

---

## 📝 Fase 2 — Conteúdo rico (Markdown, imagens, notas)

### 2.1. Markdown como formato padrão de descrição

- Backend:
  - Continuar guardando `description` como texto, agora tratado como markdown.
- Frontend:
  - Editor de markdown (pode começar como textarea + preview).
  - Renderer de markdown nos lugares de leitura:
    - TimelinePage,
    - popups da GraphView,
    - future notes.

### 2.2. Links internos `<<E/C/L/O:name>>` clicáveis

- Parser simples para esses tokens no renderer de markdown:
  - Transformar em links clicáveis com label bonitinho.
- Resolver `type + name` → `id`:
  - Índice em memória por campanha.
- Comportamento de clique:
  - Timeline:
    - abre popup de info da entidade.
  - GraphView:
    - foca / dá zoom no node correspondente,
    - abre o popup read-only do item clicado.

### 2.3. Imagens / capas por entidade

- Backend:
  - Campo `imageUrl` em:
    - `Campaign`,
    - `Event`,
    - `Character`,
    - `Location`,
    - `Object`.
  - Rotas para:
    - salvar URL,
    - eventualmente upload (se for servir arquivos).
- Frontend:
  - Componente `EntityHeader`:
    - mostra capa + nome + tipo.
  - Usar esse header em:
    - TimelinePage,
    - popup de node info na GraphView,
    - página de detalhes (se existir).
- Observação:
  - Esse item engloba aquele “Upload campaign cover image” que estava na lista de optional.

### 2.4. Imagens dentro do markdown

- Com o renderer pronto, suportar:
  - `![alt](url)` normalmente.
- A GraphView e TimelinePage passam a mostrar descrições com imagens inline onde fizer sentido (com limites de tamanho pra não quebrar layout).

### 2.5. Notas em GraphView (markdown, sem física)

- Modelo:
  - `Note` com:
    - `id`,
    - `campaignId`,
    - `authorId`,
    - `contentMarkdown`,
    - `x`, `y` (coord do mundo, compatível com pan/zoom),
    - `visibility: PRIVATE | PARTY | PUBLIC` (por exemplo).
- Comportamento:
  - Renderizadas como “cards” flutuando sobre o grafo, **fora da simulação de forças**.
  - Respeitam pan/zoom da câmera.
- UI:
  - Mestre sempre pode criar.
  - Mestre define:
    - se players podem criar,
    - se podem alterar visibilidade.
  - Criação:
    - via clique direito no background + “Create note (markdown)”.
- Integração:
  - Renderer de markdown igual das descrições.
  - Links internos `<<E/C/L/O:name>>` funcionando dentro das notas também.

> Resultado da Fase 2: o grafo vira um mapa mental real da campanha.

---

## 🎨 Fase 3 — Polimento pra Release / GitHub

### 3.1. Tema (dark/light)

- Implementar toggle de tema global:
  - dark/light (ou auto baseado no sistema).
- Persistir preferência em `localStorage`.
- Integrar com Tailwind (ou sistema atual de theming).

### 3.2. Search

- Search bar no Dashboard:
  - Filtrar campanhas localmente ou via backend (`?search=...`).
- Opcional:
  - Search global de entidades no futuro, mas não é obrigatório para release.

### 3.3. Paginação

- Backend:
  - Implementar `take/skip` (ou `page/limit`) nas rotas que listam campanhas / eventos.
- Front:
  - Controles de paginação simples:
    - Next/prev,
    - Info de página atual.

### 3.4. Form validation

- Em todos os forms importantes (auth, criação/edição de campanha, eventos, etc):
  - validação de campos obrigatórios,
  - feedback visual,
  - **desabilitar submit** quando inválido.
- Evitar aquela experiência “clica em salvar, nada acontece, e o usuário xinga”.

### 3.5. Error Boundaries

- Criar `ErrorBoundary.tsx`:
  - pega erros de render no React,
  - mostra UI amigável com:
    - “tente recarregar a página”,
    - opção de “voltar ao dashboard”.
- Usar em:
  - GraphPage,
  - TimelinePage,
  - talvez no root da app.

### 3.6. Documentação

- Criar `.env.example`:
  - backend,
  - frontend.
- Atualizar `README.md` com:
  - setup passo a passo,
  - comandos para rodar (dev/prod),
  - instrução de login (usuário de teste, se tiver),
  - breve overview de features (GraphView, Timeline, etc).

> Resultado da Fase 3: projeto pronto pra GitHub.

---

## 💎 Fase 4 — “Portfolio Tier” / Extras

1. **Public read-only shareable graph view**

   - Link público (ou com token) para:
     - visualizar a GraphView/TImeline em modo read-only.
   - Sem editar, sem arrastar fisicamente (ou arrasta só localmente, sem persistir).
   - Ideal pra mostrar campanha pra outros sem expor painel de edição.

2. **Language switch (EN/PT-BR)**

   - Infra de i18n (ex: `react-i18next` ou similar).
   - Separar strings da UI.
   - Alternar entre inglês e português.
   - Persistir escolha em `localStorage`.

3. **Keyboard shortcuts**

   - Exemplos:
     - `N` → criar evento,
     - `G` → alternar Graph / Timeline,
     - `T` → toggle de tema,
     - `F` → foco na search bar / node search.
   - Mostrar mini “cheat sheet” de atalhos em algum lugar (tipo `?`).

4. **Animated toasts com Framer Motion**

   - Substituir toasts básicos por animações suaves:
     - sucesso,
     - erro,
     - aviso (ex: “node deleted”, “link created”).
   - Ajuda a dar sensação de produto mais polido.

5. **Mobile responsiveness improvements**

   - Explicitamente **por último**, como você mesmo disse.
   - Ajustar:
     - Dashboard,
     - Timeline,
     - Graph (provavelmente com modo simplificado).
   - Foco: garantir que em telas menores o app seja pelo menos utilizável.

> Resultado da Fase 4: “premium” visualmente e em UX.

---

## 🔄 Fase 5 — Colaboração em tempo real (Mestre & Players)

1. **Modelo de permissões / papéis**

   - `UserCampaignRole`:
     - MASTER,
     - PLAYER,
     - VIEWER (talvez).
   - Flags:
     - `canRead`,
     - `canWrite`,
     - `canCreate`,
     - `canDelete`,
     - `canManageNotes`,
     - etc.
   - Interface pra o mestre configurar isso por player.

2. **Infra de realtime**

   - WebSockets (ou equivalente) para:
     - sync de:
       - nodes,
       - links,
       - notas,
       - descrições.
   - Eventos:
     - `nodeCreated`, `nodeUpdated`, `nodeDeleted`,
     - `relationCreated`, `relationDeleted`,
     - `noteCreated`, `noteUpdated`, `noteDeleted`.

3. **Resolução de conflitos**

   - No mínimo:
     - “last write wins” com UI dando claro feedback.
   - Possível melhoria:
     - locks leves por entidade (“fulano está editando este evento”).

4. **Presença**

   - Mostrar quem está online na campanha.
   - Opcional: destacar seleção de entidade de outros usuários (outline colorido etc).

5. **Permissões em notas na GraphView**

   - Notas passam a respeitar:
     - role do usuário,
     - flags de visibilidade:
       - privado,
       - grupo,
       - público dentro da campanha.

> Resultado da Fase 5: uma mesa de RPG colaborativa, mestre controlando acesso, players interagindo em tempo real.
