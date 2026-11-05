# Onstage Vision — V2 corrigida

A estrutura, os textos e as seções da V2 foram preservados. A referência visual enviada orientou o acabamento da esfera, sem redesenhar as seções.

- Marca completa no cabeçalho e na esfera. O arquivo original `wordmark.png` está truncado no próprio PNG. Ele foi mantido intacto, mas não é mais exibido. O site usa a marca completa já presente em `hero-poster.jpg`, por uma janela SVG com filtro de luminância que retira o fundo escuro. Não foram recriadas letras ou substituída a tipografia da marca. Isso preserva a arte disponível, mas não equivale a um arquivo vetorial oficial do logo; um original transparente permitirá substituir essa solução posteriormente.
- Malha da esfera gira continuamente em 360° a cada 28 segundos; a marca permanece voltada ao visitante para manter a leitura. O brilho acompanha a borda e as órbitas ficam atrás da marca.
- Títulos e colunas dimensionados para evitar transbordamento, com tratamento para celulares, tablets e desktops.
- Fontes Barlow Condensed (títulos) e Space Grotesk (textos) incluídas localmente com licenças OFL. O site não depende do Google Fonts para manter a tipografia aprovada.
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

## Ajuste após revisão em vídeo

- Órbita contínua em Canvas, com a metade traseira oculta pelo globo.
- Traço radial substituído por luz tangencial suave na borda.
- Malha com eixo inclinado e transição suave na área da marca.
- Paleta neutralizada para preto, grafite e prata, conforme solicitado.
- Tipografia grotesca condensada nos títulos e grotesca geométrica nos textos.

## Referência final do globo

Substituída a composição orbital pela referência enviada: esfera preta, curvas prateadas com perspectiva, fonte de luz acima da marca e feixe no quadrante superior direito. Órbita externa, halo e brilho no piso removidos do globo. A malha mantém rotação contínua de 28 segundos, com a marca voltada para leitura e alternativa estática para movimento reduzido. Não é uma imagem estática: a composição foi reproduzida em Canvas, mantendo a marca extraída da arte da V2.

Verificada em Chromium nas 11 larguras de 320 a 1920 px: sem transbordamento ou sobreposição, sem erros de JavaScript, menu e formulário funcionais.

## Destaque e movimento na navegação

A promessa da marca “UMA VISÃO QUE VAI ALÉM DO PALCO” passa a ser o título principal, sem subtítulo duplicado. Textura monocromática discreta atrás da esfera e entrada dos cards, estilos, indicadores e formulário ao entrar na tela. Animações executadas uma vez, com intervalos suaves e respeito ao movimento reduzido. Conteúdo visível sem JavaScript. Verificação em Chromium: sete larguras entre 320 e 1920 px, sem transbordamento, entrada visível após rolagem e sem erros de JavaScript.

## Contato, textura e novas visitas

- Formulário abre o WhatsApp 5513991811006 em uma nova aba com mensagem adaptada a casamento, festa, evento corporativo ou outro. Inclui nome, tipo, data, cidade e detalhes. Campos opcionais vazios ficam a definir. O visitante confirma o envio no WhatsApp; não há envio automático pelo site. Link visível e cópia do texto oferecem uma alternativa caso a abertura não ocorra.
- Textura monocromática reforçada atrás da esfera.
- Animações de entrada reiniciam a cada visita à página, inclusive quando ela é restaurada pelo navegador. Executam uma vez por elemento durante a navegação, sem guardar bloqueios de animação em armazenamento local. Movimento reduzido respeitado.
- Abertura identifica explicitamente a Onstage Vision como banda ao vivo e descreve os eventos atendidos.
- Verificação no Chromium em desktop e mobile: quatro tipos de mensagem, telefone, caracteres especiais, datas opcionais, validação de nome, botão de cópia, alternativa de abertura, novas visitas/restauração e movimento reduzido. WhatsApp interceptado nos testes, sem envio de mensagens reais. Sem transbordamento de 320 a 1440 px e sem erros de JavaScript.
