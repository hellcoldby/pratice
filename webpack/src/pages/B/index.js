import React from "react";  

function B (){
        console.log('BB')
        return <p style={{color:'green'}}> BB -- 懒加载 </p>
    
}

export default React.memo(B);