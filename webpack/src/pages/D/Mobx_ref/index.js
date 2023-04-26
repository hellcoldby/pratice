import {observable} from 'mobx';
  import { observer } from 'mobx-react';
  import React, { useState, useEffect } from "react";
 
  class UserStore {
    @observable.ref userList = [];
   
    async getUserList() {
      if (this.userList.length === 0) {
        await this.refreshUserList();
      }
      return this.userList;
    }
  
    async refreshUserList() {
      // 从数据源中获取新的用户列表数据
      const data = await fetch("https://jsonplaceholder.typicode.com/users");
      const userList = await data.json();
      console.log(userList);
      // 更改用户列表的引用，而不是更改其属性
      this.userList = userList;
    }
  }
  
  const store = new UserStore();
  
  const UserList =observer (() =>{
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);
  
    useEffect(() => {
      setIsLoading(true);
      store.getUserList().then((data) => {
        setUserList(data);
        setIsLoading(false);
      });
    }, []);
  
    return (
        <>
        <div style={{border:'1px solid red', height:'250px', overflow:'scroll'}}>
            {isLoading ? (
            <p>Loading...</p>
            ) : (
                <div>
                {userList.map((user) => (
                    <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    </div>
                ))}
                
                </div>
            )}

        
        </div>
        <button onClick={() => store.refreshUserList(setUserList)}>Refresh</button>
        </>

    );
  });

  export default UserList;