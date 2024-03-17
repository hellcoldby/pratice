// 控制并发数量为3

class Queue {
  constructor(num) {
    this.taskList = [];
    this.counter = 0; // 计数器
    this.frequency = num || 1; // 频率
  }
  add(task) {
    this.taskList.push(task);
    this.run();
  }
  run() {
    if (this.taskList.length === 0 || this.counter === this.frequency) return;
    const fn = this.taskList.shift();
    this.counter++;
    fn()
      .then((res) => {
        this.counter--;
        this.run();
      })
      .catch((err) => {
        this.counter--;
        this.run();
      });
  }
}
