async function cargarDatos() {
  const response = await fetch("gpcinos_data.json");
  const data = await response.json();

  const tbody = document.querySelector("#tabla tbody");
  console.log(data)

  data.forEach(persona => {
    // obtener todas las claves
    const keys = Object.keys(persona);
    // tomar desde la columna 5 en adelante
    const puntajes = keys
    .slice(4)
    .map(k => Number(persona[k]) || 0);
    //orden desc
    puntajes.sort((a, b) => b - a);
    // sumar top 5
    const top5 = puntajes
    .slice(0, 5)
    .reduce((a, b) => a + b, 0);
    persona.puntaje = top5
  });

  data.sort((a, b) => b.puntaje - a.puntaje);

  data.forEach((persona, index) => {
   persona.ranking = index + 1;
  });

  const mejorJunior = Math.min(
  ...data
    .filter(p => p["Grupo"] === "Junior")
    .map(p => p.ranking)
  );
  const mejorSenior = Math.min(
  ...data
    .filter(p => p["Grupo"] === "Senior")
    .map(p => p.ranking)
  );

  const mejorBeginner = Math.min(
  ...data
    .filter(p => p["Grupo"] === "Beginner")
    .map(p => p.ranking)
  );

  data.forEach(persona => {
    const tr = document.createElement("tr");
    if (persona["Grupo"] === "Junior" && persona.ranking === mejorJunior) { 
        tr.classList.add("polera");}
    
    if (persona["Grupo"] === "Senior" && persona.ranking === mejorSenior) { 
        tr.classList.add("polera");}
    
    if (persona["Grupo"] === "Beginner" && persona.ranking === mejorBeginner) { 
        tr.classList.add("polera");}
    
    tr.innerHTML = `
      <td class="rank">${persona["ranking"]}</td>
      <td>${persona["Nombres y Apellidos"]}</td>
      <td>${persona["Handle CF"]}</td>
      <td>${persona["Grupo"]}</td>
      <td>${persona["puntaje"]}</td>
      <td>${persona["CF 6 May"]}</td>
      <td>${persona["CF 18 May"]}</td>
      <td>${persona["CF 21 May"]}</td>
    `;
    tbody.appendChild(tr);
  });

  $('#tabla').DataTable({
    order: [[4, 'desc']],
    pageLength: 10,
    lengthChange: false,
    responsive: true,
    info: false,
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      paginate: {
        next: "Siguiente",
        previous: "Anterior"
      },
      zeroRecords: "No se encontraron resultados"
    }
  });
}

cargarDatos();