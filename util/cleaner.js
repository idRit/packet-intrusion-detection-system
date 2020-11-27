let arr = [], arr2 = [], arr3 = [];
for (let i = 0; i < jsonArray.length; i++) {
    arr.push(Object.values(jsonArray[i])[1]);
    arr2.push(Object.values(jsonArray[i])[2]);
    arr3.push(Object.values(jsonArray[i])[3]);
}

var filteredArray = arr.filter(function (item, pos) {
    return arr.indexOf(item) == pos;
});

var filteredArray2 = arr2.filter(function (item, pos) {
    return arr2.indexOf(item) == pos;
});

var filteredArray3 = arr3.filter(function (item, pos) {
    return arr3.indexOf(item) == pos;
});

console.log(filteredArray);
console.log(filteredArray2);
console.log(filteredArray3);