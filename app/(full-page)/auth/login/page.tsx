/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAppDispatch } from '@/app/hooks';
import { userLoginsAsync } from '@/app/action/AuthLogin';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    
    const [EMAIL, setEMAIL] = useState<string>("");
    const [PASSWORD, setPASSWORD] = useState<string>("");
    

    const loginHandle = () => {
        dispatch(userLoginsAsync({ EMAIL, PASSWORD })).then((action) => {
          if (action.payload.success === true ) {
            const datalogin = action.payload.data;
            const token = `Bearer ${action.payload.token}`
             // Omit the password field from the stored data
             const { Password, ...storedData } = datalogin;
    
            localStorage.setItem('datalogin', JSON.stringify(storedData));
            localStorage.setItem('data', token)
            window.location.reload()
            window.location.href = '/';
          } else {
            alert(action.payload.message)
            console.log(action.payload.message)
          }
        })
      };

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" /> */}
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
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="EMAIL" type="email" placeholder="Email" value={EMAIL} onChange={(e) => setEMAIL(e.target.value)} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="PASSWORD" value={PASSWORD} onChange={(e) => setPASSWORD(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                </div>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={(loginHandle)}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
