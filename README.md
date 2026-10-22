# dashboard_bom_obra_rodrigo_reinel_n4_3esq
Dashboard - Análise da concorrência à obra na Rua Rodrigo Reinel n4 3.Esq

## Interactive CV — Pedro Varela Pinto

`cv_pedro/` holds an interactive, animated dashboard (in English) of Pedro Varela Pinto's curriculum,
built from the Notion page "Curriculum Pedro Varela Pinto" with all its certificates, documents, images and videos.

- Open: `cv_pedro/index.html` (GitHub Pages: `/cv_pedro/`)
- Content: `cv_pedro/notion/*/_page.md` + downloaded files; `python3 cv_pedro/tools/build_data.py` regenerates `cv_pedro/data.js`.

## Proposta de Remodelação — Projeto Restelo T4

`restelo_t4/` é a apresentação/dashboard interativo (em português) da proposta "Proposta de Remodelação Restelo T4"
da Imperiou's Remodelações, com todo o texto e imagens dos 13 diapositivos.

- Abrir: `restelo_t4/index.html` (GitHub Pages: `/restelo_t4/`) — funciona offline (Chart.js incluído em `vendor/`).
- Interatividade: planta com zonas clicáveis, pontos interativos na cozinha / equipamentos / casa de banho,
  matriz de intervenção filtrável com gráficos, simulador de IVA, passos marcáveis, galeria dos diapositivos
  originais e modo apresentação (botão ▶, setas ← →).
- Imagens: `python3 restelo_t4/tools/crop.py <pptx>/ppt/media restelo_t4/assets` recorta-as a partir do PPTX.
