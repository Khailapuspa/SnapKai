'use client';

import "../../../../styles/dashboardcss/dashboard.css";
import { UnlikeAsync } from "@/app/action/DLike";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

interface Foto {
    FotoID: number;
    JudulFoto: string;
    DeskripsiFoto: string;
    TanggalUnggah: Date;
    LokasiFile: string;
    LikeID: number; // Add LikeID to identify each like
}

const LikePage = () => {
    const dispatch = useAppDispatch();
    const [vfoto, setVphoto] = useState<Foto[] | undefined>(undefined);

    const fetchDataFoto = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userID = datalogin.id;

                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/view/likefoto?id=${userID}`);
                const data = await response.json();

                if (data.success) {
                    setVphoto(data.data);
                } else {
                    console.error('Failed to fetch photos:', data.Error);
                }
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    useEffect(() => {
        fetchDataFoto();
    }, []);

    const HandleUnlike = async (photo: Foto) => {
        const dataloginString = localStorage.getItem('datalogin');

        if (dataloginString) {
            const datalogin = JSON.parse(dataloginString);
            const userID = datalogin.id;

            // Dispatch the unlike action
            dispatch(UnlikeAsync({ LikeID: photo.LikeID }));

            // Update local state to remove the liked photo
            setVphoto((prevPhotos) =>
                prevPhotos?.filter((prevPhoto) => prevPhoto.FotoID !== photo.FotoID)
            );
        }
    };
    
    return(
        <>
            <div className="item-foto-container">
                {vfoto &&
                    vfoto.map((photo) => (
                        <div key={photo.FotoID} className="item-foto">
                            <img src={photo.LokasiFile} alt={photo.JudulFoto} />
                            <div className="item-foto-content">
                                <div className="item-foto-text">
                                    <h6>
                                        <b>{photo.JudulFoto}</b>
                                    </h6>
                                    <p>{photo.DeskripsiFoto}</p>
                                </div>
                                <Button
                                    icon="pi pi-heart-fill"
                                    className={`button-like ${photo.LikeID ? '' : 'liked'}`}
                                    onClick={() => HandleUnlike(photo)}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default LikePage;