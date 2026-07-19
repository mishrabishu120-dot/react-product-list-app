import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { formatPrice, badgeClass } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ProductActions from "@/components/products/ProductActions";
import ProductCard from "@/components/products/ProductCard";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li><span className="opacity-50">/</span></li>
          <li>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          </li>
          <li><span className="opacity-50">/</span></li>
          <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-muted/30 rounded-3xl overflow-hidden border border-border/50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            priority
          />
          {product.badge && (
            <div className="absolute top-4 left-4">
              <Badge className={badgeClass(product.badge)}>{product.badge}</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Link href={`/products?category=${product.category}`} className="text-sm font-bold uppercase tracking-wider text-primary mb-2 hover:underline w-fit">
            {product.category}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-amber-500">
              <span className="font-bold text-foreground mr-1">{product.rating}</span>
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">{i < Math.floor(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-muted-foreground text-sm hover:underline cursor-pointer">
              12 reviews
            </span>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              In Stock ({product.stock})
            </span>
          </div>
          
          <div className="text-4xl font-bold mb-8">{formatPrice(product.price)}</div>
          
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-border/50 mb-10" />

          {/* Interactive Actions (Client Component) */}
          <ProductActions product={product} />

          {/* Specs Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Specifications</h3>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}>
                        <th className="px-4 py-3 font-medium text-muted-foreground w-1/3 border-r border-border/50">{key}</th>
                        <td className="px-4 py-3 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 border-t border-border/50">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
