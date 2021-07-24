
 import {
    isObject,
    isString,
    isArray,
    isNotEmptyObj,
    objForEach,
    aryForEach
  } from "./util";

//虚拟DOM
/**
 * 1. 用js 对象描述dom 树结构，然后生成dom插入文档
 * 2. 当状态改变后，js 重建dom结构 和 旧的作对比得出差异
 * 3. 针对差异之处重新构建视图
 * 
 * js 层面的比较速度远高于dom树
 */


//实现一个div 节点
/**
 * 
 *  <div className="num" index={1}>
 *      <span>123456</span>
 *  </div>
 */

 "use strict";
 React.createElement("div", {
   className: "num",
   index: 1
 }, React.createElement("span", null, "123456"));


 class Element {
    constructor(tagName, props, children) {
      // 解析参数
      this.tagName = tagName;
      // 字段处理,可省略参数
      this.props = isObject(props) ? props : {};
      this.children =
        children ||
        (!isNotEmptyObj(this.props) &&
          ((isString(props) && [props]) || (isArray(props) && props))) ||
        [];
      // 无论void后的表达式是什么，void操作符都会返回undefined
      this.key = props ? props.key : undefined;
  
      // 计算节点数
      let count = 0;
      aryForEach(this.children, (item, index) => {
        if (item instanceof Element) {
          count += item.count;
        } else {
          this.children[index] = "" + item;
        }
        count++;
      });
      this.count = count;
    }
  
    render() {
      // 根据tagName构建
      const dom = document.createElement(this.tagName);
  
      // 设置props
      objForEach(this.props, propName =>
        dom.setAttribute(propName, this.props[propName])
      );
  
      // 渲染children
      aryForEach(this.children, child => {
        const childDom =
          child instanceof Element
            ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
            : document.createTextNode(child); // 如果字符串，只构建文本节点
        dom.appendChild(childDom);
      });
      return dom;
    }
  }
  
  // 改变传参方式,免去手动实例化
  export default function CreateElement(tagName, props, children) {
    return new Element( tagName, props, children );
  }


  //新建示例
  // 1. 构建虚拟DOM
const tree = createElement("div", { id: "root" }, [
  createElement("h1", { style: "color: blue" }, ["Tittle1"]),
  createElement("p", ["Hello, virtual-dom"]),
  createElement("ul", [
    createElement("li", { key: 1 }, ["li1"]),
    createElement("li", { key: 2 }, ["li2"]),
    createElement("li", { key: 3 }, ["li3"]),
    createElement("li", { key: 4 }, ["li4"])
  ])
]);

// 2. 通过虚拟DOM构建真正的DOM
const root = tree.render();
document.body.appendChild(root);


//diff算法


// 3. 生成新的虚拟DOM 和 上一个虚拟dom 比较
const newTree = createElement("div", { id: "container" }, [
  createElement("h1", { style: "color: red" }, ["Title2"]),
  createElement("h3", ["Hello, virtual-dom"]),
  createElement("ul", [
    createElement("li", { key: 3 }, ["li3"]),
    createElement("li", { key: 1 }, ["li1"]),
    createElement("li", { key: 2 }, ["li2"]),
    createElement("li", { key: 5 }, ["li5"])
  ])
]);
//