module.exports = {
  getFormatDate: (date, format) => {
    const currentDate = new Date();
    const target = date === currentDate ? currentDate : date;

    let day = ('0' + target.getDate()).slice(-2);
    let month = ('0' + (target.getMonth() + 1)).slice(-2);
    let year = target.getFullYear();

    switch (format) {
      case 'y-m-d':
        return year + '-' + month + '-' + day;
      case 'y-m':
        return year + '-' + month;
    }
  },
  helpers: {
    equal: function (str1, str2) {
      return str1 === str2;
    },
    isExsit: function (str1) {
      return str1 != '';
    },
  },
};
