import { fetchPost } from "./axios.js";

// async function getPostList() {
//     return fetchPost((data) => {
//         console.log("fetchPostsList be called!");
//     });
// }

// jest.mock("./axios.js");

test("mock 整个 axios.js 文件", async () => {
    // expect.assertions(1);
    // await getPostList();
    // expect(fetchPost).toBeCalled();
    function callback(data) {
        try {
            expect(data).toBe("peanut butter");
            done();
        } catch (error) {
            done(error);
        }
    }

    fetchPost(callback);
});
