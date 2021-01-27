/**
 * index.js：webpack入口文件
 *
 * 运行指令：
 * 开发环境： webpack ./src/index.js -o ./build/built.js --mode=development（v4.0.0开始可以不用指定入口和出口文件）
 */

// 引入样式资源
import './css/index.css';
import './css/index.less';
// import './css/iconfont.css'

//  可以处理json合es6语法
import data from './utils/data.json';

function add(x, y) {
  return x + y;
}

// eslint-disable-next-line
console.log(add(1, 2));
// eslint-disable-next-line
console.log(data);
