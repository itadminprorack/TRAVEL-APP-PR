import {esc} from './logic.js';
/** Locally bundled travel artwork; no external asset requests. */
const assetNames=new Set(['bus','van','car','train','flight','sea','planning','team','approval','empty-requests','success','location-pin','analytics','notifications']);
export const illustration = (name, className='', alt='') => `<img class="illustration ${esc(className)}" src="/src/assets/generated/${assetNames.has(name)?name:'empty-requests'}-v3.png" width="576" height="384" alt="${esc(alt)}" decoding="async" />`;
export const transportArt = (mode, className='') => illustration(mode, `transport-art ${className}`);
export const heroTravelArt = (variant='large') => variant==='login-art'
 ? `<img class="travel-art login-art" src="/src/assets/welcome-journey-v2.jpg" width="1536" height="1024" alt="" fetchpriority="high" />`
 : variant==='aside-art' ? illustration('planning','aside-art')
 : `<img class="travel-art ${variant}" src="/src/assets/campus-shuttle.jpg" width="1536" height="1024" alt="Miniature business campus with a blue and white employee shuttle, landscaped roads and orange pickup pins" decoding="async" />`;
export const routeSketch = () => `<img class="route-sketch" src="/src/assets/generated/route-planning-v3.jpg" width="1200" height="600" alt="Conceptual miniature campus showing pickup markers connected to a destination; not a real road map" decoding="async" />`;
