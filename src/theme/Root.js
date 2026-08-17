import React from 'react';

/**
 * Activate the NLDS theme tokens site-wide.
 *
 * - `openwoo-theme` is the ACTIVE theme's scope class: the generated
 *   design-tokens.css from @conduction/theme scopes all its variables
 *   under it. Swap this class when the site switches to another NLDS
 *   theme (see src/css/nlds-bridge.css for the full swap procedure).
 * - `nlds-site` is the theme-NEUTRAL scope that all site CSS hangs off
 *   (the --site-* aliases and --ifm-* mappings in nlds-bridge.css).
 *   Never changes.
 *
 * display: contents keeps this wrapper out of the layout flow.
 */
export default function Root({children}) {
  return (
    <div className="openwoo-theme nlds-site" style={{display: 'contents'}}>
      {children}
    </div>
  );
}
