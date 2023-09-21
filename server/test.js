// var expect = function(val) {
//     return {
//         toBe : function(a){
//             if(val===a) return true
//             else throw new Error('Not Equal') 
//         },
//         notToBe : function(b){
//             if(val===b || b == null || (typeof(b)==='object' && Object.keys(b).length)) return true
//             else throw new Error('Equal')
//         }
//     }
// };

// /**
//  * expect(5).toBe(5); // true
//  * expect(5).notToBe(5); // throws "Equal"
//  */

// // const o = {}

// // console.log(typeof(o))
// // console.log(expect(5).notToBe({}));

// const students = {
//     key1 : "test",
//     key2 : "test2",
// }

// Object.entries(students).forEach((el)=>{
//     console.log(el)
// })


var createCounter = function(init) {
    let a = init
    return {
        increment : function(){
            return ++a
        },
        reset : function(){
            return a = init 
        },
        decrement : function(){
            return --a
        }
    }
};

const counter = createCounter(5)
console.log(counter.increment()) // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4

