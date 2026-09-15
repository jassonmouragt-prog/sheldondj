# Sheldon Mais que DJ — DESIGN.md

> Sistema visual premium para uma empresa de eventos, áudio, iluminação e estrutura.  
> A experiência deve começar clara, institucional e sofisticada, e evoluir para uma atmosfera escura, imersiva e impactante conforme o usuário avança pela página.

---

## 1. Direção criativa

**Marca:** Sheldon Mais que DJ  
**Segmento:** Eventos, DJ, som, iluminação, painel de LED, piso de vidro, palco e estrutura audiovisual  
**Localização:** Natal/RN  
**Atuação:** Desde 2011  

### Conceito central

O site não deve parecer uma locadora de equipamentos nem uma página genérica de DJ.

A direção visual precisa posicionar a Sheldon como:

- empresa experiente
- operação estruturada
- marca confiável
- especialista em atmosfera de eventos
- referência em som, luz e tecnologia
- fornecedor de estrutura para momentos importantes

A linguagem visual se divide em dois universos:

1. **White Experience** — institucional, clean, editorial, sofisticada
2. **Black Experience** — impacto, espetáculo, tecnologia, atmosfera e emoção

A transição entre os dois momentos deve ser intencional e cinematográfica.

---

## 2. Princípios do sistema

### 2.1. Clean, mas não vazio
Usar bastante respiro, hierarquia clara, tipografia grande e fotografia real como protagonista.

### 2.2. Premium sem parecer luxo genérico
Evitar dourado em excesso, brilho artificial, gradientes chamativos e ornamentação desnecessária.

### 2.3. Evento acima do equipamento
Mostrar os equipamentos inseridos no contexto de festas reais, casamentos, 15 anos, formaturas e eventos corporativos.

### 2.4. Autoridade acima de decoração
O layout deve priorizar:
- tempo de mercado
- estrutura
- cases
- parceiros
- eventos realizados
- serviços
- pacotes
- prova social

### 2.5. Ritmo por contraste
A página começa branca e luminosa.  
A metade inferior migra para preto profundo.

Esse contraste é parte central da identidade do projeto.

---

# 3. Tokens — Cores

| Nome | Valor | Token | Papel |
|---|---:|---|---|
| Sheldon Black | `#080808` | `--color-black` | Fundo principal da segunda metade, footer, seções de impacto |
| Pure Black | `#000000` | `--color-black-pure` | Uso pontual em áreas de maior contraste |
| Paper | `#FFFFFF` | `--color-paper` | Fundo principal da primeira metade |
| Soft Canvas | `#F5F5F3` | `--color-canvas` | Seções claras alternadas, áreas de descanso visual |
| Warm Gray | `#EAE8E3` | `--color-warm-gray` | Bordas sutis, superfícies e divisões discretas |
| Ink | `#111111` | `--color-ink` | Headings e body em fundo claro |
| Mid Gray | `#6F6F6F` | `--color-mid-gray` | Textos secundários em fundo claro |
| Light Text | `#D9D9D9` | `--color-light-text` | Body e labels em fundo preto |
| Quiet Text | `#969696` | `--color-quiet-text` | Texto secundário no dark mode |
| Sheldon Gold | `#D4A32A` | `--color-gold` | Cor de assinatura, CTAs, detalhes e destaques |
| Gold Soft | `#E5C465` | `--color-gold-soft` | Hover, microinterações, detalhes refinados |
| Gold Wash | `#F4E8C5` | `--color-gold-wash` | Fundo muito discreto de tags ou detalhes |
| Dark Surface | `#111111` | `--color-dark-surface` | Cards escuros |
| Dark Elevated | `#171717` | `--color-dark-elevated` | Hover e superfícies elevadas no dark mode |
| Hairline Light | `rgba(17,17,17,.10)` | `--color-hairline-light` | Divisões em fundo claro |
| Hairline Dark | `rgba(255,255,255,.12)` | `--color-hairline-dark` | Divisões em fundo escuro |

### Regras de uso

