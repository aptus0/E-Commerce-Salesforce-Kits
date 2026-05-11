import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

app.listen(config.port, () => {
  console.log(`CommercePulse 360 API running on http://localhost:${config.port}`);
  console.log(`Data mode: ${config.useMockData ? 'mock' : 'salesforce'}`);
});
