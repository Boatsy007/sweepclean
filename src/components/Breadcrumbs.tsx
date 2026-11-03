import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-lilac">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-navy">{it.name}</span>
            ) : (
              <Link href={it.path} className="hover:text-violet hover:underline">{it.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
