require('dotenv').config();
const db = require('../../config/mongoose');
const Record = require('../record');
const User = require('../user');
const bcrypt = require('bcryptjs');

const userdata = {
  name: 'Yuqi',
  email: 'cookieqi@gidle.com',
  password: 'mynameissongyuqi',
};

const userCreate = new Promise((resolve, reject) => {
  const { name, email, password } = userdata;
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      return resolve(user._id);
    });
});

const recordsCreate = (userId) => {
  return new Promise((resolve, reject) => {
    Record.create(
      {
        name: '早午餐',
        category_id: 1040,
        date: new Date('2020-04-29'),
        amount: 200,
        user_id: userId,
      },
      {
        name: '晚餐',
        category_id: 1040,
        date: new Date('2020-05-06'),
        amount: 120,
        user_id: userId,
      },
      {
        name: '捷運月票',
        category_id: 1020,
        date: new Date('2020-05-03'),
        amount: 1280,
        user_id: userId,
      },
      {
        name: 'YoutubeMusic',
        category_id: 1030,
        date: new Date('2020-05-10'),
        amount: 199,
        user_id: userId,
      },
      {
        name: '母親節禮物',
        category_id: 1010,
        date: new Date('2020-05-08'),
        amount: 3000,
        user_id: userId,
      },
    )
      .then(() => {
        return resolve('records create done!');
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

db.once('open', async () => {
  console.log('db connected to build record.');

  try {
    let userId = await userCreate;
    let recordResult = await recordsCreate(userId);
    console.log(recordResult);
  } catch (err) {
    console.warn(err);
  }

  console.log('records init done.');

  db.close();
});