- Branco e preto são dominantes.
- O dourado funciona como **assinatura**, nunca como fundo principal da página.
- O dourado pode aparecer em:
  - botões
  - pequenos títulos
  - linhas
  - números
  - indicadores
  - hover
  - tags
- Fotografias de eventos são a principal fonte de cor.

### Não usar

- azul elétrico
- roxo neon
- magenta neon
- gradientes gamer
- glow exagerado
- fundos com partículas
- efeitos de equalizador
- lasers como decoração de interface

---

# 4. Tokens — Tipografia

## Família principal

### Display / Headings
**Manrope** ou **Geist Sans**

Fallback:
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Weights:** 600, 700, 800

### Body / Navigation
**Inter** ou **Geist Sans**

**Weights:** 400, 500, 600

---

## 4.1. Escala tipográfica

| Papel | Desktop | Mobile | Line-height | Tracking |
|---|---:|---:|---:|---:|
| micro | 12px | 11px | 1.3 | .08em |
| caption | 14px | 13px | 1.4 | .03em |
| body-sm | 16px | 15px | 1.55 | -0.01em |
| body | 18px | 16px | 1.55 | -0.015em |
| body-lg | 22px | 18px | 1.45 | -0.02em |
| subheading | 32px | 24px | 1.2 | -0.03em |
| heading-sm | 42px | 32px | 1.08 | -0.04em |
| heading | 56px | 40px | 1.03 | -0.05em |
| heading-lg | 80px | 52px | .98 | -0.055em |
| display | 108px | 64px | .92 | -0.065em |

### Diretriz

Os títulos devem parecer arquitetônicos e editoriais.

Exemplos:

**MAIS QUE  
SOM.  
MAIS QUE  
LUZ.**

**QUANDO AS LUZES  
SE ACENDEM,  
A EXPERIÊNCIA COMEÇA.**

**ESTRUTURAS QUE  
IMPRESSIONAM.**

Evitar títulos genéricos como:
- Transformamos sonhos em realidade
- Viva momentos inesquecíveis
- Seu evento dos sonhos
- Experiências únicas para você

---

# 5. Espaçamento

**Base unit:** 4px  
**Density:** confortável / premium

| Nome | Valor |
|---|---:|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 80px |
| 5xl | 120px |
| 6xl | 160px |
| 7xl | 200px |

### Layout

- **Page max-width:** `1320px`
- **Wide media max-width:** `1520px`
- **Desktop side padding:** `48–72px`
- **Tablet side padding:** `32px`
- **Mobile side padding:** `20px`
- **Section gap:** `120–180px`
- **Hero min-height:** `88vh`
- **Transition section:** `100vh` quando usada como cena cinematográfica

---

# 6. Border Radius

| Elemento | Valor |
|---|---:|
| small controls | 10px |
| buttons | 999px |
| tags | 999px |
| image cards | 24px |
| feature cards | 28px |
| large media | 32px |
| mobile cards | 20px |

O arredondamento deve suavizar o layout sem deixá-lo infantil.

---

# 7. Superfícies

| Nível | Nome | Valor | Uso |
|---|---|---|---|
| 0 | Paper | `#FFFFFF` | Fundo principal claro |
| 1 | Soft Canvas | `#F5F5F3` | Alternância de seções |
| 2 | White Elevated | `#FFFFFF` | Cards claros |
| 3 | Sheldon Black | `#080808` | Fundo principal dark |
| 4 | Dark Surface | `#111111` | Cards escuros |
| 5 | Dark Elevated | `#171717` | Hover / destaque no dark |

### Sombras

Evitar sombras tradicionais.

Se necessário:
- `box-shadow: 0 20px 60px rgba(0,0,0,.06)` apenas em elementos muito específicos
- no dark mode, preferir contraste de superfície a sombra

---

# 8. Grid

## Desktop

- Grid de 12 colunas
- Gutter: 24px
- Alinhamento editorial
- Evitar tudo centralizado
- Misturar blocos 5/7, 4/8, 7/5, 8/4
- Portfólio pode usar spans assimétricos

## Mobile

