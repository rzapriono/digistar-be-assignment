let arr = [1,2,3,4,5,"tujuh",true]
console.log(arr);

arr.push(6)
console.log(arr);

arr.pop()
console.log(arr);

arr.shift()
console.log(arr);

arr.unshift(1)
console.log(arr);

// same as iterating the content of arr
arr.map((value, index) => {
    console.log(value, index)
})

// same as iterating and checking using branches
let nums = [1,2,3,4]
let evens = nums.filter(num => num%2 == 0);
console.log(evens);