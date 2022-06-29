import React, { useState } from "react";
import A from "../A";
function Main() {
    const [value, setValue] = useState(0);
    console.log("main");
    return (
        <>
            <h1
                onClick={() => {
                    setValue(123);
                }}
            >
                hello world1!{value}
            </h1>
            <A />
        </>
    );
}
export default Main;
