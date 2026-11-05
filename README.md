# Onstage Vision — Website V2

Protótipo responsivo HTML/CSS/JavaScript sem frameworks nem build. A esfera é desenhada com projeção 3D em Canvas e gira em aproximadamente 28 segundos.

## Abrir

Abra `index.html` no navegador. Opcionalmente use Live Server ou `python -m http.server 8000`.

## Publicar no GitHub Pages

1. Crie um repositório público exclusivo `onstage-vision`.
2. Envie todo o conteúdo desta pasta à raiz do repositório.
3. Em Settings → Pages, escolha Deploy from a branch → main / root.
4. Após a publicação, configure o domínio personalizado se houver um domínio adquirido. Configure DNS na Hostinger conforme as instruções oficiais do GitHub Pages, sem substituir os registros DNS de outros serviços.

## Pendências de publicação comercial

- Confirmar o repertório e os estilos de fato oferecidos.
- Substituir os fundos conceituais por fotos autorizadas da banda quando disponíveis.
- Enviar os vídeos oficiais da banda e habilitar apresentação.
- Formulário integrado ao WhatsApp +55 (13) 99181-1006, com mensagem personalizada por tipo de evento. O visitante confirma o envio no WhatsApp.
- Confirmar domínio, endereço de e-mail e textos institucionais.

## Ajustes

- Velocidade de rotação: `Math.PI*2/28` no `script.js` (28 = segundos por volta).
- Instagram: `https://www.instagram.com/onstagevision/`.
- Arquivos da marca em `/assets`.
