// src/app/products/[slug]/page.tsx

import { getProductsByCategory } from "@/lib/api";
import ProductList from "@/components/ProductList";

// Helper function untuk mengubah 'slug-url' menjadi 'Title Case'
function formatCategoryName(slug: string): string {
  return slug.replace(/-/g, ' ').toUpperCase();
}

export default async function ProductListPage({ params }: { params: { slug: string } }) {
  // Await params untuk best practice di Next.js 15
  const { slug } = await params;

  const categoryName = formatCategoryName(slug);
  
  // Ambil semua produk untuk kategori ini di server
  const allProducts = await getProductsByCategory(categoryName);

  // Render komponen client dan berikan data awal.
  // Semua logika untuk menampilkan header, grid, dan filter pencarian
  // sekarang ditangani di dalam komponen ProductList.
  return (
    <ProductList initialProducts={allProducts} categoryName={categoryName} />
  );
}