- 4 colunas
- Gutter: 16px
- Cards full width
- Hierarquia simplificada
- Fotos grandes
- Poucos elementos por viewport

---

# 9. Header

## Desktop

Altura:
`72–84px`

### Estado inicial
- fundo transparente sobre branco
- logo à esquerda
- menu central ou levemente deslocado
- CTA à direita

### Menu
- Início
- Sobre
- Estrutura
- Eventos
- Pacotes
- Contato

### CTA
**Solicitar orçamento**

### Após scroll
- fundo `rgba(255,255,255,.86)`
- backdrop blur 18–24px
- hairline inferior discreta

### Na área escura
- fundo `rgba(8,8,8,.84)`
- logo clara
- textos brancos
- botão dourado ou branco

### Mobile
- logo
- botão de menu
- CTA opcional oculto
- drawer clean
- fundo adaptativo à seção

---

# 10. Botões

## Primary CTA — Light Mode

- background: `#111111`
- color: `#FFFFFF`
- border-radius: `999px`
- height: `52–58px`
- padding: `0 24–28px`
- weight: `600`

Hover:
- background: `#D4A32A`
- color: `#080808`

---

## Primary CTA — Dark Mode

- background: `#D4A32A`
- color: `#080808`

Hover:
- background: `#E5C465`

---

## Secondary CTA

- transparente
- borda 1px
- texto contextual
- sem preenchimento pesado

Light:
`border: rgba(17,17,17,.18)`

Dark:
`border: rgba(255,255,255,.18)`

---

## Text Link

Exemplo:
`Conhecer nossa estrutura →`

Sem background.

Hover:
- underline discreto
- deslocamento horizontal de 2–4px no ícone

---

# 11. Hero

## Conceito

O hero deve apresentar autoridade antes de apresentar equipamentos.

### Estrutura recomendada

**Layout split 5/7 ou 6/6**

#### Coluna esquerda
Eyebrow:
`NATAL/RN · DESDE 2011`

Headline:
**MAIS QUE  
SOM.  
MAIS QUE  
LUZ.**

Texto:
`Estrutura, tecnologia e experiência audiovisual para festas, casamentos, 15 anos, formaturas e grandes eventos.`

CTAs:
- `Planejar meu evento`
- `Conhecer nossa estrutura`

#### Coluna direita
- uma fotografia vertical grande de evento
- opcional: segunda imagem menor sobreposta
- cantos 24–32px
- não usar moldura chamativa
- sem filtros pesados

### Não fazer
- imagem de fundo full-screen com texto por cima logo de cara
- gradiente escuro genérico
- imagem de DJ com headphone posando
- luz neon artificial
- elementos 3D decorativos aleatórios

---

# 12. Barra de autoridade

Após o hero, usar uma faixa clean.

Exemplo:

- `DESDE 2011`
- `+500 EVENTOS`
- `NATAL/RN`
- `ESTRUTURA COMPLETA`

### Estilo

- números grandes
- labels pequenas
- grid 4 colunas
- sem cards fechados
- bordas verticais finas opcionais

**Importante:** números não confirmados devem estar marcados no código como placeholders.

---

# 13. Seção conceitual

Headline:
**NÃO É SÓ SOBRE  
EQUIPAMENTOS.**

Body:
`É sobre entender o ambiente, o público e o momento certo para que som, luz e tecnologia funcionem juntos.`

### Layout
- título em uma coluna
- texto estreito em outra
- imagem grande logo abaixo
- muito espaço negativo

---

# 14. Serviços

Título:
**TUDO O QUE O SEU EVENTO PRECISA.**

Serviços:

- DJ
- Som
- Iluminação
- Painel de LED
- Piso de vidro
- Palco
- Estrutura

### Composição

Não usar 7 cards iguais.

Usar um mosaico editorial:

- 1 card grande para iluminação
- 1 card vertical para painel de LED
- 1 card horizontal para piso de vidro
- 1 card médio para som
- 1 ou 2 cards menores para palco e estrutura

### Card de serviço
- fotografia real
- nome do serviço
- legenda opcional
- overlay sutil
- zoom de 1.02–1.04 no hover
- título entra ou sobe levemente

