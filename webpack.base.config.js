/*
    loader: 1.下载 2.使用
    plugins: 1.下载 2.引入 3.使用
    打包指令： webpack
    开发指令： npx webpack-dev-server
*/

// resolve是nodejs里面拼接绝对路径的方法
const {resolve} = require('path')
// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodeJS环境变量
// process.env.NODE_ENV = 'development';

// webpack配置文件
module.exports = {
    // 入口起点
    entry: './src/index.js',
    // 输出
    output: {
        // 输出文件名
        filename: 'js/build.js',
        // 输出路径，__dirname当前文件的绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader的配置
    module: {
        rules: [
            // {
            //     // 语法检查，只检查自己写的代码，不检查第三方库 eslint-loader eslint
            //     // 设置检查规则: package.json中eslintConfig中设置
            //     // airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
            //     // 在代码上加“// eslint-disable-next-line”就会俘虏额下一行代码的格式检查
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         // 自动修复
            //         fix: true
            //     }
            // },
            /**
             * js兼容性处理，
             * 1.基本js兼容性处理：babel-loader @babel/preset-env @babel/core,不能处理promise等
             * 2.全部兼容性处理：@babel/polyfill，只需要在js引入即可，缺点的文件包大大增大（import '@babel/polyfill'）
             * 3.部分兼容性处理：core-js
             * 结论：使用1，3种加起来即可。
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                        {
                            // 按需加载
                            useBuiltIns: 'usage',
                            // 指定core-js版本
                            corejs: {
                                version: 3
                            },
                            // 指定浏览器版本
                            targets: {
                                chrome: '60',
                                firefox: '90',
                                ie: '9',
                                safari: '10',
                                edge: '17'
                            }
                        }
                        ]
                    ]
                }
            },
            {
                // 样式会被打包到js文件中
                test: /\.css$/,
                use: [
                    //use中的执行顺序：从右到左，从下到上
                    // 创建style标签，将js中的样式资源进行插入，添加到head
                    // 'style-loader',
                    //这个loader取代style-loader。作用：提取js中的css成单独文件（字体图标css打包错误）
                    MiniCssExtractPlugin.loader,
                    //将css文件变成commonJS模块加载到js中，里面的内容是样式字符串
                    'css-loader',
                    /*
                        css兼容处理：postcss --> postcss-loader postcss-preset-env
                        postcss-preset-env的作用是帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
                        默认是生产环境，与mode没有关系，需要修改process.env.NODE_ENV的值来改变环境
                     */ 
                    {
                        loader: 'postcss-loader',  // 等价直接写'postcss-loader'
                        ident: 'postcss',
                        options: {
                            postcssOptions: {
                                plugins: () => [require('postcss-preset-env')()]
                            }
                        }
                    }
                ]
            },
            {
                // 样式会被打包到js文件中
                test: /\.less$/,
                // 使用多个loader
                use: [
                    'style-loader',
                    'css-loader',
                    //将less编译成css文件
                    //需要下载less和less-loader
                    'less-loader'
                ]
            },
            {
                // 处理背景图片，处理不了img标签引入的图片
                test: /\.(jpg|png|gif|jpeg)$/,
                // 需要使用url-loader file-loader（两者功能相似，url-loader有转成base64功能）
                // 使用一个loader
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb,会被转成base64
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度会更慢，所以一般只对小图片进行处理8~12kb）
                    limit: 30 * 1024,
                    // 关闭url-loader的es6模块化，使用commonJS解析
                    esModule: false,
                    // 取土图片hash值的前10位,[ext]取文件原来的扩展名
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                //注意：webpack会自动引入打包生成的文件，不要手动引入，不然会报错
                test: /\.(html)$/,
                // 处理html文件里面img标签引入的图片
                loader: 'html-loader'
            },
            {
                // 前面所有的类型都需要排除
                exclude: /\.(css|js|html|jpg|png|gif|jpeg|less|json)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    // 插件配置
    plugins: [
        // 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（JS/CSS）
        new HtmlWebpackPlugin({
            //复制./src/index.html文件，自动引入打包输出的所有资源（JS/CSS）
            template: './src/index.html',
            // 压缩html代码
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名和路径指定
            filename: 'css/build.css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    // 模式，development和production(生产环境会自动压缩js代码)
    mode: 'development',

    // 开发服务器devServer: 用来自动化（自动编辑，自动打开浏览器，自动刷新浏览器）
    // 只会在内存中打包，不会有任何输出，会监听src下面的代码
    // 启动指令：npx webpack-dev-server
    // 会有兼容问题："webpack-dev-server": "^3.11.0"和"webpack-cli": "^3.3.12"相互兼容
    devServer: {
        // 项目构建后的路径
        contentBase: resolve(__dirname, 'build'),
        // 开启gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}
