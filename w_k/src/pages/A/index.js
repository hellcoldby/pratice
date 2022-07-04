import React, { useEffect, useState } from "react";

function A() {
    const [init, setInit] = useState(0);
    console.log("child");
    function handleClick(e) {
        setInit(init === 0 ? 1 : 0);
        e.stopPropagation();
    }

    return (
        <p style={{ fontWeight: "bolder" }} onClick={handleClick}>
            React.memo(子组件) ---click:---&gt;
            <button>{init}</button>
        </p>
    );
}

export default React.memo(A);
