import React, { useEffect, useState } from "react";

function A() {
    const [init, setInit] = useState(0);
    console.log("aaa");
    function handleClick() {
        setInit(123);
    }

    return <h2 onClick={handleClick}>AABA{init}</h2>;
}

export default A;
