//wrapAsync is a function that takes another function as an argument and returns a new function that will call the original function 
// and catch any errors that might occur. This way, we don't have to write try/catch blocks for every async function we write.

//basically wrapAsync ak middleware ha jo kisi bhi asyncronous(async) fun ma error aye to usko catch krka next(err) ma pass krta ha
// yani ki jobhi next error handling middleware defined hoga app.js(last ma hoga defined) mai usko call krdega passing argument err

//Error anna pa us error ko handle krna yani ki shi jgah pahuchana jha pa wo error handle hojay and client/server ko err message(response) send krda

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    }
}