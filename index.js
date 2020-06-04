/* eslint no-console: off */

const REGEX = {
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, // eslint-disable-line
};

class ZT {
  /**
   * Tries to determine the type of a value. Use with extreme caution
   * @param {*} val
   * @returns {string}
   */
  static getType(val) {
    try {
      return val.constructor.name;
    } catch (err) {
      return val === null ? val : typeof val;
    }
  }

  /**
   * @param {Object} number of arguments
   * @param {Object} arg
   */
  static checkForNumberOfArguments(number, arg) {
    if (arg.length < number) {
      throw new TypeError(`Failed. ${number}  arguments required, but only ${arg.length} present.`);
    }
  }

  /**
   * Convert ms to Days:Hours:Minutes:Seconds
   * @param {Number} ms
   * @returns {{text: string}|{text: string, days: number, hours: number,
   * minutes: number, totalMinutes: number, seconds: number}}
   */
  static msToReadableTime(ms) {
    if (ms < 0) {
      return { text: 'Negatives are not supported' };
    }

    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hrs = Math.floor(min / 60);

    const seconds = sec % 60;
    const minutes = min % 60;
    const hours = hrs % 24;
    const days = Math.floor(hrs / 24);

    const hoursTxt = `${ZT.addZeroToNum(hours)}`;
    const minutesTxt = `${ZT.addZeroToNum(minutes)}`;
    const secondsTxt = `${ZT.addZeroToNum(seconds)}`;
    const text = `${days} days, ${hoursTxt}:${minutesTxt}:${secondsTxt}`;

    return {
      seconds, minutes, hours, days, text, totalMinutes: min,
    };
  }

  /**
   * @param {Number} num
   * @returns {String|Number}
   */
  static addZeroToNum(num = 0) {
    const number = Number(num);
    const is = ZT.isNumber(num) && number < 10;
    return `${is ? 0 : ''}${number}`;
  }

  /**
   * Capitalize or de-capitalize a string
   * ToDo: this should be added to String.prototype
   * @param {String} string
   * @param {Boolean} [toUp]
   * @returns {String}
   */
  static capitalize(string = '', toUp = true) {
    return string.charAt(0)[toUp ? 'toUpperCase' : 'toLowerCase']() + string.slice(1);
  }

  /**
   * Checking for the existing of things. NOTE: null is considered non-existing by this method
   * @param val
   * @returns {boolean}
   */
  static is(val) {
    return val !== undefined && val !== null;
  }

  /**
   * Check for matching constructors, yeah...
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  static isSameType(a, b) {
    const exist = ZT.is(a) && ZT.is(b);

    return exist
      ? a.constructor.name === b.constructor.name
      : a === b;
  }

  /**
   * @param {*} val
   * @returns {boolean}
   */
  static isFunction(val) {
    return typeof val === 'function';
  }

  /**
   * @param {*} val
   * @param {Boolean} [checkEmpty] - optional check whether the object has any values
   * @returns {Boolean}
   */
  static isObject(val, checkEmpty) {
    try {
      const isOb = typeof val === 'object' && !Array.isArray(val) && val !== null;
      return checkEmpty === true
        ? isOb && !!Object.keys(val).length
        : isOb;
    } catch (err) {
      return false;
    }
  }

  /**
   * @param {*} val
   * @param {Boolean} [checkEmpty] - optional check whether the supposed array is empty
   * @returns {Boolean}
   */
  static isArray(val, checkEmpty) {
    const isArr = Array.isArray(val);
    return checkEmpty === true
      ? isArr && !!val.length
      : isArr;
  }

  /**
   * Checking if something is an Element / DOM node
   * @param {*} val
   * @returns {boolean}
   */
  static isElement(val) {
    return val instanceof Element;
  }

  /**
   * @param {String} str
   * @param {Boolean} [checkEmpty] - optional
   * @returns {boolean}
   */
  static isString(str, checkEmpty = false) {
    const isString = typeof str === 'string';
    return !checkEmpty ? isString : isString && !!str.length;
  }

  /**
   * @param {String} str
   * @returns {boolean}
   */
  static isURL(url) {
    return REGEX.url.test(url);
  }

