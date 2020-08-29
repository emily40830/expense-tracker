# expense-tracker

A simple spending tracker  
Implement by Node.js, Express, handlebars, and mongodb  
Login Strategy provide by passport

See the project at [here](https://hidden-wave-12849.herokuapp.com/)

Test account:
| Email | Password |
| --- | --- |
| cookieqi@gidle.com | mynameissongyuqi |

## Dev progress

- UI modification
- Restructure data retrieving method in route by async/await
- Restructure functions in modules

## OverView

![](https://github.com/emily40830/expense-tracker/blob/master/public/img/cover.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/filter.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/create.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/edit.png)

## Feature

- (update on 8/29) Support mutiple filter by year-month and category
- (update on 8/29) Add login and register for user used
- Could find the totalAmount, order num, and percentage of all at the top
- Filter by each category then the data at top will automatically changed
- the Date limits to choose future date and the Amount limits to input negative when creating new spending or editing each

## ER model

![](https://github.com/emily40830/expense-tracker/blob/master/public/img/ER-model.png)

## How to install

1. clone to local machine

```
git clone https://github.com/emily40830/tasteBuds_express.git
```

2. access to project directory, install the packages list in package.json

```
npm install
```

3. Create .env based on .env.example, fill in SESSION_SECRET.Create develop facebook app,fill in FACEBOOK_ID and FACEBOOK_SECRET

4. Start the server by nodemon

```
npm run dev
```

5. you could see the message `Running on the localhost:3000` in terminal, start the browser and type `localhost:3000` in address area or click on [here](http://localhost:3000)

6. Start another server to initlize the default data info in mongodb

```
npm run seed
```

## 開發環境 Development environment

- bcryptjs: v2.4.3
- body-parser: v1.19.0
- connect-flash: v0.1.1,
- dotenv: v8.2.0,
- express: v4.17.1,
- express-handlebars: v5.1.0,
- express-session: v1.17.1,
- handlebars-helpers: v0.10.0,
- method-override: v3.0.0,
- mongoose: v5.10.0,
- passport: v0.4.1,
- passport-facebook: v3.0.0,
- passport-local: v1.0.0

## Author

Qi-Hua(Emily) Wang
