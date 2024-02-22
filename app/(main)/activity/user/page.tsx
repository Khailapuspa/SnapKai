'use client';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const  UsersPage = () => {
    return(
        <>
            <div className="card">
            <div className="card p-fluid">
                    <h5>User Profile</h5>
                    <div className="field grid">
                        <label htmlFor="username" className="col-12 mb-2 md:col-2 md:mb-0">
                            Username
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="USERNAME" type="text" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="password" className="col-12 mb-2 md:col-2 md:mb-0">
                            Password
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="PASSWORD" type="password" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="EMAIL" className="col-12 mb-2 md:col-2 md:mb-0">
                            Email
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="EMAIL" type="email" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="NAMALENGKAP" className="col-12 mb-2 md:col-2 md:mb-0">
                            Nama Lengkap
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="NAMALENGKAP" type="text" />
                        </div>
                    </div>
                    <div className="field grid">
                        <label htmlFor="ALAMAT" className="col-12 mb-2 md:col-2 md:mb-0">
                            Alamat
                        </label>
                        <div className="col-12 md:col-10">
                            <InputText id="ALAMAT" type="text" />
                        </div>
                    </div>
                    <Button label="Submit"></Button>
                </div>
            </div>
        </>
    )
}

export default UsersPage;