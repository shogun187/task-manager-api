require('../src/db/mongoose.js')
const Task = require('../src/models/task.js')

// Task.deleteOne({_id: '63e2270bfb29267827901e2e'})
//     .then(() => {
//         return Task.countDocuments({completed: false})
//     }
//     ).then((count) => {
//         console.log(count)
//     }
//     ).catch((e) => {
//         console.log(error)
//     })



async function deleteTaskAndCount(id) {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('63e227f7fb29267827901e31').then((count) => {
    console.log(count)
}).catch((e) => {console.log(e)})