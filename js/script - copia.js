function toggleDarkMode() {
  const body = document.body;
  const btn = document.getElementById("modoBtn");
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  btn.innerHTML = dark ? "☀️ Modo claro" : "🌓 Modo oscuro";
  localStorage.setItem("modoOscuro", dark);
}

window.onload = () => {
  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    const btn = document.getElementById("modoBtn");
    if (btn) btn.innerHTML = "☀️ Modo claro";
  }
};

const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCdmX0nutLPKaDcodFVtZv0w9a_K9Kkw04dR4Xmzxf20usc3S3VlZmjv8XmEu6Pw/pub?gid=1139506582&single=true&output=csv";
    let juegos = [];

    function cargarDatos() {
      fetch(URL_CSV)
        .then(res => res.text())
        .then(data => {
          const rows = data.trim().split('\n');
          const headers = rows[0].split(',');
          juegos = rows.slice(1).map(row => {
            const values = row.split(',');
            let juego = {};
            headers.forEach((h, i) => juego[h.trim()] = values[i]?.trim().replace(/^"|"$/g, ''));
            return juego;
          });
          rellenarFiltros();
          mostrarJuegos(juegos);
        });
    }

    function rellenarFiltros() {
      const modalidadSelect = document.getElementById("modalidad");
      const clasificacionSelect = document.getElementById("clasificacion");
      const editorialSelect = document.getElementById("editorial");

      const modalidades = [...new Set(juegos.map(j => j.Modalidad))].sort();
      const clasificaciones = [...new Set(juegos.map(j => j["Clasificación"]))].sort();
      const editoriales = [...new Set(juegos.map(j => j.Editorial))].sort();

      modalidadSelect.innerHTML = `<option value="">(Cualquiera)</option>` + modalidades.map(m => `<option value="${m}">${m}</option>`).join('');
      clasificacionSelect.innerHTML = `<option value="">(Cualquiera)</option>` + clasificaciones.map(c => `<option value="${c}">${c}</option>`).join('');
      editorialSelect.innerHTML = `<option value="">(Cualquiera)</option>` + editoriales.map(e => `<option value="${e}">${e}</option>`).join('');
    }

    function resetearFiltros() {
  document.querySelectorAll('.filtros input, .filtros select').forEach(el => el.value = '');
  mostrarJuegos(juegos);
}

