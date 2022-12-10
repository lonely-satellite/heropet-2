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