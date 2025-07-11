// src/lib/api.ts

import {
  Banner,
  Category,
  Product,
  StrapiBannerResponse,
  StrapiCategoryResponse,
  StrapiProductListResponse,
} from "@/lib/types";

// Definisikan base URL dari Strapi Anda
const STRAPI_URL = "https://strapi.fairuzulum.me";

// Fungsi untuk mengambil data banner
export async function getBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/hero-banner-kategoris?populate=*`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.statusText}`);
    }

    const json: StrapiBannerResponse = await response.json();

    const banners = json.data[0].images.map((image) => ({
      id: image.id,
      imageUrl: `${STRAPI_URL}${image.url}`,
    }));

    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

// Fungsi untuk mengambil data kategori
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/categories?populate=*`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const json: StrapiCategoryResponse = await response.json();

    const categories = json.data.map((category) => ({
      id: category.id,
      name: category.name,
      imageUrl: `${STRAPI_URL}${category.image.url}`,
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fungsi untuk mengambil produk berdasarkan nama kategori
export async function getProductsByCategory(
  categoryName: string
): Promise<Product[]> {
  try {
    const query = new URLSearchParams({
      populate: "*",
      "filters[categories][name][$eq]": categoryName,
    }).toString();

    const response = await fetch(`${STRAPI_URL}/api/products?${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const json: StrapiProductListResponse = await response.json();

    return json.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.deskripsi, // Menggunakan tipe yang sudah diperbarui
      images: product.images.map((img) => ({
        id: img.id,
        url: `${STRAPI_URL}${img.url}`,
      })),
      categories: product.categories,
    }));
  } catch (error) {
    console.error(
      `Error fetching products for category ${categoryName}:`,
      error
    );
    return [];
  }
}

// Fungsi untuk mengambil satu produk berdasarkan ID (versi final menggunakan filter)
export async function getProductById(
  id: string | number
): Promise<Product | null> {
  try {
    const query = new URLSearchParams({
      'filters[id][$eq]': String(id),
      'populate': '*',
    }).toString();

    const response = await fetch(
      `${STRAPI_URL}/api/products?${query}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const json: StrapiProductListResponse = await response.json();

    if (!json.data || json.data.length === 0) {
      return null;
    }

    const productData = json.data[0];

    // SOLUSI: Tidak perlu 'as any' lagi karena tipe sudah benar
    return {
      id: productData.id,
      name: productData.name,
      description: productData.deskripsi || null,
      images: productData.images.map((img) => ({
        id: img.id,
        url: `${STRAPI_URL}${img.url}`,
      })),
      categories: productData.categories,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}