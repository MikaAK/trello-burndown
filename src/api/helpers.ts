export const objToQueryParams = function(obj) {
  var str = []

  for (let p in obj)
    if (obj.hasOwnProperty(p))
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)

  return str.join('&')
}

const convertKeys = function(convertFn): any|any[] {
  var convert = function(params) {
    if (Array.isArray(params))
      return _.map(params, convert)
    else if (params && typeof params === 'object') {
      return _.reduce(params, function(res, value, key) {
          var nValue

          if (typeof value === 'object' || Array.isArray(value))
            nValue = convert(value)
          else
            nValue = value

          res[convertFn(key)] = nValue

          return res
        }, {})
    } else
      return params
  }

  return convert
}


export const serializeKeys: any|any[] = convertKeys(_.snakeCase)
export const deserializeKeys: any|any[] = convertKeys(_.camelCase)