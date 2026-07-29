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
      
    // Activate the OpenWoo design tokens from @conduction/theme: the generated
    // design-tokens.css scopes all variables under .openwoo-theme.
    // display: contents keeps this wrapper out of the layout flow.
    return (
      <div className="openwoo-theme" style={{ display: 'contents' }}>
        {children}
      </div>
    );
}

