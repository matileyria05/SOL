# Web pública de REMAX SOL

Sitio de la oficina para clientes y futuros agentes: propiedades (enlace al portal REMAX), pedido de tasación, sumate como agente, equipo y contacto. Es HTML estático, sin paso de compilación, y se publica en Cloudflare Pages. La intranet de agentes está en el repositorio `intranet-sol`.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `datos.js` | **Los datos de la oficina**: dirección, teléfono, WhatsApp, mail, Instagram, horario, enlace a remax.com.ar y el equipo. Lo que está en `null` se ve como "A confirmar". |
| `index.html` | Los textos y las secciones. |
| `estilos.css` | Diseño, con la paleta y la tipografía del manual de marca REMAX. |
| `app.js` | Completa los datos en la página y arma los mensajes de los formularios. |
| `img/` | El sol de la oficina y, más adelante, el logo oficial y las fotos del equipo (`img/equipo/`). |
| `_headers` | Encabezados de seguridad para Cloudflare. |

## Formularios

Los formularios de tasación y de agentes no guardan datos en ningún servidor: arman el mensaje y lo abren en el WhatsApp de la oficina (o en el mail, si no hay WhatsApp cargado). La persona lo envía desde su teléfono.

## Antes de publicar con dominio propio

El manual de marca pide que la portada de todo sitio REMAX muestre el nombre de la oficina, su dirección, teléfono y mail, y la leyenda de independencia. Completar en `datos.js` por lo menos `direccion`, `telefono`, `mail`, `whatsapp` y `portalRemax`, y agregar el logo oficial cuando RAU lo entregue.

## Publicar en Cloudflare Pages (una sola vez)

1. En [dash.cloudflare.com](https://dash.cloudflare.com): Workers & Pages → Create → Pages → *Connect to Git* → elegir el repositorio `sol`.
2. Framework preset: *None*. Build command: vacío. Build output directory: `/`.
3. *Save and Deploy*. Queda en `sol-xxx.pages.dev`; cada cambio que se sube a `main` se publica solo.
4. Dominio propio: `remax-sol.com.ar` (registrado en NIC Argentina). Delegarlo a Cloudflare y sumarlo en Custom domains.
