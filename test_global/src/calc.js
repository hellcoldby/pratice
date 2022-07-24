#!/usr/bin/env node

if (process.argv.length <= 2) {
    console.log("请输入运算的数字");
    return;
  }
  
  let total = process.argv
    .slice(2)
    .map((el) => {
      let parseEl = parseFloat(el);
      return !isNaN(parseEl) ? parseEl : 0;
    })
    .reduce((total, num) => {
      total += num;
      return total;
    }, 0);
  
  console.log(`运算结果：${total}`);