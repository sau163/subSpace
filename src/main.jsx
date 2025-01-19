// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { NhostClient, NhostProvider } from '@nhost/react';
// import App from './App';
// import './index.css';

// export const nhost = new NhostClient({
//   subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
//   region: import.meta.env.VITE_NHOST_REGION,
  
// });

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
    
//       <NhostProvider nhost={nhost}>
//         <App />
//       </NhostProvider>
    
//   </React.StrictMode>
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostClient, NhostProvider } from '@nhost/react';
import App from './App';
import './index.css';

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <App />
    </NhostProvider>
  </React.StrictMode>
);