---

# 15. Imagens

A fotografia é o principal elemento visual.

## Priorizar

- festas reais
- 15 anos
- casamentos
- formaturas
- aniversários
- eventos corporativos
- palco montado
- painel de LED ligado
- iluminação arquitetural
- pista de vídeo
- público interagindo
- estruturas em contexto

## Tratamento

### Light Mode
- imagens naturais
- contraste controlado
- cores preservadas
- evitar saturação excessiva

### Dark Mode
- aceitar imagens com luzes mais intensas
- preservar azuis, vermelhos, roxos e dourados da própria fotografia
- interface continua neutra

## Evitar

- stock genérico
- DJ com fone olhando para a câmera
- caixa de som isolada
- render artificial de equipamento
- pessoas falsas em poses corporativas

---

# 16. Portfólio

Título:
**ALGUNS EVENTOS.  
MUITAS HISTÓRIAS.**

Categorias:
- 15 anos
- Casamentos
- Aniversários
- Formaturas
- Corporativos
- Festas

### Layout

Mosaico editorial com ritmo irregular:
- card 2x2
- card vertical
- card horizontal
- full-width pontual

### Hover
Mostrar:
- nome do evento
- categoria
- cidade
- serviços

Exemplo:
`15 ANOS · NATAL/RN`
`DJ · ILUMINAÇÃO · PISO DE VIDRO · LED`

---

# 17. Transição White → Black

Esta é uma das cenas principais do site.

## Objetivo
Fazer o usuário sentir que saiu da parte institucional e entrou no momento do evento.

## Estrutura

Seção de 100vh ou 120vh com imagem de evento full-bleed.

Texto:
**QUANDO AS LUZES  
SE ACENDEM,  
A EXPERIÊNCIA  
COMEÇA.**

## Comportamento no scroll

1. imagem entra clara
2. overlay preto aumenta de `0%` para `55–70%`
3. texto branco aparece com máscara
4. fundo da página converge para `#080808`
5. próximo bloco já começa em dark mode

### Regras
- sem corte brusco
- sem fade exagerado
- sem parallax forte
- movimento lento e refinado

---

# 18. Área Dark

Após a transição:

- fundo: `#080808`
- headings: `#FFFFFF`
- body: `#D9D9D9`
- labels: `#969696`
- accent: `#D4A32A`

As imagens passam a carregar grande parte da cor do layout.

---

# 19. História / Timeline

Headline:
**DESDE 2011  
FAZENDO PARTE  
DE GRANDES MOMENTOS.**

### Estilo

Timeline horizontal no desktop, vertical no mobile.

Exemplo ilustrativo:

- 2011 — Início da Sheldon
- 2015 — Expansão da estrutura
- 2019 — Novas soluções audiovisuais
- 2023 — Estrutura mais completa
- 2026 — Mais que DJ

Marcos fictícios devem ser explicitamente editáveis.

### Visual
- ano em dourado
- texto branco
- linha fina `rgba(255,255,255,.12)`

---

# 20. Parceiros

Headline:
**QUEM CONSTRÓI  
GRANDES EVENTOS  
NÃO FAZ ISSO SOZINHO.**

### Layout
- logos monocromáticos
- grid ou marquee lento
- branco/cinza em fundo preto
- dourado apenas no hover

### Placeholder
Se ainda não houver logos reais:
- PARCEIRO 01
- PARCEIRO 02
- PARCEIRO 03
- PARCEIRO 04

Nunca inventar marcas reais.

---

# 21. Cases

Título:
**ESTRUTURAS QUE  
IMPRESSIONAM.**

Cada case deve usar uma fotografia grande.

### Metadados
- nome
- categoria
- local
- serviços utilizados

### Exemplo fictício
**NOITE DOURADA**  
15 anos · Natal/RN  
`DJ · ILUMINAÇÃO · LED · PISO DE VIDRO`

### Layout
Alternar:
- imagem esquerda / texto direita
- texto esquerda / imagem direita

Evitar cards repetidos.

---

# 22. Pacotes

