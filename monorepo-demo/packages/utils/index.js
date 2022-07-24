import dayjs from 'dayjs'
export function format(time, f = 'YYYY-MM-DD') {
  return dayjs(time).format(f)
}

export class A{
  constructor(){
    this.a = 'hello'
  }
  say(){
    console.log(this.a);
  }
}