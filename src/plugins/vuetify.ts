import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as labsComponents from 'vuetify/labs/components';

export default createVuetify({
  components: {
    ...labsComponents
  },
  defaults: {
    global: {
      elevation: 0,
      ripple: false,
    },
    VBtn: {
      color: 'primary',
    },
  },
  display: {
    thresholds: {
      lg: 1420
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#3277ff',
          secondary: '#666',
          success: '#00c572',
          error: '#ff636e',
          warning: '#ffbc11',
        }
      }
    }
  }
});
