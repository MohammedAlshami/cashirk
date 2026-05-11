import Link from "next/link";
import { DemoLogoBar } from "@/components/demo/DemoLogoBar";
import menuProducts from "@/lib/menu-products-local.json";

type MenuProduct = {
  title: string;
  description: string;
  price: string;
  calories: string;
  local_image: string;
};

const PAGE_BG = "#503728";
const AR_FONT = '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif';

function parsePrice(price: string) {
  const match = price.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function formatPrice(price: string) {
  const value = parsePrice(price);
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

const PRODUCTS = menuProducts as MenuProduct[];

export default function MenuPage() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="landing-page min-h-screen text-[#FFF7DD]"
      style={{ backgroundColor: PAGE_BG, fontFamily: AR_FONT }}
    >
      <DemoLogoBar
        centerAction={
          <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-[#FFF7DD]/80 uppercase">
            القائمة
          </div>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-4 sm:px-8">
        <section className="rounded-[2.25rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.32em] text-[#FFF7DD]/60 uppercase">
                menu
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                قائمة دار القهوة
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#FFF7DD]/72 sm:text-base">
                عرض محلي للقائمة يعتمد على الصور المخزنة داخل المشروع. نفس الجو البصري
                المستخدم في صفحة التجربة، لكن بصيغة كتالوج واضح وسريع التصفح.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-3xl border border-white/10 bg-black/12 px-4 py-4">
                <div className="text-2xl font-bold">{PRODUCTS.length}</div>
                <div className="mt-1 text-xs text-[#FFF7DD]/60">عنصر</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/12 px-4 py-4">
                <div className="text-2xl font-bold">محلي</div>
                <div className="mt-1 text-xs text-[#FFF7DD]/60">صور داخل public</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/12 px-4 py-4">
                <div className="text-2xl font-bold">AR</div>
                <div className="mt-1 text-xs text-[#FFF7DD]/60">واجهة عربية</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#FFF7DD]">المنتجات</h2>
            <Link
              href="/demo"
              className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-[#FFF7DD]/85 transition hover:bg-white/12"
            >
              تجربة الطلب
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {PRODUCTS.map((product, index) => (
              <article
                key={`${product.title}-${index}`}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/8 transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.local_image}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {formatPrice(product.price)} ر.س
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold leading-6 text-[#FFF7DD]">{product.title}</h3>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[#FFF7DD]/72">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-black/12 px-3 py-1 text-xs text-[#FFF7DD]/72">
                      {product.calories || "بدون سعرات مذكورة"}
                    </span>
                    <span className="text-sm font-semibold text-[#FFF7DD]">
                      {formatPrice(product.price)} ر.س
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
