type product={
    id:string;
    name:string;
    price:number;
    stock:number;
    category:string;
};
export default function ProductTable({products}:{products:product[]}) 
{
    return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Stock</th>
            <th className="p-3 border">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">₹{p.price}</td>
              <td className="p-3 border">{p.stock}</td>
              <td className="p-3 border">{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}