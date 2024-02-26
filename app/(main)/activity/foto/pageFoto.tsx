'use client';

import { Button } from 'primereact/button';
import React, { useState, useEffect, useRef } from 'react';
import '../../../../styles/fotocss/foto.css';
import { useAppDispatch } from '@/app/hooks';
import { Messages } from 'primereact/messages';
import { createFotoAsync } from '@/app/action/CFoto';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

interface Foto {
    Fotoid: number;
    JudulFoto: string;
    DeskripsiFoto: string;
    LokasiFile: string;
  }

const FotoPage = () => {

    const dispatch = useAppDispatch();
    const [displayBasic, setDisplayBasic] = useState(false);
    const message = useRef<Messages>(null);
  
    const [JUDULFOTO, setJUDULFOTO] = useState<string>("");
    const [DESKRIPSIFOTO, setDESKRIPSIFOTO] = useState<string>("");
    const [ALBUMID, setALBUMID] = useState<number>(0);
    const [USERID, setUSERID] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null); // buat nyimpen si file atau foto nya
    const [photos, setPhotos] = useState<Foto[]>([]); // buat nampilin foto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataloginString = localStorage.getItem('datalogin');
                if (dataloginString) {
                    const datalogin = JSON.parse(dataloginString);
                    setUSERID(datalogin.id); // ini buat ambil user id nya dari localstorange 
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/view`); //biar  ada foto di web nya
                const data = await response.json();
    
                if (data.success) {
                    setPhotos(data.datafoto);
                } else {
                    console.error("Failed to fetch photos:", data.Error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);
    

      const Handlecreate = async () => {
        try {
            const formData = new FormData();
            formData.append('JUDULFOTO', JUDULFOTO);
            formData.append('DESKRIPSIFOTO', DESKRIPSIFOTO);
            formData.append('ALBUMID', String(ALBUMID));
            formData.append('USERID', String(USERID));
            if (file) {
                formData.append('file', file);
            } // buat up si foto nya

            dispatch(createFotoAsync(formData));
            addSuccessMessage();
            setDisplayBasic(false);
        } catch (error) {
            console.error("Error creating album:", error);
            addErrorMessage();
          }
        
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const basicDialogFooter = 
        <Button type="button" label="Simpan" onClick={(Handlecreate)} icon="pi pi-check" outlined />;

    const addSuccessMessage = () => {
        message.current?.show({ severity: 'success', content: 'Message Detail' });
    };
    const addErrorMessage = () => {
        message.current?.show({ severity: 'error', content: 'Message Detail' });
    };
  
    
    return(
        <>
            <div className="card">
            
                <div className="button-create">
                    <Button icon="pi pi-upload" rounded className="create-button" onClick={() => setDisplayBasic(true)}/>
                </div>
                <Dialog 
                    header="Album" visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} 
                    onHide={() => setDisplayBasic(false)}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="JUDULFOTO">Judul</label>
                                <InputText 
                                    id="JUDULFOTO" 
                                    type="text" 
                                    value={JUDULFOTO} 
                                    onChange={(e) => setJUDULFOTO(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="DESKRIPSIFOTO">Deskripsi</label>
                                <InputText
                                    id="DESKRIPSIFOTO" 
                                    type="text" 
                                    value={DESKRIPSIFOTO}
                                    onChange={(e) => setDESKRIPSIFOTO(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="FILE">Foto</label>
                            <input type="file" id="LOKASIFILE" onChange={handleFileChange} />
                        </div>
                    </div>
                </Dialog>

                <div className="photos-container">
                    {photos.map((photo) => (
                        <div key={photo.Fotoid} className="photo-item">
                        <img src={photo.LokasiFile} alt={photo.JudulFoto} /> 
                        <div>{photo.JudulFoto}</div>
                        <div>{photo.DeskripsiFoto}</div>
                </div>
          ))}
        </div>

            </div>
        </>
    )
}

export default FotoPage;