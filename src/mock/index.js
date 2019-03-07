import moment from "moment";
import Mock from "mockjs";
var template = {
  'id': () => 'Plan ' + Mock.Random.natural(1000, 9999),

  'name': () => (Mock.Random.word(4, 5)),
  'gtArray': () => {
    let temp = [];
    let i = 0;
    let j = Mock.Random.natural(9, 9);
    let tempStart = moment();
    let tempEnd = moment();

    while (i < j) {
      tempStart = tempEnd.clone().add(Mock.Random.natural(1, 5), 'h');
      tempEnd =  tempStart.clone().add(Mock.Random.natural(1, 5), 'h');
      temp.push({
        'id': Mock.Random.natural(1000, 9999),
        'name': Mock.Random.word(2, 3),
        'start':tempStart.format('YYYY-MM-DD HH:mm:ss'),
        'end': tempEnd.format('YYYY-MM-DD HH:mm:ss')
      })
      
      i++;
    }
    return temp;
  },
  
}

function mockDatas(nums) {
  let datas = [];
  for (let i = 0,
      j = Mock.Random.natural(nums, nums); i < j; i++) {
    datas.push(Mock.mock(template))
  }
  return datas
}

export {
  mockDatas
}