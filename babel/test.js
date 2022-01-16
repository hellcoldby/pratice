
//测试1 箭头转义 @babel/preset-env
const t = str=> hello + str;

//测试2 类的静态属性转义 @babel/plugin-proposal-class-properties
class Bork {
  static a = "foo";
  static b;

  x = "bar";
  y;
}

//测试3 @babel/plugin-transform-runtime
const array = [1,2,3,4];

// 
array.includes(item => item > 2);