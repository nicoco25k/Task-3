$(document).ready(function () {
  const tabla = $('#tablax').DataTable({
    
    responsive: true,
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ registros",
      info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
      paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último"
      },
      zeroRecords: "No se encontraron coincidencias",
      emptyTable: "No hay datos disponibles"
    }
  });

  // Obtener usuarios desde API
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => {
      data.forEach(usuario => {
        const fila = `
          <tr class="text-center">
            <td>${usuario.name}</td>
            <td>${usuario.email}</td>
            <td>${usuario.phone}</td>
            <td>
              <a href="#" class="enlace-web" data-url="http://${usuario.website}">${usuario.website}</a>
            </td>
            <td>${usuario.company.name}</td>
            <td>${usuario.address.city}</td>
            <td class="text-center">
              <button class="btn btn-info btn-sm ver-mas" data-id="${usuario.id}">Ver más</button>
            </td>
          </tr>
        `;
        tabla.row.add($(fila)).draw();
      });

      // Confirmar antes de salir del sitio web
      $('#tablax tbody').on('click', '.enlace-web', function (e) {
        e.preventDefault();
        const url = $(this).data('url');
        Swal.fire({
          title: '¿Deseas salir del sitio?',
          text: "Serás redirigido a: " + url,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(url, '_blank');
          }
        });
      });

      // Mostrar detalles completos
      $('#tablax tbody').on('click', '.ver-mas', function () {
        const id = $(this).data('id');
        const usuario = data.find(u => u.id === id);
        Swal.fire({
          title: usuario.name,
          html: `
            <strong>Username:</strong> ${usuario.username}<br>
            <strong>Email:</strong> ${usuario.email}<br>
            <strong>Teléfono:</strong> ${usuario.phone}<br>
            <strong>Sitio Web:</strong> <a href="http://${usuario.website}" target="_blank">${usuario.website}</a><br>
            <hr>
            <strong>Dirección:</strong><br>
            ${usuario.address.street}, ${usuario.address.suite},<br>
            ${usuario.address.city}, ${usuario.address.zipcode}<br>
            <strong>Ubicación:</strong><br> Lat: ${usuario.address.geo.lat}, Lng: ${usuario.address.geo.lng}<br>
            <hr>
            <strong>Empresa:</strong><br>
            ${usuario.company.name}<br>
            <em>${usuario.company.catchPhrase}</em><br>
            <small>${usuario.company.bs}</small>
          `,
          icon: 'info',
          width: 600,
          confirmButtonText: 'Cerrar',
          showCloseButton: true,
        });
      });
    })
    .catch(error => {
      console.error("Error al obtener usuarios:", error);
      $('#tabla-usuarios').html('<tr><td colspan="7">No se pudieron cargar los datos.</td></tr>');
    });
});


