'use client';

import { useAppDispatch } from '@/app/hooks';
import '../../../../../styles/valbumcss/valbum.css';
import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { createFotoAsync } from '@/app/action/CFoto';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

interface Album {
    AlbumID: number;
    NamaAlbum: string;
    Deskripsi: string;
    TanggalDibuat: Date;
}

interface Foto {
    Fotoid: number;
    JudulFoto: string;
    DeskripsiFoto: string;
    LokasiFile: string;
}

function FotoPage({ params }: { params: { albumid: number } }) {
  
    const dispatch = useAppDispatch();
    const [displayBasic, setDisplayBasic] = useState(false);
    const [valbum, setValbum] = useState<Album | null>(null);
    const [vfoto, setVphoto] = useState<Foto[] | undefined>(undefined);

    const [JUDULFOTO, setJUDULFOTO] = useState<string>('');
    const [DESKRIPSIFOTO, setDESKRIPSIFOTO] = useState<string>('');
    const [ALBUMID, setALBUMID] = useState<number>(0);
    const [USERID, setUSERID] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [photos, setPhotos] = useState<Foto[]>([]);

    const fetchDataAlbum = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/album/view/user?id=${params.albumid}`);
            const data = await response.json();

            if (data.success) {
                setValbum({
                    AlbumID: data.data.AlbumID,
                    NamaAlbum: data.data.NamaAlbum,
                    Deskripsi: data.data.Deskripsi,
                    TanggalDibuat: new Date(data.data.TanggalDibuat)
                });
            } else {
                console.error('Failed to fetch album:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching album:', error);
        }
    };

    const fetchDataFoto = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/album/view/foto?id=${params.albumid}`);
            const data = await response.json();

            if (data.success) {
                setVphoto(data.data);
            } else {
                console.error('Failed to fetch photos:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    useEffect(() => {
        fetchDataAlbum();
        fetchDataFoto();
    }, []);

    const Handlecreate = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userID = datalogin.id;
                const albumID = params.albumid;

                const formData = new FormData();
                formData.append('JUDULFOTO', JUDULFOTO);
                formData.append('DESKRIPSIFOTO', DESKRIPSIFOTO);
                formData.append('ALBUMID', String(albumID));
                formData.append('USERID', String(userID));
                if (file) {
                    formData.append('file', file);
                } // buat up si foto nya

                dispatch(createFotoAsync(formData));
                setDisplayBasic(false);
                window.location.reload();
            } else {
                console.error('Data login not found in local storage');
            }
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const basicDialogFooter = <Button type="button" label="Simpan" onClick={Handlecreate} icon="pi pi-check" outlined />;

    return (
        <>
            <div className="card">
                <div className="button-create">
                    <Button icon="pi pi-upload" rounded className="create-button" onClick={() => setDisplayBasic(true)} />
                </div>
                <Dialog header="Foto" visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="JUDULFOTO">Judul</label>
                            <InputText id="JUDULFOTO" type="text" value={JUDULFOTO} onChange={(e) => setJUDULFOTO(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="DESKRIPSIFOTO">Deskripsi</label>
                            <InputText id="DESKRIPSIFOTO" type="text" value={DESKRIPSIFOTO} onChange={(e) => setDESKRIPSIFOTO(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="FILE">Foto</label>
                            <input type="file" id="LOKASIFILE" onChange={handleFileChange} />
                        </div>
                    </div>
                </Dialog>

                {/* <h5>{params.albumid}</h5> */}
                <div className="item-album-container">
                {valbum && (
                    <>
                        <h2><b>{valbum.NamaAlbum}</b></h2>
                        <p>{valbum.Deskripsi}</p>
                        <h6>{valbum.TanggalDibuat && format(valbum.TanggalDibuat, 'yyyy-MM-dd')}</h6>
                    </>
                )}
                </div>

                <div className="item-foto-container">
                    {vfoto &&
                        vfoto.map((photo) => (
                            <div key={photo.Fotoid} className="item-foto">
                                <img src={photo.LokasiFile} alt={photo.JudulFoto}/>
                                <h6><b>{photo.JudulFoto}</b></h6>
                                <p>{photo.DeskripsiFoto}</p>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default FotoPage;
