interface ObjectWithId {
  id: string;
}

/* 
  Convert an array of objects to an object where 
  keys are ids and values are the objects 
*/
export function byId<T extends ObjectWithId>(array: T[]) {
  const initialValue = {};

  return array.reduce((obj, item: T) => {
    const { id } = item;
    return {
      ...obj,
      [id]: item
    };
  }, initialValue);
}