function filtrar() {
  const nombre = document.getElementById("nombre").value.toLowerCase();
  const tipo = document.getElementById("tipo").value.toLowerCase();
  const edad = parseInt(document.getElementById("edad").value);
  const edadMax = parseInt(document.getElementById("edadMax").value);
  const duracionMin = parseInt(document.getElementById("duracionMin").value);
  const duracionMax = parseInt(document.getElementById("duracionMax").value);
  const jugadoresMin = parseInt(document.getElementById("jugadoresMin").value);
  const jugadoresMax = parseInt(document.getElementById("jugadoresMax").value);
  const editorial = document.getElementById("editorial").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const modalidad = document.getElementById("modalidad").value;
  const clasificacion = document.getElementById("clasificacion").value;
  const mecanica = document.getElementById("mecanica").value.toLowerCase();
  const edadExacta = parseInt(document.getElementById("edadExacta").value);
  const duracionExacta = parseInt(document.getElementById("duracionExacta").value);
  const jugadoresExactos = parseInt(document.getElementById("jugadoresExactos").value);
  const anio = parseInt(document.getElementById("anio").value);
  const autores = document.getElementById("autores").value.toLowerCase();
  const idioma = document.getElementById("idioma").value.toLowerCase();

      const filtrados = juegos.filter(j => {
        const matchNombre = !nombre || j.Nombre.toLowerCase().includes(nombre);
        const edadJuego = parseInt(j["Edad mínima"]);
        const duracionJuegoMin = parseInt(j["Duración mínima"]);
        const duracionJuegoMax = parseInt(j["Duración máxima"]);
        const jugadoresJuegoMin = parseInt(j["Jugadores mínimos"]);
        const jugadoresJuegoMax = parseInt(j["Jugadores máximos"]);
        const precioJuego = parseFloat(j["Precio"].replace(/[€\s]/g, '').replace(',', '.'));
	      const matchTipo = !tipo || j.Tipo.toLowerCase().includes(tipo);
        const matchEdad = !edad || edadJuego >= edad;
        const matchEdadMax = !edadMax || edadJuego <= edadMax;
        const matchDuracionMin = !duracionMin || (!isNaN(duracionJuegoMin) && duracionJuegoMin >= duracionMin);
        const matchDuracionMax = !duracionMax || (!isNaN(duracionJuegoMax) && duracionJuegoMax === duracionMax);
        const matchJugadoresMin = isNaN(jugadoresMin) || (!isNaN(jugadoresJuegoMin) && jugadoresJuegoMin === jugadoresMin);
        const matchJugadoresMax = isNaN(jugadoresMax) || (!isNaN(jugadoresJuegoMax) && jugadoresJuegoMax === jugadoresMax);
        const matchEditorial = !editorial || j.Editorial === editorial;
        const matchPrecio = isNaN(precio) || precioJuego <= precio;
        const matchModalidad = !modalidad || j.Modalidad === modalidad;
        const matchClasificacion = !clasificacion || j["Clasificación"] === clasificacion;
        const matchMecanica = !mecanica || j.Mecanica.toLowerCase().includes(mecanica);
	      const matchAnio = isNaN(anio) || parseInt(j.Año) === anio;
	      const matchAutores = !autores || j.Autores.toLowerCase().includes(autores);
	      const matchIdioma = !idioma || j.Idioma.toLowerCase().includes(idioma);

        return matchNombre &&
        matchTipo &&
        matchEdad &&
        matchEdadMax &&
        matchDuracionMin &&
        matchDuracionMax &&
        matchJugadoresMin &&
        matchJugadoresMax &&
        matchEditorial &&
        matchPrecio &&
        matchModalidad &&
        matchClasificacion &&
        matchMecanica &&
	      matchAnio &&
	      matchAutores &&
	      matchIdioma &&	


        (isNaN(edadExacta) || edadJuego === edadExacta) &&
        (isNaN(duracionExacta) || duracionJuegoMin <= duracionExacta && duracionJuegoMax >= duracionExacta) &&
        (isNaN(jugadoresExactos) || (jugadoresJuegoMin <= jugadoresExactos && jugadoresJuegoMax >= jugadoresExactos));
      });

      
  const orden = document.getElementById("orden").value;
  if (orden === "nombre") {
    filtrados.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  } else if (orden === "duracion") {
    filtrados.sort((a, b) => parseInt(a["Duración mínima"]) - parseInt(b["Duración mínima"]));
  } else if (orden === "precio") {
    filtrados.sort((a, b) => {
      const pa = parseFloat(a["Precio"].replace(/[€\s]/g, '').replace(',', '.'));
      const pb = parseFloat(b["Precio"].replace(/[€\s]/g, '').replace(',', '.'));
      return pa - pb;
    });
  }

  mostrarJuegos(filtrados);
    }

    function mostrarJuegos(lista) {
  const contador = document.getElementById("contador");
  contador.textContent = lista.length > 0 ? `🎯 Juegos encontrados: ${lista.length}` : "⚠️ No se encontraron juegos con esos criterios.";

      const div = document.getElementById("resultados");
      div.innerHTML = lista.map(j => {
        const precio = parseFloat(j["Precio"].replace(/[€\s]/g, '').replace(',', '.'));
        const imagen = j["Imagen"] ? `images/juegos/${j["Imagen"]}` : null;
        return `
<div class="juego">
  <strong>${j.Nombre}</strong><br>
  ${j["Alta valoración"] === "Si" ? `<span class="badge-estrella">⭐ Alta valoración en BGG</span>` : ''} ${j["Spiel"] === "Si" ? `<span class="badge-spiel">🏆 Premio Spiel des Jahres</span>` : ''} ${j["Viral"] === "Si" ? `<span class="badge-viral">🔥 Juego viral</span>` : ''} ${j["Favorito"] === "Si" ? `<span class="badge-favorito">🎯 Favorito del canal</span>` : ''}
  ${imagen ? `<img src="${imagen}" alt="${j.Nombre}" class="miniatura">` : ''}
  <div class="tags-contenedor">
    ${j.Tipo.split('+').map(t => `<span class="tag tag-tipo" data-filtro="tipo" data-valor="${t.trim()}">${t.trim()}</span>`).join('')}
    ${j.Mecanica.split('+').map(t => `<span class="tag tag-mecanica" data-filtro="mecanica" data-valor="${t.trim()}">${t.trim()}</span>`).join('')}
    ${j.Idioma.split('+').map(i => `<span class="tag tag-idioma" data-filtro="idioma" data-valor="${i.trim()}">${i.trim()}</span>`).join('')}
    ${j.Editorial.split('+').map(i => `<span class="tag tag-editorial" data-filtro="editorial" data-valor="${i.trim()}">${i.trim()}</span>`).join('')}
    ${j.Modalidad ? `<span class="tag tag-modalidad" data-filtro="modalidad" data-valor="${j.Modalidad}">${j.Modalidad}</span>` : ''}
    ${j["Clasificación"] ? `<span class="tag tag-clasificacion" data-filtro="clasificacion" data-valor="${j["Clasificación"]}">${j["Clasificación"]}</span>` : ''}
  </div>
  <p class="descripcion">${j["Descripción"]}</p>
  ${j.BGG ? `<p><a href="https://boardgamegeek.com/boardgame/${j.BGG}" target="_blank" class="bgg-link">🔗 Ver en BGG</a></p>` : ''}
  <p><strong>Tipo:</strong> ${j.Tipo}</p>
  <p><strong>Mecánica:</strong> ${j["Mecanica"]}</p>
  <p><strong>Edad:</strong> ${j["Edad mínima"]}+</p>
  <p><strong>Duración:</strong> ${j["Duración mínima"]}-${j["Duración máxima"]} min</p>
  <p><strong>Jugadores:</strong> ${j["Jugadores mínimos"]}-${j["Jugadores máximos"]}</p>
  <p><strong>Editorial:</strong> ${j.Editorial}</p>
  <p><strong>Modalidad:</strong> ${j.Modalidad}</p>
  <p><strong>Clasificación:</strong> ${j["Clasificación"]}</p>
  <p><strong>Año de publicación:</strong> ${j["Año"]}</p>
  <p><strong>Autores:</strong> ${j["Autores"]}</p>
  <p><strong>Idiomas:</strong> ${j["Idioma"]}</p>
  <p><strong>Precio:</strong> ${isNaN(precio) ? '' : precio.toFixed(2) + ' €'}</p>
</div>
`;
      }).join('');
    }

    cargarDatos();


