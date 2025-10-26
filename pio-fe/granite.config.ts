import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  scheme: 'intoss',
  appName: 'pio',
  plugins: [
    appsInToss({
      brand: {
        displayName: '피오', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
        primaryColor: '#53A485', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
        icon: 'https://hiqdelhkugdugbcvvxxb.supabase.co/storage/v1/object/public/public_bucket/app_logo.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
        bridgeColorMode: 'basic',
      },
      permissions: [
        {
          name: 'camera',
          access: 'access',
        },
        {
          name: 'photos',
          access: 'read',
        },
      ],
    }),
  ],
});
