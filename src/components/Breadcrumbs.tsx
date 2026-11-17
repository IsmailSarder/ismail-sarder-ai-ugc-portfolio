import React from 'react';
import { ChevronRight } from 'lucide-react';
import { navigateToPath } from '../lib/seo.ts';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateToPath(path);
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#A0A89F]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#2A332B]" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="text-[#C7F36B] font-semibold">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => handleClick(e, item.path)}
                  className="hover:text-[#F5F5F0] transition-colors underline-offset-4 hover:underline"
                >
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