  static addLinksToText(text) {
    return text.split(/([ |\n])/).map((str) => (
      ZT.isURL(ZT.sanitizeUserInput(str, true))
        ? `<a href='${str}' target='_blank'>${str}</a>`
        : str
    )).join('');
  }

  /**
   * @param {*} val
   * @param {String} [name]
   */
  static throwNotFn(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    throw new TypeError(`Param ${middle}  is not a function`);
  }

  /**
   * @param {Number} num
   * @returns {boolean}
   */
  static isNumber(num) {
    return typeof num === 'number' && isFinite(num); // eslint-disable-line
  }

  /**
   * @param {Number} val
   * @param {String} [name]
   */
  static throwNotNumber(val, name) {
    if (ZT.isString(name, true)) {
      throw new TypeError(ZT.textNotNumber(val, name));
    } else {
      throw new TypeError(`Param ${ZT.getType(val)}  is not a number`);
    }
  }

  /**
   * @param {*} val
   * @param {String} [name]
   */
  static textNotNumber(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle}  is not a number`;
  }

  /**
   * @param {boolean} val
   * @returns {boolean}
   */
  static isBoolean(val) {
    return typeof val === 'boolean';
  }

  /**
   * @param {String} val
   * @param {String} [name]
   */
  static throwNotString(val, name) {
    throw new TypeError(ZT.textNotString(val, name));
  }

  /**
   * @param {String} val
   * @param {String} [name] - optional parameter for more clarity
   * @returns {string}
   */
  static textNotString(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle}  is not a string or is empty`;
  }

  /**
   * @param {Object} val
   * @param {String} [name]
   */
  static throwNotObject(val, name) {
    throw new TypeError(ZT.textNotObject(val, name));
  }

  /**
   * @param {Object} val
   * @param {String} [name] - optional parameter for more clarity
   * @returns {string}
   */
  static textNotObject(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle}  is not an object or is empty`;
  }

  /**
   * @param {Array} val
   * @param {String} [name]
   */
  static throwNotArray(val, name) {
    throw new TypeError(ZT.textNotArray(val, name));
  }

  /**
   * @param {Array} val
   * @param {String} [name] - optional parameter for more clarity
   * @returns {string}
   */
  static textNotArray(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle} is not an array or is empty`;
  }

  /**
   * @param {Element} val
   * @param {String} [name]
   */
  static throwNotElement(val, name) {
    throw new TypeError(ZT.textNotElement(val, name));
  }

  /**
   * @param {Element} val
   * @param {String} [name] - optional parameter for more clarity
   * @returns {string}
   */
  static textNotElement(val, name) {
    const type = ZT.getType(val);
    const middle = ZT.isString(name, true)
      ? `"${name}" [${type}]`
      : type;
    return `Param ${middle}  is not an element`;
  }

  /**
   * Filters common values in two arrays. Doesn't work with data structures
   * @param {Array} arr1
   * @param {Array} arr2
   * @returns {Array}
   */
  static filterCommon(arr1 = [], arr2 = []) {
    return arr1.concat(arr2)
      .filter((val, idx, big) => big.indexOf(val) === idx && arr1.indexOf(val) !== -1 && arr2.indexOf(val) !== -1);
  }

  /**
   * Filters the unique values from one or more arrays. Doesn't work with data structures
   * @returns {Array}
   */
  static filterUnique(...args) {
    return [].concat(...args)
      .filter((val, idx, arr) => arr.indexOf(val) === idx);
  }

  /**
   * Sort an array of objects by any first level criteria.
   * Optional deeper sorting could be added later.
   * @param {string} type - pick a first level criteria.
   * @param {array} list - an array of objects
   * @returns {*}
   */
  static sortArrayBy(type, list) {
    // Mandatory sanity checks
    ZT.checkForNumberOfArguments(2, [type, list]);
    if (!ZT.isString(type, true)) {
      ZT.throwNotString(type);
    }
    if (!ZT.isArray(list, true)) {
      ZT.throwNotArray(list);
    }

    // Sorting seems to be a bit more complex than it should.
    // But there's a reason. We don't want to mess with the order...
    // of items that do not meet our criteria at all.
    return list.sort((a, b) => {
      const itemA = a[type];
      const itemB = b[type];

      return (!itemA || !itemB)
        ? 0
        : itemA - itemB;
    });
  }

  /**
   * Matching an IP
   * @param {string} ip
   * @returns {boolean}
   */
  static isValidIP(ip = '') {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  }

  /**
   * Matching an email. Any capital letters would fail to past the test
   * @param {String} email
   * @returns {boolean}
   */
  static isValidEmail(email = '') {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/; /* jscs:ignore */ // eslint-disable-line
    return regex.test(email);
  }

  /**
   * ToDo: This dummy solution needs to use some kind of error map
   * @param {String} message
   * @param {Number} [error] - optional error code
   * @returns {{error: number, message: string}}
   */
  static errMsg(message = '', error) {
    return ZT.isObject(message, true) ? message : { error, message };
  }

  /**
   * Transforms an object's values to params for an URI-like string
   * @param {object} options
   * @returns {string}
   */
  static transformOptions(options = {}) {
    const keys = Object.keys(options);
    const { length } = keys;
    const result = length ? '?' : '';
    return keys.reduce((sum, key, idx) => {
      const item = String(options[key]);
      const amp = idx >= length - 1 ? '' : '&';
      return `${sum}${key}=${item + amp}`;
    }, result);
  }

  /**
   * Generates an array of consecutive numbers with a starting position.
   * Optionally, the list could be reversed
   * @param {number} count
   * @param {number} startAt
   * @param {boolean} reverse
   */
  static generateConsecutiveNumbers(count, startAt, reverse) {
    const output = Array(count).fill(startAt).map((x, y) => x + y);
    return reverse ? output.reverse() : output;
  }

  /**
   * @param {array} keys
   * @param {object} object
   * @returns {object}
   */
  static extractValues(keys, object) {
    const result = {};
    keys.forEach((key) => {
      result[key] = object[key];
    });
    return result;
  }

  /**
   * @param {string} string
   * @param args
   * @returns {string}
   */
  static formatString(string, ...args) {
    let formatted = String(string);
    for (let i = 0; i < args.length; i += 1) {
      formatted = formatted.replace(`{${i}}`, args[i]);
    }
    return formatted;
  }

  static reachHelper(ob, arr) {
    return arr.reduce((prev, key) => (prev[key] || null), ob);
  }

  static reachValue(ob, path = '') {
    const result = { key: null, value: null, parent: null };
    const split = path.split('.');
    const match = ZT.reachHelper(ob, split);

    if (match) {
      result.key = split.pop();
      result.value = match;
      result.parent = ZT.reachHelper(ob, split);
    }

    return result;
  }

  static findItem(arr, key, val) {
    const idx = arr.findIndex((item) => item[key] === val);
    try {
      return idx === -1
        ? null
        : Object.assign(arr[idx], { ___idx: idx });
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  static findUser(arr, str) {
    // return arr.indexOf(str) !== -1;
    return ZT.findItem(arr, '_id', str);
  }

  static sanitizeUserInput(string, reverse = false) {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    if (reverse === true) {
      map = Object.entries(map).map(v => v.reverse());
    }
    return string.replace(reg, (match) => (map[match]));
  }

  /**
   * @param {*} state - any non-null, non-undefined value would do
   * @returns {{get: (function(): *), set: set, enumerable: boolean}}
   */
  static addProp(state) {
    const type = ZT.getType(state);

    if (!ZT.is(state)) { throw new Error(`### Cannot use type ${type} as initial state. It does not work this way`); }

    const action = ZT['is' + type];
    return {
      get: () => state,
      set: (val) => {
        if (action(val)) {
          if (state !== val) { state = val; }
        } else {
          console.error(`### Cannot change property type ${type} with ${ZT.getType(val)}`);
        }
      },
      enumerable: true
    };
  };

  /**
   * @param {object} values   - a collection of properties to be used as initial state for each key/value pair
   * @param {object} [target] - optional, one will be spawned if not provided
   * @returns {*}
   */
  static addProps(values, target) {
    if (!ZT.isObject(values)) { ZT.throwNotObject(values, 'values'); }
    if (!ZT.isObject(target)) { target = {}; }

    const keys = Object.keys(values);
    var result = {};
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const item = values[key];
      result[key] = ZT.addProp(item);
    }

    return Object.defineProperties(target, result);
  };
}

module.exports = ZT;
