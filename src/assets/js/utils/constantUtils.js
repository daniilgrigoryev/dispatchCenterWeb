export const HTTP_URL='http://172.20.255.54:8888/alarmWS/sinc';
export const WS_URL='ws://172.20.255.54:8888/alarmWS/socket/alarm';
export const levelNames=[
  {
    label: 'Незаметный',
    value: 1
  },
  {
    label: 'Низкий',
    value: 2
  },
  {
    label: 'Нормальный',
    value: 3
  },
  {
    label: 'Высокий',
    value: 4
  },
  {
    label: 'Срочный',
    value: 5
  }
];
export const stateNames=[
  {
    label: 'Новая',
    value: 1
  },
  {
    label: 'В работе',
    value: 2
  },
  {
    label: 'Закрыта',
    value: 3
  }
];
export const sourceTypeNames=[
  {
    label: 'Монитор',
    value: 1
  },
  {
    label: 'Внешние событие',
    value: 2
  }
];

export const statusNames=[
  {
    label: 'Активен',
    value: 1
  },
  {
    label: 'Отключен',
    value: 2
  }
];
