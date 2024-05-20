import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 导入自动导入插件，它可以在代码中自动导入所需的模块或组件，无需手动import
import AutoImport from 'unplugin-auto-import/vite'

// 导入Vue组件自动注册插件，它会自动注册项目中使用到的Vue组件
import Components from 'unplugin-vue-components/vite'

// 导入ElementPlusResolver，这是一个解析器，用于帮助上述插件识别和处理ElementPlus组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/  导出Vite配置对象
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  // 配置Vite插件
  plugins: [
    vue(),

    // 使用AutoImport插件，并为其配置ElementPlus的解析器
    // 这样，当你在Vue文件中使用ElementPlus的API时，它们会被自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 使用Components插件，并为其配置ElementPlus的解析器
    // 这样，当你在Vue文件中使用ElementPlus的组件时，它们会被自动注册，无需手动import和注册
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
  ],
})
