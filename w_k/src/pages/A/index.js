import React, { useEffect, useState } from "react";

function A() {
    const [init, setInit] = useState(0);
    console.log("AA");
    function handleClick(e) {
        setInit(init === 0 ? 1 : 0);
        e.stopPropagation();
    }

    return (
        <p style={{ fontWeight: "bolder", color:'darkgreen' }} onClick={handleClick}>
           A---&gt;
            <button>{init}</button>
        </p>
    );
}

export default React.memo(A);
