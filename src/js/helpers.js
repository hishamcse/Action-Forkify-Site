import {TIMEOUT_SEC} from "./config.js";
import 'regenerator-runtime/runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async (url, uploadData = undefined) => {
    try {
        const fetchPromise = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        }) : fetch(url);

        const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await response.json();

        if (!response.ok)
            throw new Error(`${response.status}: ${data.message}`);
        return data;
    } catch (err) {
        throw err;
    }
}

// export const getJSONData = async (url) => {
//     try {
//         const fetchPromise = fetch(url);
//         const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//         const data = await response.json();
//
//         if (!response.ok)
//             throw new Error(`${response.status}: ${data.message}`);
//         return data;
//     } catch (err) {
//         throw err;
//     }
// };
//
// export const sendJSONData = async (url, uploadData) => {
//     try {
//         const fetchPromise = fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(uploadData)
//         });
//         const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//         const data = await response.json();
//
//         if (!response.ok)
//             throw new Error(`${response.status}: ${data.message}`);
//         return data;
//     } catch (err) {
//         throw err;
//     }
// }