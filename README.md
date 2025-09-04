# Codex Core
<!-- EXEMPLO: "AtendeAí — Fila de Ajuda em Sala" -->
## 1) Problema
<!-- Escreva o problema sem falar de telas/tecnologias.
Responda: Quem sofre? Onde? O que atrapalha? Por que isso importa?
EXEMPLO: Em aulas práticas, alunos esperam muito para serem atendidos.
Há filas confusas e frustração. O professor não vê ordem nem tempo de espera.
Objetivo inicial: organizar a fila para reduzir a espera e garantir justiça. -->
Mestres de campanha, em sessões de RPG narrativas online ou presenciais, têm dificuldade em organizar, visualizar e transmitir aos jogadores de forma clara a linha do tempo dos eventos, bem como as relações entre personagens, locais e objetos.
Isso causa perda de consistência narrativa, dificuldade de consulta rápida e aumento do tempo gasto para gerenciar o enredo, deixando menos espaço para histórias mais complexas.

No início, o foco será no mestre de campanha com o objetivo de oferecer uma timeline interativa que conecte eventos e elementos narrativos, facilitando a preparação e a condução das sessões.
## 2) Atores e Decisores (quem usa / quem decide)
<!-- Liste papéis (não nomes).
EXEMPLO:
Usuários principais: Alunos da turma de Desenvolvimento Web
Decisores/Apoiadores: Professores da disciplina; Coordenação do curso -->
### Usuários principais:

- Mestre de Campanha (ator central, organiza e conduz as narrativas em conjunto com os jogadores)

- Jogador (acompanha e desenvolve a narrativa em conjunto com o mestre, consulta eventos e personagens)

### Decisores/Apoiadores:

- Administrador do Sistema (mantém usuários e campanhas ativas, monitora uso)

- Desenvolvedores / Equipe Técnica (dão suporte e expandem funcionalidades)
## 3) Casos de uso (de forma simples)
<!-- Formato "Ator: ações que pode fazer".
DICA: Use "Manter (inserir, mostrar, editar, remover)" quando for CRUD.
EXEMPLO:
Todos: Logar/deslogar do sistema; Manter dados cadastrais
Professor: Manter (inserir, mostrar, editar, remover) todos os chamados
Aluno: Manter (inserir, mostrar, editar, remover) seus chamados -->
### Todos:

- Logar/deslogar no sistema

- Manter dados cadastrais (perfil de usuário, senha, preferências)

- Acessar campanhas ativas

### Mestre de Campanha:

- Criar/editar/remover campanhas

- Criar e organizar eventos na timeline

- Associar personagens, locais e objetos a eventos

- Visualizar e manipular a linha do tempo interativa

- Definir relações (anteriores/posteriores/paralelos) entre eventos

### Jogador:

- Consultar a linha do tempo da campanha em que participa

- Navegar pelas relações de eventos e elementos narrativos

- Visualizar personagens, locais e objetos relacionados

### Administrador:

- Gerenciar cadastros de usuários (incluir, editar, remover)

- Acompanhar o uso do sistema e ajustar permissões

- Atuar como apoio em caso de inconsistências (suporte técnico)
## 4) Limites e suposições
### Limites:

- Prazo final: 30-11-2025 para entrega da versão mínima funcional (MVP).

- Deve rodar no navegador moderno (Chrome/Firefox/Edge).

- O sistema deve suportar múltiplos usuários, cada campanha com apenas 1 mestre e múltiplos jogadores.

- A timeline deve ser interativa e baseada em grafo visual.

- Não utilizar serviços pagos na primeira versão (somente bibliotecas open source).

### Suposições:

- Usuários terão acesso à internet estável durante as sessões.

- Os navegadores estarão atualizados para suportar renderização de grafos (WebGL/SVG).

- A equipe terá acesso ao GitHub para versionamento e colaboração.

- Tempo de teste rápido disponível (10–15 minutos por sessão de feedback).

### Plano B:

- Caso falhe o acesso à internet: o sistema deve permitir rodar localmente, salvando dados em LocalStorage ou arquivo JSON.

- Caso os navegadores tenham limitações: fornecer versão simplificada sem grafos (lista ordenada de eventos).

- Caso falte tempo de testes com a turma/professor: validar rapidamente com 3 usuários representativos (Mestre + Jogadores) em cenários reais reduzidos.
## 5) Hipóteses + validação
### H-Valor:
Se mestres e jogadores conseguirem visualizar eventos e seus relacionamentos em forma de grafo interativo, então a organização e entendimento da linha do tempo melhora em clareza e agilidade nas sessões (critério: usuários conseguem localizar e explicar a ordem dos eventos sem ajuda).

**Validação (valor):**
Teste com 5 usuários (3 mestres, 2 jogadores) em protótipo funcional.
Alvo: ≥4 conseguem navegar no grafo, localizar um evento e explicar seus relacionamentos em até 2 minutos sem intervenção do instrutor.

### H-Viabilidade:
Com React.js no front e Node.js (NestJS) no back-end, carregar e exibir a timeline com até 50 eventos e 150 conexões leva ≤2 segundos na maioria dos casos.

