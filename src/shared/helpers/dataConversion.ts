export const convertData: Function = (convertFn: Function) => {
  return function convert(data: any|any[]): any|any[] {
    return Array.isArray(data) ? data.map(convert) : convertFn(data)
  }
}
