/**
 * Sort object properties by the property key
 * @param _object
 * @returns sorted object
 */
export const sortObjectByKey = (_object?: object | null) => {
  if (!_object) return {}
  return Object.keys(_object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = _object[key]
      return obj
    }, {})
}

export const sortByObjectObjectFieldValue = (object: object, fieldName: string) => {
  return Object.keys(object)
    .sort((a, b) => {
      return parseInt(object[a][fieldName], 10) - parseInt(object[b][fieldName], 10)
    })
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})
}
