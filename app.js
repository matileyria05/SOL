(function () {
  "use strict";
  var D = window.SOL || {};

  var NOMBRES = {
    direccion: "dirección de la oficina",
    telefono: "teléfono",
    mail: "mail de la oficina",
    horario: "horario de atención",
    instagram: "Instagram",
    portalRemax: "enlace a remax.com.ar",
    whatsapp: "WhatsApp de la oficina"
  };

  function pendiente(clave) {
    var e = document.createElement("em");
    e.className = "pendiente";
    e.textContent = "A confirmar: " + (NOMBRES[clave] || clave);
    return e;
  }

  // Textos de datos.js
  document.querySelectorAll("[data-dato]").forEach(function (el) {
    var clave = el.getAttribute("data-dato");
    var valor = D[clave];
    el.textContent = "";
    if (!valor) { el.appendChild(pendiente(clave)); return; }
    var a;
    if (clave === "mail") {
      a = document.createElement("a"); a.href = "mailto:" + valor; a.textContent = valor;
    } else if (clave === "telefono") {
      a = document.createElement("a"); a.href = "tel:" + valor.replace(/[^\d+]/g, ""); a.textContent = valor;
    } else if (clave === "instagram") {
      a = document.createElement("a"); a.href = "https://www.instagram.com/" + valor.replace(/^@/, "");
      a.target = "_blank"; a.rel = "noopener"; a.textContent = "@" + valor.replace(/^@/, "");
    } else if (el.hasAttribute("data-enlace-dato") && D[el.getAttribute("data-enlace-dato")]) {
      a = document.createElement("a"); a.href = D[el.getAttribute("data-enlace-dato")];
      a.target = "_blank"; a.rel = "noopener"; a.textContent = valor;
    }
    if (a) el.appendChild(a); else el.textContent = valor;
  });

  // Enlaces (portal REMAX)
  document.querySelectorAll("[data-enlace]").forEach(function (el) {
    var url = D[el.getAttribute("data-enlace")];
    if (url) el.href = url;
    else { el.removeAttribute("target"); el.href = "#contacto"; }
  });
  document.querySelectorAll("[data-falta]").forEach(function (el) {
    var clave = el.getAttribute("data-falta");
    if (D[clave]) el.remove();
    else { el.textContent = ""; el.appendChild(pendiente(clave)); }
  });

  // WhatsApp
  function linkWhatsapp(texto) {
    return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    if (D.whatsapp) {
      el.href = linkWhatsapp(el.getAttribute("data-whatsapp"));
      el.target = "_blank"; el.rel = "noopener";
    } else if (D.mail) {
      el.href = "mailto:" + D.mail + "?body=" + encodeURIComponent(el.getAttribute("data-whatsapp"));
    } else {
      el.href = "#contacto";
    }
  });

  // Equipo
  var lista = document.querySelector("[data-equipo]");
  if (lista) {
    (D.equipo || []).forEach(function (p) {
      var li = document.createElement("li"); li.className = "persona";
      if (p.foto) {
        var img = document.createElement("img");
        img.className = "persona-foto"; img.src = p.foto; img.alt = ""; img.loading = "lazy";
        li.appendChild(img);
      } else {
        var ini = document.createElement("div");
        ini.className = "persona-inicial"; ini.setAttribute("aria-hidden", "true");
        ini.textContent = (p.nombre || "?").trim().charAt(0);
        li.appendChild(ini);
      }
      var n = document.createElement("strong"); n.textContent = p.nombre; li.appendChild(n);
      if (p.rol) { var r = document.createElement("span"); r.textContent = p.rol; li.appendChild(r); }
      lista.appendChild(li);
    });
  }

  // Formularios: arman el mensaje y lo abren en WhatsApp (o mail).
  var ENCABEZADOS = {
    tasacion: "Hola, quiero pedir una tasación.",
    agente: "Hola, me interesa sumarme como agente a REMAX SOL."
  };
  var ETIQUETAS = {
    nombre: "Nombre", telefono: "Teléfono", direccion: "Dirección", tipo: "Tipo",
    operacion: "Quiero", experiencia: "Experiencia", comentario: "Comentario"
  };

  document.querySelectorAll("[data-formulario]").forEach(function (form) {
    var aviso = form.querySelector(".aviso");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      aviso.textContent = ""; aviso.className = "aviso";
      var faltan = [];
      form.querySelectorAll("[required]").forEach(function (c) {
        var vacio = !c.value.trim();
        c.setAttribute("aria-invalid", vacio ? "true" : "false");
        if (vacio) faltan.push(c);
      });
      if (faltan.length) {
        aviso.className = "aviso error";
        aviso.textContent = "Completá los campos marcados para poder enviar.";
        faltan[0].focus();
        return;
      }
      var lineas = [ENCABEZADOS[form.getAttribute("data-formulario")]];
      new FormData(form).forEach(function (v, k) {
        v = String(v).trim();
        if (v) lineas.push(ETIQUETAS[k] + ": " + v);
      });
      var texto = lineas.join("\n");

      if (D.whatsapp) {
        window.open(linkWhatsapp(texto), "_blank", "noopener");
        aviso.textContent = "Abrimos WhatsApp con tu mensaje. Solo falta que toques Enviar.";
      } else if (D.mail) {
        window.location.href = "mailto:" + D.mail + "?subject=" + encodeURIComponent(lineas[0]) + "&body=" + encodeURIComponent(texto);
        aviso.textContent = "Abrimos tu correo con el mensaje listo para enviar.";
      } else {
        aviso.className = "aviso error";
        aviso.textContent = "Todavía no cargamos el WhatsApp ni el mail de la oficina, así que el mensaje no se puede enviar.";
      }
    });
  });

  // Menú en celular
  var boton = document.querySelector(".menu-boton");
  var menu = document.getElementById("menu");
  if (boton && menu) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("abierto"); boton.setAttribute("aria-expanded", "false"); }
    });
  }
})();
