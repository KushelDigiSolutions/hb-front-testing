/**
 * 
 * @returns Flat and sorted array of health concerns
 */
export const flaternHealthConcernsChildrens = (healthConcerns: any[]) => {

  if (!healthConcerns?.length) return [];

  let flatList: any[] = []
  JSON.parse(JSON.stringify(healthConcerns)).forEach((el: any) => {
    flatList.push(el)
    if (el.children?.length) {
      el.children.forEach((el2: any) => {
        flatList.push(el2)
      })
    }
  })
  flatList.forEach(el => delete el.children)
  flatList.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  return flatList
}