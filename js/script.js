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
      const tipoSelect = document.getElementById("tipo");
      const modalidadSelect = document.getElementById("modalidad");
      const clasificacionSelect = document.getElementById("clasificacion");
      const editorialSelect = document.getElementById("editorial");
      const mecanicaSelect = document.getElementById("mecanica");

      const tipos = [...new Set(juegos.map(j => j.Tipo))].sort();
      const modalidades = [...new Set(juegos.map(j => j.Modalidad))].sort();
      const clasificaciones = [...new Set(juegos.map(j => j["Clasificación"]))].sort();
      const editoriales = [...new Set(juegos.map(j => j.Editorial))].sort();
      const mecanicas = [...new Set(juegos.map(j => j["Mecánica principal"]))].sort();

      tipoSelect.innerHTML = `<option value="">(Cualquiera)</option>` + tipos.map(t => `<option value="${t}">${t}</option>`).join('');
      modalidadSelect.innerHTML = `<option value="">(Cualquiera)</option>` + modalidades.map(m => `<option value="${m}">${m}</option>`).join('');
      clasificacionSelect.innerHTML = `<option value="">(Cualquiera)</option>` + clasificaciones.map(c => `<option value="${c}">${c}</option>`).join('');
      editorialSelect.innerHTML = `<option value="">(Cualquiera)</option>` + editoriales.map(e => `<option value="${e}">${e}</option>`).join('');
      mecanicaSelect.innerHTML = `<option value="">(Cualquiera)</option>` + mecanicas.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    function resetearFiltros() {
  document.querySelectorAll('.filtros input, .filtros select').forEach(el => el.value = '');
  mostrarJuegos(juegos);
}

function filtrar() {
  const nombre = document.getElementById("nombre").value.toLowerCase();
  const tipo = document.getElementById("tipo").value;
  const jugadores = document.getElementById("jugadores").value;
  const tiempo = document.getElementById("tiempo").value;
  const mecanica = document.getElementById("mecanica").value;
  const orden = document.getElementById("orden").value;

  const sinFiltros = 
    nombre === "" && tipo === "" && jugadores === "" && tiempo === "" && mecanica === "";

  let juegosFiltrados = sinFiltros
    ? [...juegos]
    : juegos.filter(j => {
        const matchNombre = j.Nombre.toLowerCase().includes(nombre);
        const matchTipo = tipo === "" || j.Tipo === tipo;
        const matchJugadores = jugadores === "" || j.Jugadores.includes(jugadores);
        const matchTiempo = tiempo === "" || j.Tiempo === tiempo;
        const matchMecanica = mecanica === "" || j.Mecanica === mecanica;
        return matchNombre && matchTipo && matchJugadores && matchTiempo && matchMecanica;
      });

  if (orden === "nombre") {
    juegosFiltrados.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  } else if (orden === "duracion") {
    juegosFiltrados.sort((a, b) => (a.Duracion || 0) - (b.Duracion || 0));
  } else if (orden === "precio") {
    juegosFiltrados.sort((a, b) => (a.Precio || 0) - (b.Precio || 0));
  }

  mostrarJuegos(juegosFiltrados);
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
  <strong>${j.Nombre}</strong>
  ${imagen ? `<img src="${imagen}" alt="${j.Nombre}" class="miniatura">` : ''}
  <p class="descripcion">${j["Descripción"]}</p>
  <p><strong>Tipo:</strong> ${j.Tipo}</p>
  <p><strong>Mecánica:</strong> ${j["Mecánica principal"]}</p>
  <p><strong>Edad:</strong> ${j["Edad mínima"]}+</p>
  <p><strong>Duración:</strong> ${j["Duración mínima"]}-${j["Duración máxima"]} min</p>
  <p><strong>Jugadores:</strong> ${j["Jugadores mínimos"]}-${j["Jugadores máximos"]}</p>
  <p><strong>Editorial:</strong> ${j.Editorial}</p>
  <p><strong>Modalidad:</strong> ${j.Modalidad}</p>
  <p><strong>Clasificación:</strong> ${j["Clasificación"]}</p>
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