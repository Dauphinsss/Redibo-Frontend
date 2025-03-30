export default async function Producto({ params }: { params: { id: string } }) {
  const { id } = await params;
  const productosMock = [
    { id: "1", nombre: "Producto A", precio: 100, descripcion: "Descripción del Producto A" },
    { id: "2", nombre: "Producto B", precio: 200, descripcion: "Descripción del Producto B" },
    { id: "3", nombre: "Producto C", precio: 300, descripcion: "Descripción del Producto C" },
    { id: "4", nombre: "Producto D", precio: 400, descripcion: "Descripción del Producto D" },
    { id: "5", nombre: "Producto E", precio: 500, descripcion: "Descripción del Producto E" },
  ];
  return (
    <div>
      <h1>Producto ID: {id}</h1>
      <p>Detalles del producto {id}</p>
      {productosMock
        .filter((producto) => producto.id === params.id)
        .map((producto) => (
          <div key={producto.id}>
        <h2>{producto.nombre}</h2>
        <p>Precio: ${producto.precio}</p>
        <p>{producto.descripcion}</p>
          </div>
        ))}
    </div>
  );
}
