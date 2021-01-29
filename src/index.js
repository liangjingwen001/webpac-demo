/**
 * index.js：webpack入口文件
 *
 * 运行指令：
 * 开发环境： webpack ./src/index.js -o ./build/built.js --mode=development（v4.0.0开始可以不用指定入口和出口文件）
 */

// 引入样式资源
import './css/index.css';
import './css/index.less';
import './css/iconfont.css';
// import sya, { run } from './js/print';

//  可以处理json合es6语法
import data from './utils/data.json';

const add = (x, y) => x + y;

// eslint-disable-next-line
console.log(add(11, 21));
// eslint-disable-next-line
console.log(data);

// if (module.hot) {
//   // 开启了HMR功能
//   module.hot.accept('./js/print.js', () => {
//     // print.js文件修改后的回调函数
//     sya();
//     run();
//   });
// }

// 通过require动态引入语法，能将某个文件单独打包（报错了）,自定义名称
// import(/*webpackChunkName: 'test'*/'./js/print')
// .then(({say}) => {
//   // eslint-disable-next-line
//   console.log(say(3, 4))
// })
// .catch(() => {
//   // eslint-disable-next-line
//   console.log('文件加载失败')
// })