Título:
**ESCOLHA A ESTRUTURA  
PARA O SEU MOMENTO.**

Subtexto:
`Pacotes pensados para diferentes formatos de evento. Se o seu projeto precisar de algo diferente, montamos uma estrutura personalizada.`

### Regra visual

Não usar padrão SaaS de 3 cards idênticos.

Criar blocos editoriais com:
- número
- nome
- indicação
- itens
- CTA
- capacidade

---

## Pacote 01 — Essencial

**Indicado para:** aniversários e eventos menores

Inclui:
- DJ
- sistema de som
- iluminação ambiente
- 4 pontos de iluminação
- estrutura básica
- montagem e desmontagem
- suporte técnico

Destaque:
`Até 100 convidados`

CTA:
`Quero este pacote`

---

## Pacote 02 — Experiência

Tag:
`MAIS ESCOLHIDO`

Inclui:
- DJ
- som completo
- iluminação cênica
- moving heads
- painel de LED
- estrutura
- técnico durante o evento
- montagem e desmontagem

Destaque:
`Até 200 convidados`

---

## Pacote 03 — Imersão

Inclui:
- DJ
- sonorização completa
- projeto de iluminação
- painel de LED
- piso de vidro
- moving heads
- estrutura de palco
- operação técnica
- montagem e desmontagem

Destaque:
`Estrutura completa`

---

# 23. Pacote personalizado

Bloco especial no dark mode.

Headline:
**SEU EVENTO NÃO CABE  
EM UM PACOTE?**

Subheadline:
**PERFEITO.**

Body:
`Conte para nossa equipe como será o seu evento. Montamos uma estrutura personalizada considerando espaço, público, estilo e necessidades da produção.`

CTA:
**MONTAR MEU PACOTE**

WhatsApp:
`https://wa.me/558488196161`

Mensagem:
`Olá! Vim pelo site da Sheldon e gostaria de montar um pacote personalizado para o meu evento.`

### Visual
- fundo `#111111`
- borda fina `rgba(255,255,255,.08)`
- detalhe dourado
- botão dourado
- imagem opcional ao lado

---

# 24. Depoimentos

Título:
**QUEM VIVEU,  
RECOMENDA.**

### Layout
- 1 depoimento grande em destaque
- 2 ou 3 menores
- sem estrelas gigantes
- sem carrossel acelerado

### Estilo
- aspas discretas
- body 22–28px
- nome pequeno
- fundo preto ou `#111111`

Depoimentos fictícios devem ser claramente marcados como placeholders até a troca por depoimentos reais.

---

# 25. CTA final

Headline:
**SEU EVENTO  
MERECE MAIS.**

Lista:
`SOM.`
`LUZ.`
`TECNOLOGIA.`
`EXPERIÊNCIA.`

Assinatura:
**SHELDON  
MAIS QUE DJ.**

CTA:
**FALAR COM A SHELDON**

### Estilo
- grande área preta
- muito espaço negativo
- uma imagem de evento opcional
- dourado apenas no botão/detalhe

---

# 26. Footer

Fundo:
`#080808`

Conteúdo:
- logo
- navegação
- Instagram
- WhatsApp
- Natal/RN
- Desde 2011
- direitos reservados

### Links
- Início
- Sobre
- Estrutura
- Eventos
- Pacotes
- Contato

### Social
`@sheldonmaisquedj`

### WhatsApp
`(84) 8819-6161`

---

# 27. Microinterações

Usar animações discretas e refinadas.

### Permitido

- fade + translateY `12–24px`
- image reveal por máscara
- stagger em grids
- números contando
- underline animado
- scale de imagem `1 → 1.03`
- texto com clip-path ou overflow reveal
- header adaptativo light/dark
- parallax de `2–4%` no máximo

### Duração

- hover: `180–260ms`
- entrada simples: `450–700ms`
- hero/reveal: `700–1000ms`
- transição white → black: baseada em scroll

### Easing

`cubic-bezier(.22,.61,.36,1)`

### Proibido

- bounce
- spin
- elementos voando
- cards girando
- partículas
- equalizadores
- ondas de áudio
- excesso de scroll hijacking
- animação em todos os elementos

