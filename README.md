# expense-tracker

A simple spending tracker  
Implement by Node.js, Express, handlebars, and mongodb  

## OverView
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/cover.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/filter.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/create.png)
![](https://github.com/emily40830/expense-tracker/blob/master/public/img/edit.png)

## Feature
- Could find the totalAmount, order num, and percentage of all at the top
- Filter by each category then the data at top will automatically changed
- the Date limits to choose future date and the Amount limits to input negative when creating new spending or editing each  
- Revenue analysis chart(in progress)

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
3. Start the server by nodemon
```
npm run dev
```
4. you could see the message `Running on the localhost:3000` in terminal, start the browser and type `localhost:3000` in address area or click on [here](http://localhost:3000)

5. Start another server to initlize the default data info in mongodb
```
npm run seed
```


## 開發環境 Development environment
- Node.js: v10.16.0
- Express: v4.17.1
- Express-Handlebars: v4.0.4
- body-parser: v1.19.0
- Mongoose: v5.9.15
- method-override: v3.0.0
- handlebars-helpers: v0.10.0

## Author
Qi-Hua(Emily) Wang