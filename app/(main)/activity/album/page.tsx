'use client';
import React, { useRef, useState, useEffect } from 'react';
import '../../../../styles/albumcss/album.css';
import { Button } from 'primereact/button';
import { useAppDispatch } from '@/app/hooks';
import { createAlbumAsync } from '@/app/action/CAlbum';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';
import FotoPage from '@/app/(main)/activity/foto/[albumid]/page';
import router from 'next/router';
import { updateAlbumAsync } from '@/app/action/UAlbum';

interface Album {
    AlbumID: number;
    NamaAlbum: string;
    Deskripsi: string;
    TanggalDibuat: Date;
}

interface CombinedImageCardProps {
    images: string[];
    namaAlbum: string;
    deskripsiAlbum: string;
    tanggalAlbum: Date;
}

const CombinedImageCard: React.FC<CombinedImageCardProps> = ({ images, namaAlbum, deskripsiAlbum, tanggalAlbum }) => {
    // Periksa apakah tanggalAlbum tidak undefined sebelum mencoba memformat
    const formattedDate = tanggalAlbum ? format(tanggalAlbum, 'dd/MM/yyyy') : '';

    return (
        <div className="combined-image-card">
            <div className="combined-image">
                {images.map((image, index) => (
                    <div className={`part part${index + 1}`} key={index}>
                        <img src={image} alt={`Part ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className="card-content">
                <h2>{namaAlbum}</h2>
                <p>
                    <b>{deskripsiAlbum}</b>Tanggal: {formattedDate}
                </p>
                <Button icon="pi pi-pencil" className="button-edit"/>
            </div>
        </div>
    );
};

const AlbumPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [displayBasic, setDisplayBasic] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const message = useRef<Messages>(null);

    const [NAMAALBUM, setNAMAALBUM] = useState<string>('');
    const [DESKRIPSI, setDESKRIPSI] = useState<string>('');

    const [updateAlbum, setUpdateAlbum] = useState({ NAMAALBUM: '', DESKRIPSI: ''});

    const fetchData = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userId = datalogin.id; // Ambil langsung nilai USERID
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/view/album?id=${userId}`);
                const data = await response.json();

                if (data.success) {
                    setAlbums(
                        data.data.map((album: Album) => ({
                            AlbumID: album.AlbumID,
                            NamaAlbum: album.NamaAlbum,
                            Deskripsi: album.Deskripsi,
                            TanggalDibuat: new Date(album.TanggalDibuat)
                        }))
                    );
                } else {
                    console.error('Failed to fetch albums:', data.Error);
                }
            } else {
                console.error('Data login not found in local storage');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Tidak perlu lagi USERID sebagai dependency

    const Handlecreate = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userId = datalogin.id; // Ambil USERID dari local storage

                const response = await dispatch(createAlbumAsync({ NAMAALBUM, DESKRIPSI, USERID: userId }));
                const newAlbum = response.payload.data;

                // Perubahan di sini
                setAlbums([...albums, { AlbumID: newAlbum.id, NamaAlbum: NAMAALBUM, Deskripsi: DESKRIPSI, TanggalDibuat: new Date() }]);
                addSuccessMessage();
                setDisplayBasic(false);
            } else {
                console.error('Data login not found in local storage');
            }
        } catch (error) {
            console.error('Error creating album:', error);
            addErrorMessage();
        }
    };

    const Handleupdate = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userId = datalogin.id; // Ambil USERID dari local storage

                const response = await dispatch(updateAlbumAsync({ NAMAALBUM, DESKRIPSI, USERID: userId }));
                const newAlbum = response.payload.data;

                // Perubahan di sini
                setAlbums([...albums, { AlbumID: newAlbum.id, NamaAlbum: NAMAALBUM, Deskripsi: DESKRIPSI, TanggalDibuat: new Date() }]);
                addSuccessMessage();
                setDisplayBasic(false);
            } else {
                console.error('Data login not found in local storage');
            }
        } catch (error) {
            console.error('Error creating album:', error);
            addErrorMessage();
        }
    }

    const basicDialogFooter = <Button type="button" label="Simpan" onClick={Handlecreate} icon="pi pi-check" outlined />;

    const addSuccessMessage = () => {
        message.current?.show({ severity: 'success', content: 'Message Detail' });
    };
    const addErrorMessage = () => {
        message.current?.show({ severity: 'error', content: 'Message Detail' });
    };

    const renderAlbums = () => {
        return albums.map((album, index) => (
            <div key={album.AlbumID || index} className="clickable-album" onClick={() => handleAlbumClick(album)}>
                <CombinedImageCard images={images} namaAlbum={album.NamaAlbum} deskripsiAlbum={album.Deskripsi} tanggalAlbum={album.TanggalDibuat} />
            </div>
        ));
    };

    const handleAlbumClick = (album: Album) => {
        window.location.href = `/activity/foto/${album.AlbumID}`;
    };

    const images = [
        'http://100.89.189.35:3001/images/file-1706934850506.jpg', 
        'http://100.89.189.35:3001/images/file-1706934864891.jpg', 
        'http://100.89.189.35:3001/images/file-1706934878638.jpg', 
        'http://100.89.189.35:3001/images/file-1706934886828.jpg'];

    return (
        <>
            {/* <div className="card"> */}
                <div className="card-album">
                    {renderAlbums()}

                    <div className="button-create">
                        <Button icon="pi pi-plus" rounded className="create-button" onClick={() => setDisplayBasic(true)} />
                    </div>
                    <Dialog header="Album" visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                        <div className="card p-fluid">
                            <div className="field">
                                <label htmlFor="NAMAALBUM">Nama</label>
                                <InputText id="NAMAALBUM" type="text" value={NAMAALBUM} onChange={(e) => setNAMAALBUM(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="DESKRIPSI">Deskripsi</label>
                                <InputText id="DESKRIPSI" type="text" value={DESKRIPSI} onChange={(e) => setDESKRIPSI(e.target.value)} />
                            </div>
                        </div>
                    </Dialog>
                </div>
            {/* </div> */}
        </>
    );
};

export default AlbumPage;


