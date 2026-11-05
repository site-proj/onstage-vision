# Onstage Vision — V2 corrigida

A estrutura, os textos e as seções da V2 foram preservados. A referência visual enviada orientou o acabamento da esfera, sem redesenhar as seções.

- Marca completa no cabeçalho e na esfera. O arquivo original `wordmark.png` está truncado no próprio PNG. Ele foi mantido intacto, mas não é mais exibido. O site usa a marca completa já presente em `hero-poster.jpg`, por uma janela SVG com filtro de luminância que retira o fundo escuro. Não foram recriadas letras ou substituída a tipografia da marca. Isso preserva a arte disponível, mas não equivale a um arquivo vetorial oficial do logo; um original transparente permitirá substituir essa solução posteriormente.
- Malha da esfera gira continuamente em 360° a cada 28 segundos; a marca permanece voltada ao visitante para manter a leitura. O brilho acompanha a borda e as órbitas ficam atrás da marca.
- Títulos e colunas dimensionados para evitar transbordamento, com tratamento para celulares, tablets e desktops.
- Fontes Montserrat e DM Sans incluídas localmente com licenças OFL. O site não depende do Google Fonts para manter a tipografia aprovada.
- Preferência de movimento reduzido respeitada; animações pausam quando a aba fica oculta.

## Abrir e revisar

Extraia o ZIP e abra `index.html`. Para prévia por HTTP, dentro desta pasta execute `python -m http.server 8000` e acesse `http://localhost:8000`.

## Verificação

Chromium, com larguras simuladas de 320, 360, 390, 420, 768, 900, 901, 1024, 1280, 1440 e 1920 px:

- Sem rolagem horizontal da página ou transbordamento nos títulos e no formulário.
- Sem sobreposição entre texto principal e esfera.
- Menu mobile abre e fecha ao escolher uma seção.
- Formulário prepara a mensagem com os dados informados, mantendo o comportamento da V2.
- Canvas animado e alternativa estática para movimento reduzido verificados.
- Sem exceções de JavaScript nos fluxos testados.
- Inspeção visual de capturas completas de desktop e mobile.

As órbitas e o halo ultrapassam intencionalmente a caixa interna da esfera, sem ultrapassar a página. Os testes não substituem uma avaliação em aparelhos físicos ou no Safari.

## Publicação

Este pacote está pronto para substituir os arquivos da V2 na hospedagem existente. Nenhuma hospedagem foi alterada: o ZIP não identifica um site hospedado e o projeto Onstage Vision não foi localizado nos Sites conectados. As instruções de GitHub Pages do README original são documentação, não uma alteração realizada.
