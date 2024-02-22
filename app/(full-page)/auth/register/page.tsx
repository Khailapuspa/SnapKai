'use client';
import { defaultConfig } from "next/dist/server/config-shared"
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { useAppDispatch } from "@/app/hooks";
import { userRegisAsync } from "@/app/action/AuthRegis";

const RegisterPage = () => {
    const dispatch = useAppDispatch();

    const [USERNAME, setUSERNAME] = useState<string>("");
    const [PASSWORD, setPASSWORD] = useState<string>("");
    const [EMAIL, setEMAIL] = useState<string>("");
    const [NAMALENGKAP, setNAMALENGKAP] = useState<string>("");
    const [ALAMAT, setALAMAT] = useState<string>("");

    const registerHandle = () => {
        dispatch(userRegisAsync({ USERNAME, PASSWORD, EMAIL, NAMALENGKAP, ALAMAT })).then((action) => {
            if (action.payload.success === true) {
                const dataregis = action.payload.data;
    
                // Omit the password field from the stored data
                const { Password, ...storedData } = dataregis;
    
                localStorage.setItem('dataregis', JSON.stringify(storedData));
                window.location.href = '/auth/login';
            } else {
                alert(action.payload.message);
                console.log(action.payload.message);
            }
        });
    };

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return(
        <>
            <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, SnapKai!</div>
                            <span className="text-600 font-medium">Sign Up to continue</span>
                        </div>

                        <div>
                            <label htmlFor="USERNAME" className="block text-900 text-xl font-medium mb-2">
                                Username
                            </label>
                            <InputText id="USERNAME" type="text" placeholder="Username" value={USERNAME} onChange={(e) => setUSERNAME(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="PASSWORD" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="PASSWORD" value={PASSWORD} onChange={(e) => setPASSWORD(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <label htmlFor="EMAIL" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="EMAIL" type="email" placeholder="Email" value={EMAIL} onChange={(e) => setEMAIL(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="NAMALENGKAP" className="block text-900 font-medium text-xl mb-2">
                                Nama Lengkap
                            </label>
                            <InputText id="NAMALENGKAP" type="text" placeholder="Nama Lengkap" value={NAMALENGKAP} onChange={(e) => setNAMALENGKAP(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="ALAMAT" className="block text-900 font-medium text-xl mb-2">
                                Alamat
                            </label>
                            <InputText id="ALAMAT" type="text" placeholder="Alamat" value={ALAMAT} onChange={(e) => setALAMAT(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                </div>
                            </div>
                            <Button label="Sign Up" className="w-full p-3 text-xl" onClick={(registerHandle)}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default RegisterPage;