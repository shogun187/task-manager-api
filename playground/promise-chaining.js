require('../src/db/mongoose.js')
const User = require('../src/models/user.js')

//   63e0f26b2eafd1d20225d5e3

// User.findByIdAndUpdate('63e0f26b2eafd1d20225d5e3', {name: 'Shaugn Tan'})
//     .then(
//         (user) => {
//             console.log(user)
//             return User.countDocuments({name: 'Shaugn Tan'})
//         }
//     )
//     .then((count) => {
//             console.log(count)
//         }
//     ).catch((e) => {
//     console.log(e)
// })

async function updateAgeAndCount(id, age) {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('63e0f26b2eafd1d20225d5e3', 2).then((count) => {
    console.log(`Count: ${count}`)
}).catch((e) => {console.log(e)})