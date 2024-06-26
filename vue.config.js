"use strict";

const path = require("path");
const IS_PROD = process.env.NODE_ENV === "production";

function resolve(dir) {
  return path.join(__dirname, dir);
}

/*
console.log('npm config: ', npmConfigArgv)
const procArgv = process.argv
console.log('npm config: ', procArgv)
*/
let buildProdFlag = process.argv[2] === "build";

const mvdir = require("mvdir");
const e = require("express");
if (IS_PROD && buildProdFlag) {
  mvdir("index_template/index_prod.html", "public/index.html", { copy: true });
} else {
  mvdir("index_template/index_dev.html", "public/index.html", { copy: true });
}

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: "./",
  assetsDir: "./",

  /* 开启vue运行时模板编译功能！！ */
  runtimeCompiler: true,

  lintOnSave: false,

  productionSourceMap: false,

  /* 指定node_modules目录中需要做babel转译的依赖库 */
  transpileDependencies: ["element-ui", "vuedraggable"],

  css: {
    extract: true,
    loaderOptions: {
      scss: {
        /* 自动引入全局scss文件 */
        prependData: `
          @import "./src/styles/global.scss";
        `,
      },
    },
  },

  configureWebpack: (config) => {
    config.devtool = "source-map";
    config.output.libraryExport =
      "default"; /* 解决import UMD打包文件时, 组件install方法执行报错的问题！！ */
    if (buildProdFlag) {
      config.externals = ["vue", "element-ui"];
    }
    //'quill': 'Quill',

    console.log("config: ", config.externals);
  },

  chainWebpack: (config) => {
    /* 配置svg图标自动加载 begin */
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    /* 配置svg图标自动加载 end */
  },
};
