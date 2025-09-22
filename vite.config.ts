import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import federation from '@originjs/vite-plugin-federation';
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  return {
    server: {
      port: 32000,
      host: true,
      proxy: {
        // /api 라는 문자열이 target 에 지정한 문자열 https://api.allsilver.com/ 로 변환되어 사용된다.
        // 예를 들어 요청 도메인이 http://localhost:5173/api/hello 라면 프록시에 의하여
        // https://api.allsilver.com/hello로 요청이 되는 것이다.
        '^/krakend': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:9092', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
          rewrite: (path) => path.replace(/^\/krakend/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        },
        '^/countries': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:9091', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        },
        '^/timezone': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:9091', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        },
        '^/api/v1/ws': {
          target: 'http://192.100.0.10:9000', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true,
          ws: true
        },
        '^/svc-seer': {
          target: 'http://192.100.0.10:32055', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true
        },
        '^/voyageMedia': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:32010', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
          // rewrite: (path) => path.replace(/^\/api/, '/svcfw/api') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        },
        '^/geotarget': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:7080', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
          rewrite: (path) => path.replace(/^\/geotarget/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        },
        // '^/VITE_VOYAGE_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32010', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_VOYAGE_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_SECURITY_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32020', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_SECURITY_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_SPMS_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32030', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_SPMS_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_EQUIPMENT_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32040', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_EQUIPMENT_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_EMISSION_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32050', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_EMISSION_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_CREW_SUPPORT_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32070', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_CREW_SUPPORT_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        // '^/VITE_SAFETY_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32090', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_SAFETY_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // },
        '^/VITE_SETTING_TARGET': {
          // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
          target: 'http://192.100.0.10:32100', // 사용할 요청 도메인을 설정한다.
          changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
          rewrite: (path) => path.replace(/^\/VITE_SETTING_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        },
        // '^/VITE_FLEET_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.168.90.106:32110', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   rewrite: (path) => path.replace(/^\/VITE_FLEET_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // }
        // '^/VITE_LESSON_TARGET': {
        //   // 프록시가 적용될 요청 경로의 시작 부분. 클라이언트가 보낸 요청의 URL이 api로 시작되면 이 설정이 적용된다.
        //   target: 'http://192.100.0.10:4600/api', // 사용할 요청 도메인을 설정한다.
        //   changeOrigin: true // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
        //   // rewrite: (path) => path.replace(/^\/VITE_SETTING_TARGET/, '') // 프록시 요청의 경로를 재작성하는 함수를 설정한다.
        // }
        '/rims-api': {
          target: 'http://192.100.0.10:14500',
          changeOrigin: true
        },
        '/api': {
          target: 'http://192.100.0.10:14600',
          changeOrigin: true
        },
        '/kdt-api': {
          target: 'http://192.100.0.10:14700',
          changeOrigin: true
        },
        '/unity': {
          target: 'http://192.100.0.10:14700',
          changeOrigin: true
        },
        '/dbdata': {
          target: 'http://192.100.0.10:14800',
          changeOrigin: true
        },
        '/analysis-api': {
          target: 'http://192.100.0.10:14800',
          changeOrigin: true
        },
        '/synth-data': {
          target: 'http://192.100.0.10:14800',
          changeOrigin: true
        },
        '/mrc-api': {
          target: 'http://192.100.0.10:14900',
          changeOrigin: true
        },
        '/mrc-api-amsvdr': {
          target: 'http://192.100.0.10:9092',
          changeOrigin: true
        },
        '/mrc-api-shipinfo': {
          target: 'http://192.100.0.10:32005',
          changeOrigin: true
        }
      }
    },
    plugins: [
      vue({
        template: {
          transformAssetUrls
        }
      }),
      VueDevTools(),
      Vuetify(),
      federation({
        name: 'svc-portal',
        filename: 'remoteEntry.js',
        exposes: {
          './Axios': './src/axios.ts',
          './SideNaviLayout': './src/components/layout/SideNaviLayout.vue',
          './SideMenuItem': './src/components/layout/SideMenuItem.vue'
        },
        remotes: {
          // 'svc-voyage': `/VITE_VOYAGE_TARGET/assets/remoteEntry.js`,
          // 'svc-securitymanager': `/VITE_SECURITY_TARGET/assets/remoteEntry.js`,
          // 'svc-spms': `/VITE_SPMS_TARGET/assets/remoteEntry.js`,
          // 'svc-equip-system': `/VITE_EQUIPMENT_TARGET/assets/remoteEntry.js`,
          // 'svc-emission': `/VITE_EMISSION_TARGET/assets/remoteEntry.js`,
          // 'svc-crew-support': `/VITE_CREW_SUPPORT_TARGET/assets/remoteEntry.js`,
          // 'svc-safety': `/VITE_SAFETY_TARGET/assets/remoteEntry.js`,
          // 'svc-fleet': `/VITE_FLEET_TARGET/assets/remoteEntry.js`,
          'svc-setting': `/VITE_SETTING_TARGET/assets/remoteEntry.js`,
          'svc-lesson': `http://192.100.0.10:14500/assets/remoteEntry.js`,
          'svc-xinnos': `http://192.100.0.10:14600/assets/remoteEntry.js`,
          'svc-kdt': `http://192.100.0.10:14700/assets/remoteEntry.js`,
          'svc-vegas': `http://192.100.0.10:14800/assets/remoteEntry.js`,
          'svc-mrc': `http://192.100.0.10:14900/assets/remoteEntry.js`
        },
        shared: ['vue', 'pinia', 'vue-router', 'dayjs', 'axios', 'vue3-apexcharts']
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@img': fileURLToPath(new URL('./src/assets/img', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: '@use "@/assets/css/mixin.scss" as *; @import "@svcfw/components/dist/style.css";'
        }
      }
    },
    build: {
      outDir: './deploy/dist',
      minify: false,
      target: ['chrome89', 'edge89', 'firefox89', 'safari15'],
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]/[name].js',
          chunkFileNames: 'js/[name]/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split(',');
            const extType = info?.[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|webm|mp3)$/.test(assetInfo.name || '')) {
              return `media/[name]-[hash].${extType}`;
            }
            if (/\.(css)$/.test(assetInfo.name || '')) {
              return `css/[name]-[hash].${extType}`;
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name || '')) {
              return `fonts/[name]-[hash].${extType}`;
            }
            return `[name]-[hash].${extType}`;
          },
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  };
});