---

# 28. Responsividade

## Desktop
- experiência editorial completa
- grandes headlines
- grids assimétricos
- imagens em grande escala

## Tablet
- reduzir headline
- preservar contraste
- migrar grids 4/8 para 5/7 ou stack

## Mobile

### Regras
- padding lateral 20px
- headline display máx. 64px
- evitar títulos cortados
- imagens full width
- serviços em stack editorial
- cards de pacote empilhados
- timeline vertical
- CTA WhatsApp sempre fácil de alcançar

### Botão flutuante
Pode existir um botão discreto de WhatsApp:
- circular ou pill
- sem pulsar
- sem glow
- posição inferior direita

---

# 29. Acessibilidade

- contraste WCAG AA
- foco visível
- `prefers-reduced-motion`
- alt text em imagens
- não depender apenas de cor
- fonte body nunca abaixo de 15px no mobile
- hit area mínima de 44px

---

# 30. Do's

- Usar bastante espaço em branco na primeira metade
- Usar preto profundo na segunda metade
- Deixar as fotos dos eventos fornecerem a cor
- Trabalhar títulos grandes e curtos
- Usar dourado apenas como assinatura
- Explorar layouts assimétricos
- Mostrar equipamento em contexto
- Dar destaque a tempo de mercado e estrutura
- Usar conteúdo real sempre que possível
- Criar transição gradual white → black
- Fazer o site parecer uma produtora audiovisual premium

---

# 31. Don'ts

- Não criar estética de balada neon
- Não usar roxo/azul como identidade principal
- Não usar glow em todos os elementos
- Não usar equalizadores e ondas sonoras
- Não usar cards genéricos para tudo
- Não usar gradiente gamer
- Não usar fundos estrelados/partículas
- Não transformar o hero em banner promocional
- Não repetir 3 cards SaaS para pacotes
- Não usar fotos genéricas de DJ
- Não usar textos clichês
- Não exagerar no dourado
- Não usar sombras fortes
- Não centralizar todo o conteúdo
- Não criar aparência de template barato

---

# 32. Agent Prompt Guide

## Quick Color Reference

### Light Mode
- Background: `#FFFFFF`
- Alternate: `#F5F5F3`
- Text: `#111111`
- Secondary: `#6F6F6F`
- Accent: `#D4A32A`

### Dark Mode
- Background: `#080808`
- Surface: `#111111`
- Elevated: `#171717`
- Heading: `#FFFFFF`
- Body: `#D9D9D9`
- Muted: `#969696`
- Accent: `#D4A32A`

---

## Example Component Prompt 01 — Hero

