import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    useEffect(() => {
        const isHomepage = location.pathname === '/';
      
        requestAnimationFrame(() => {
          const productLink = document.querySelector('.navbar__item.navbar__link[href="/docs/category/product/"]') as HTMLElement | null;
          const techniekLink = document.querySelector('.navbar__item.navbar__link[href="/docs/category/techniek/"]') as HTMLElement | null;
      
          [productLink, techniekLink].forEach(link => {
            const item = link?.closest('.navbar__item') as HTMLElement | null;
            if (item) item.style.display = isHomepage ? '' : 'none';
          });
        });
      }, [location.pathname]);
      
    return <>{children}</>;
}

