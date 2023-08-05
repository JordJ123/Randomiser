import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'bootstrap/dist/js/bootstrap.min.js';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