Create a premium editorial hero for Sheldon Mais que DJ on a white background. Use a 12-column grid with a left text block spanning 5 columns and a large event photograph spanning 7 columns. Add the eyebrow “NATAL/RN · DESDE 2011”. Use an oversized black headline: “MAIS QUE SOM. MAIS QUE LUZ.” with tight tracking and 0.92–1.0 line-height. Add a concise supporting paragraph and two pill CTAs. The primary button is black with white text and turns Sheldon Gold (#D4A32A) on hover. Use a real event photo with visible lighting, stage or LED structure. Do not use neon UI, gradients, equalizer graphics or generic DJ imagery.

---

## Example Component Prompt 02 — Services Mosaic

Create an editorial services mosaic on a #F5F5F3 background. Use irregular image cards for Iluminação, Painel de LED, Piso de vidro, Som, DJ, Palco and Estrutura. Cards must not be equal-sized. Use 24–32px radii, no heavy shadows, and real event photography. On hover, apply a 1.03 image scale and a subtle dark overlay while the service title shifts upward 4px. The interface remains neutral; photography carries the color.

---

## Example Component Prompt 03 — White to Black Transition

Create a cinematic scroll transition between the light and dark halves of the website. Use a full-viewport event photograph. As the user scrolls, gradually increase a black overlay from 0 to approximately 65%, reveal the white headline “QUANDO AS LUZES SE ACENDEM, A EXPERIÊNCIA COMEÇA.” using a clipped text reveal, and transition the page background into #080808. Motion must be smooth, slow and premium, with no abrupt cut, no heavy parallax and no particle effects.

---

## Example Component Prompt 04 — Packages

Create a premium package section on #080808. Do not use three identical SaaS cards. Use three large editorial rows with package number, title, ideal use, included items, capacity and CTA. Highlight “Experiência” with a small Sheldon Gold tag reading “MAIS ESCOLHIDO”. Use thin white hairlines, generous spacing and gold only for selective accents and actions.

---

# 33. CSS Custom Properties

```css
:root {
  /* Core Colors */
  --color-black: #080808;
  --color-black-pure: #000000;
  --color-paper: #ffffff;
  --color-canvas: #f5f5f3;
  --color-warm-gray: #eae8e3;
  --color-ink: #111111;
  --color-mid-gray: #6f6f6f;
  --color-light-text: #d9d9d9;
  --color-quiet-text: #969696;
  --color-gold: #d4a32a;
  --color-gold-soft: #e5c465;
  --color-gold-wash: #f4e8c5;
  --color-dark-surface: #111111;
  --color-dark-elevated: #171717;
  --color-hairline-light: rgba(17,17,17,.10);
  --color-hairline-dark: rgba(255,255,255,.12);

  /* Typography */
  --font-display: "Manrope", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Inter", "Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Type Scale */
  --text-micro: 12px;
  --text-caption: 14px;
  --text-body-sm: 16px;
  --text-body: 18px;
  --text-body-lg: 22px;
  --text-subheading: 32px;
  --text-heading-sm: 42px;
  --text-heading: 56px;
  --text-heading-lg: 80px;
  --text-display: 108px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;
  --space-5xl: 120px;
  --space-6xl: 160px;
  --space-7xl: 200px;

  /* Layout */
  --page-max-width: 1320px;
  --media-max-width: 1520px;
  --section-gap: clamp(96px, 10vw, 180px);

  /* Radius */
  --radius-sm: 10px;
  --radius-card: 24px;
  --radius-card-lg: 28px;
  --radius-media: 32px;
  --radius-full: 999px;

  /* Motion */
  --ease-premium: cubic-bezier(.22,.61,.36,1);
  --duration-fast: 220ms;
  --duration-base: 520ms;
  --duration-slow: 900ms;
}
```

---

# 34. Tailwind v4 Theme

```css
@theme {
  --color-sheldon-black: #080808;
  --color-sheldon-paper: #ffffff;
  --color-sheldon-canvas: #f5f5f3;
  --color-sheldon-ink: #111111;
  --color-sheldon-gray: #6f6f6f;
  --color-sheldon-light: #d9d9d9;
  --color-sheldon-muted: #969696;
  --color-sheldon-gold: #d4a32a;
  --color-sheldon-gold-soft: #e5c465;
  --color-sheldon-dark-surface: #111111;
  --color-sheldon-dark-elevated: #171717;

  --font-display: "Manrope", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", "Manrope", ui-sans-serif, system-ui, sans-serif;

  --text-micro: 12px;
  --text-caption: 14px;
  --text-body-sm: 16px;
  --text-body: 18px;
  --text-body-lg: 22px;
  --text-subheading: 32px;
  --text-heading-sm: 42px;
  --text-heading: 56px;
  --text-heading-lg: 80px;
  --text-display: 108px;

  --radius-sm: 10px;
  --radius-card: 24px;
  --radius-card-lg: 28px;
  --radius-media: 32px;
  --radius-full: 999px;
}
```

---

# 35. Resultado esperado

O usuário deve sentir duas coisas em sequência:

### Primeira metade
**“Essa é uma empresa profissional, organizada e experiente.”**

### Segunda metade
**“Essa empresa sabe criar um grande evento.”**

O sistema deve transmitir:

- AUTORIDADE
- ESTRUTURA
- EXPERIÊNCIA
- TECNOLOGIA
- CONFIANÇA
- IMPACTO

Assinatura final:

**SHELDON — MAIS QUE DJ.**
