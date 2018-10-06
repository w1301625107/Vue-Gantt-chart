import moment from "moment";
import Mock from "mockjs";
var template = {
  'id': () => ('Plan ' + Mock.Random.natural(100, 999)),

  'name': () => (Mock.Random.word(4, 5)),
  'Planned': () => {
    let temp = [];
    let i = 0;
    let j = Mock.Random.natural(1, 2);

    while (i < j) {
      temp.push({
        'id': Mock.Random.natural(1000, 9999),
        'name': Mock.Random.word(2, 3),
        'start': moment().add(Mock.Random.natural(1, 9), 'h'),
        'end': moment().add(Mock.Random.natural(10, 15), 'h')
      })
      i++;
    }
    return temp;
  },
  'Projected': () => {
    let temp = [];
    let i = 0;
    let j = Mock.Random.natural(1, 1);

    while (i < j) {
      temp.push({
        'id': Mock.Random.natural(1000, 9999),
        'name': Mock.Random.word(2, 3),
        'start': moment().add(Mock.Random.natural(1, 7), 'h'),
        'end': moment().add(Mock.Random.natural(8, 15), 'h')
      })
      i++;
    }
    return temp;
  },

  'Actual': () => {
    let temp = [];
    if (Mock.Random.boolean()) {
      temp.push({
        'id': Mock.Random.natural(1000, 9999),
        'name': Mock.Random.word(2, 3),
        'start': moment().add(Mock.Random.natural(1, 7), 'h'),
        'end': moment().add(Mock.Random.natural(8, 15), 'h')
      });
    }
    return temp;
  }
}
let datas = [];
for (let i = 0,
    j = Mock.Random.natural(20, 20); i < j; i++) {
  datas.push(Mock.mock(template))
}



export {
  datas
}