**Validação (viabilidade):**
Medição no protótipo com 30 interações de visualização.
Meta: pelo menos 27 de 30 (90%) carregam em ≤2 segundos.
## 6) Fluxo principal e primeira fatia
### Fluxo principal (curto):

**1.** Usuário faz login

**2.** Seleciona uma campanha

**3.** Cria/edita um evento narrativo (com personagens, locais e objetos)

**4.** Sistema salva o evento e atualiza a timeline visual

### Primeira fatia vertical (escopo mínimo):

#### Inclui:

- Tela de login simples

- Tela de campanhas → listar e selecionar

- Tela de timeline → criar evento (apenas título + descrição)

- Salvar evento em banco → atualizar timeline no grafo

### Critérios de aceite:

- Ao criar um evento, ele aparece imediatamente na timeline.

- O evento deve ser persistido no banco (ao atualizar a página, ele continua lá).
## 7) Esboços de algumas telas (wireframes)
<img width="1919" height="1005" alt="image" src="https://github.com/user-attachments/assets/15cc244c-f83b-4bd5-8b08-27debcda853c" />

<img width="1140" height="640" alt="image" src="https://github.com/user-attachments/assets/7ff93685-6bca-46d5-98d1-10e5c2ff1f9a" />




## 8) Tecnologias
### 8.1 Navegador
**Navegador:** React.js + TypeScript + TailwindCSS

**Armazenamento local:** LocalStorage (para cache de sessão)

**Hospedagem:** Vercel
### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** React.js + Vite ou Next.js
**Hospedagem:** Vercel
### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** NestJS (Node.js) + TypeScript
**Banco de dados:** PostgreSQL
**Deploy do back-end:** Railway
# 9) Plano de Dados (Dia 0)

### **9.1 Entidades**
- **Usuario** — pessoa que usa o sistema (mestre ou jogador).  
- **Campanha** — mundo narrativo criado e mantido pelos usuários.  
- **Evento** — acontecimento dentro da campanha, com relações temporais e narrativas.  
- **Personagem** — entidade atuante em eventos.  
- **Local** — lugar relacionado a eventos e personagens.  
- **Objeto** — item que pode estar em eventos, locais ou com personagens.  

---

### **9.2 Campos por entidade**

#### **Usuario**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `u1-123-xyz` |
| nome  | texto | sim | "Ana Souza" |
| senha | texto | sim | `$2a$10$hash...` |
| tipo  | ENUM('MESTRE','JOGADOR') | sim | `MESTRE` |

---

#### **Campanha**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `c1-555` |
| nome  | texto | sim | "A Queda dos Reinos" |
| descricao | texto | não | "Uma guerra entre reinos..." |
| imagem_path | texto | não | `/img/campanhas/reino.png` |

---

#### **Evento**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `e1-444` |
| titulo | texto | sim | "Batalha de Aranor" |
| descricao | texto | não | "Confronto decisivo..." |
| campanha_id | uuid (fk campanha) | sim | `c1-555` |
| anterior_id | uuid (fk evento) | não | `e0-111` |
| posterior_id | uuid (fk evento) | não | `e2-777` |

---

#### **Personagem**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `p1-222` |
| nome  | texto | sim | "Rei Darius" |
| descricao | texto | não | "Monarca cruel..." |
| campanha_id | uuid (fk campanha) | sim | `c1-555` |

---

#### **Local**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `l1-999` |
| nome  | texto | sim | "Castelo Negro" |
| descricao | texto | não | "Fortaleza ancestral" |
| campanha_id | uuid (fk campanha) | sim | `c1-555` |

---

#### **Objeto**
| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| id    | uuid | sim | `o1-888` |
| nome  | texto | sim | "Espada Sagrada" |
| descricao | texto | não | "Artefato lendário" |
| campanha_id | uuid (fk campanha) | sim | `c1-555` |

---

### **9.3 Relações entre entidades**

#### **Evento**
- Um **Evento** pode estar ligado a outro evento como **anterior** ou **posterior** (auto-relacionamento 1→1).  
- Um **Evento** pode estar ligado a muitos outros eventos de forma paralela (N→N via `evento_evento`).  
- Um **Evento** pode estar relacionado a muitos **Personagens, Locais e Objetos** (N→N via tabelas auxiliares).  

#### **Personagem**
- Um **Personagem** pertence a uma campanha.  
- Um **Personagem** pode se relacionar com muitos **Eventos, Locais, Objetos e outros Personagens**.  

#### **Local**
- Um **Local** pertence a uma campanha.  
- Um **Local** pode se relacionar com muitos **Eventos, Personagens, Objetos e outros Locais**.  

#### **Objeto**
- Um **Objeto** pertence a uma campanha.  
- Um **Objeto** pode se relacionar com muitos **Eventos, Personagens, Locais e outros Objetos**.  

---

### **Resumo visual das relações:**  
- **Usuário** → controla → **Campanhas**  
- **Campanha** → contém → **Eventos, Personagens, Locais, Objetos**  
- **Eventos** → têm ligações temporais (**antes/depois/paralelo**)  
- **Eventos** → relacionam-se com **Personagens, Locais, Objetos**  
- **Todos os elementos narrativos (personagens, locais, objetos)** podem se relacionar entre si  

