import React, { useState } from 'react'
import { Divider, Button } from '@material-ui/core'
import "../../styles/scss/account-section.scss"
import FormAccountStaff from './FormAccountStaff'
import TableAuthorization from './TableAuthorization'
import AccountManagement from './AccountManagement'
const Account = ({ pageTitle }) => {
  const [account, setAccount] = useState(true);
  const [chooseAccount, setChooseAccount] = useState(true);
  const [user, setUser] = useState('');
  const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin;
  const [openTabMaterial, setOpenTabMaterial] = useState(false);
  if (isAdmin) {
    return (
      <div className="container">
        <h1 style={{ marginRight: 105 }}>{pageTitle}</h1>
        {window.innerWidth <= 768 ?
          openTabMaterial && <Button variant="contained" className="btn-back-account" onClick={() => setOpenTabMaterial(false)}>Quay lại</Button>
          :
          null
        }
        <Divider />
        {/* check test giao diện */}
        <br />
        <Button
          variant="contained"
          onClick={() => setAccount(!account)}
        >{account ? "Thay đổi mật khẩu" : "Quay lại"}</Button>
        <div className="main-content">
          {account ?
            window.innerWidth <= 768 ?
              <>
                <div className="my-col first account-col" style={openTabMaterial ? { display: 'none' } : { display: 'block' }}>
                  <div className="wrap-table">
                    <AccountManagement
                      setChooseAccount={(data) => setChooseAccount(data)}
                      isChoose={chooseAccount}
                      setUser={(item) => setUser(item)}
                      openTabMaterial={() => setOpenTabMaterial(true)}
                    />
                  </div>
                </div>
                <div className="my-col second authorization-col" style={!openTabMaterial ? { display: 'none' } : { display: 'block', width: '100%' }}>
                  <div className="wrap-table">
                    <TableAuthorization
                      chooseAccount={chooseAccount}
                      user={user}
                    />
                  </div>
                </div>
              </>
              :
              <>
                <div className="my-col first account-col">
                  <div className="wrap-table">
                    <AccountManagement
                      setChooseAccount={(data) => setChooseAccount(data)}
                      isChoose={chooseAccount}
                      setUser={(item) => setUser(item)}
                      openTabMaterial={() => setOpenTabMaterial(true)}
                    />
                  </div>
                </div>
                <div className="my-col second authorization-col">
                  <div className="wrap-table">
                    <TableAuthorization
                      chooseAccount={chooseAccount}
                      user={user}
                    />
                  </div>
                </div>
              </>
            :
            <div className="my-col first">
              <FormAccountStaff />
            </div>
          }
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <h1>{pageTitle}</h1>
        <Divider />
        <div className="my-col first">
          <FormAccountStaff />
        </div>
      </div>
    );
  }

};

export default Account;

