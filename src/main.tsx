import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; // StackBlitz has an issue with JIT CSS compilation, which is why we're using locally generated CSS instead. You can ignore that part — everything else in the setup has been tested locally and is working fine. For real projects, refer to `./index.css` instead.
import 'rsuite/dist/rsuite.min.css'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import $ from 'jquery';
import _ from 'lodash';
import noUiSlider from 'nouislider';
import 'datatables.net';
import 'dropzone/dist/dropzone-min.js';
import * as VanillaCalendarPro from 'vanilla-calendar-pro';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;
window.VanillaCalendarPro = VanillaCalendarPro;

import App from './App.tsx';
import { persistor, store } from './redux/app/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter basename="/">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            
           <App />
           {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
       </PersistGate>
      </Provider>
  </BrowserRouter>
  // </StrictMode >
);
