let fail = false;

const fetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (fail) {
            reject("Data not fetched!");
        }
        resolve("Data fetched!");
    }, 1000)
})

fetchData.then(data => {
    console.log("From fetchData: " + data);
}).catch(err => {
    console.log("From fetchData: " + err);
})

// handle promise using async await
let fail2 = true;
async function fetchData2() {
    try {
        const data = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (fail2) {
                    reject({
                        status: 404,
                        message: "Data not found!",
                        reason: "Your request is invalid."
                    })
                }
                resolve("Data fetched!")
            }, 1000);
        })
    } catch (err){
        console.log(err)
    }
}

fetchData2();