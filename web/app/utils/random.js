// @flow strict

export const randomElement = /*:: <T>*/(list/*: $ReadOnlyArray<T>*/)/*: T*/ => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export const repeat = /*:: <T>*/(func/*: number => T*/, count/*: number*/)/*: T[]*/ => {
  const array = [];
  for (let i = 0; i < count; i++)
    array.push(func(i));
  return array;
}

export const randomInclusiveRange = (min/*: number*/ = 0, max/*: number*/ = 10)/*: number*/ => {
  const difference = Math.abs(max - min);
  return Math.floor(Math.random() * (difference + 1)) + min;
}