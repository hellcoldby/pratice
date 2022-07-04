import React, { useState } from "react";
import A from "../A";
import pic from "../../static/icon.jpg";
import styles from "./index.less";
function Main() {
    const [value, setValue] = useState(0);
    console.log("main");
    return (
        <>
            <h1
                style={{ float: "left", width: "300px", border: "1px solid red" }}
                onClick={() => {
                    setValue(value === 0 ? 123 : 0);
                }}
            >
                {" "}
                hello world1!
                <p>
                    click：---&gt;<button>{value}</button>
                </p>
                <p> 父级状态变化 不触发子组件更新 </p>
                <A />
            </h1>

            <div style={{ float: "left", paddingRight: "50px" }}>
                <p>背景图</p>
                <div className={styles.bg}></div>
            </div>

            <div style={{ float: "left", paddingRight: "50px" }}>
                <p>image 图</p>
                <img src={pic} />
            </div>
        </>
    );
}
export default Main;