document.querySelectorAll(".filtros input, .filtros select").forEach(el => {
  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      filtrar();
    }
  });
});

function toggleAvanzados() {
  const zona = document.getElementById("filtros-avanzados");
  if (zona.style.display === "none") {
    zona.style.display = "block";
  } else {
    zona.style.display = "none";
  }
}

function sorprendeme() {
  const nombre = document.getElementById("nombre").value.toLowerCase();
  const tipo = document.getElementById("tipo").value.toLowerCase();
  const edad = parseInt(document.getElementById("edad").value);
  const edadMax = parseInt(document.getElementById("edadMax").value);
  const duracionMin = parseInt(document.getElementById("duracionMin").value);
  const duracionMax = parseInt(document.getElementById("duracionMax").value);
  const jugadoresMin = parseInt(document.getElementById("jugadoresMin").value);
  const jugadoresMax = parseInt(document.getElementById("jugadoresMax").value);
  const editorial = document.getElementById("editorial").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const modalidad = document.getElementById("modalidad").value;
  const clasificacion = document.getElementById("clasificacion").value;
  const mecanica = document.getElementById("mecanica").value.toLowerCase();
  const edadExacta = parseInt(document.getElementById("edadExacta").value);
  const duracionExacta = parseInt(document.getElementById("duracionExacta").value);
  const jugadoresExactos = parseInt(document.getElementById("jugadoresExactos").value);
  const anio = parseInt(document.getElementById("anio").value);
  const autores = document.getElementById("autores").value.toLowerCase();
  const idioma = document.getElementById("idioma").value.toLowerCase();

  // Filtro igual al de filtrar()
  const filtrados = juegos.filter(j => {
    const matchNombre = !nombre || j.Nombre.toLowerCase().includes(nombre);
    const edadJuego = parseInt(j["Edad mínima"]);
    const duracionJuegoMin = parseInt(j["Duración mínima"]);
    const duracionJuegoMax = parseInt(j["Duración máxima"]);
    const jugadoresJuegoMin = parseInt(j["Jugadores mínimos"]);
    const jugadoresJuegoMax = parseInt(j["Jugadores máximos"]);
    const precioJuego = parseFloat(j["Precio"].replace(/[€\s]/g, '').replace(',', '.'));
    const matchTipo = !tipo || j.Tipo.toLowerCase().includes(tipo);
    const matchEdad = !edad || edadJuego >= edad;
    const matchEdadMax = !edadMax || edadJuego <= edadMax;
    const matchDuracionMin = !duracionMin || (!isNaN(duracionJuegoMin) && duracionJuegoMin >= duracionMin);
    const matchDuracionMax = !duracionMax || (!isNaN(duracionJuegoMax) && duracionJuegoMax === duracionMax);
    const matchJugadoresMin = isNaN(jugadoresMin) || (!isNaN(jugadoresJuegoMin) && jugadoresJuegoMin === jugadoresMin);
    const matchJugadoresMax = isNaN(jugadoresMax) || (!isNaN(jugadoresJuegoMax) && jugadoresJuegoMax === jugadoresMax);
    const matchEditorial = !editorial || j.Editorial === editorial;
    const matchPrecio = isNaN(precio) || precioJuego <= precio;
    const matchModalidad = !modalidad || j.Modalidad === modalidad;
    const matchClasificacion = !clasificacion || j["Clasificación"] === clasificacion;
    const matchMecanica = !mecanica || j.Mecanica.toLowerCase().includes(mecanica);
    const matchAnio = isNaN(anio) || parseInt(j.Año) === anio;
    const matchAutores = !autores || j.Autores.toLowerCase().includes(autores);
    const matchIdioma = !idioma || j.Idioma.toLowerCase().includes(idioma);

    return matchNombre &&
      matchTipo &&
      matchEdad &&
      matchEdadMax &&
      matchDuracionMin &&
      matchDuracionMax &&
      matchJugadoresMin &&
      matchJugadoresMax &&
      matchEditorial &&
      matchPrecio &&
      matchModalidad &&
      matchClasificacion &&
      matchMecanica &&
      matchAnio &&
      matchAutores &&
      matchIdioma &&
      (isNaN(edadExacta) || edadJuego === edadExacta) &&
      (isNaN(duracionExacta) || duracionJuegoMin <= duracionExacta && duracionJuegoMax >= duracionExacta) &&
      (isNaN(jugadoresExactos) || (jugadoresJuegoMin <= jugadoresExactos && jugadoresJuegoMax >= jugadoresExactos));
  });

  if (filtrados.length === 0) {
    document.getElementById("contador").textContent = "⚠️ No se encontraron juegos con esos criterios.";
    document.getElementById("resultados").innerHTML = "";
    return;
  }

  // Elegir uno aleatorio
  const aleatorio = filtrados[Math.floor(Math.random() * filtrados.length)];
  mostrarJuegos([aleatorio]);
  document.getElementById("contador").textContent = "🎁 Juego aleatorio sugerido:";
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tag")) {
    const filtro = e.target.getAttribute("data-filtro");
    const valor = e.target.getAttribute("data-valor");

    // Resetear todos los filtros
    document.querySelectorAll('.filtros input, .filtros select').forEach(el => el.value = '');

    // Aplicar solo el valor del tag clicado
    const input = document.getElementById(filtro);
    if (input) {
      input.value = valor;
    }

    // Aplicar el filtro
    filtrar();

    // Scroll automático al contador
    setTimeout(() => {
      const contador = document.getElementById("contador");
      if (contador) {
        contador.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  }
});

