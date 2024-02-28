'use client';
import '../../../../styles/dashboardcss/dashboard.css';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

interface Foto {
    FotoID: number;
    JudulFoto: string;
    DeskripsiFoto: string;
    TanggalUnggah: Date;
    LokasiFile: string;
    LikeID: number; // Add LikeID to identify each like
}

interface Comment {
    KomentarID: number;
    IsiKomentar: string;
    TanggalKomentar: Date;
    fotoId: number;
    userId: number;
}

interface Likes {
    LikeID: number;
    TanggalLike: Date;
    fotoId: number;
    userId: number;
}

const LikePage = () => {
    const [vfoto, setVphoto] = useState<Foto[]>([]);
    const [likes, setLikes] = useState<Likes[]>([]);
    const [likedPhotos, setLikedPhotos] = useState<number[]>([]);
    const [totalLikes, setTotalLikes] = useState<{ [key: number]: number }>({});
    const [totalComments, setTotalComments] = useState<{ [key: number]: number }>({});
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [currentPhotoID, setCurrentPhotoID] = useState<number | null>(null);

    const fetchDataFoto = async () => {
        try {
            const dataloginString = localStorage.getItem('datalogin');
            if (dataloginString) {
                const datalogin = JSON.parse(dataloginString);
                const userID = datalogin.id;
                console.log(userID);

                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/view/likefoto?id=${userID}`);
                const data = await response.json();

                if (data.success) {
                    setLikes(data.data);

                    // Menggunakan map untuk mendapatkan array fotoId dari likedPhotos
                    const likedPhotoIds = data.data.map((like: { fotoId: number }) => like.fotoId);

                    // Fetch data foto berdasarkan array fotoId dengan Promise.all
                    const photoDataPromises = likedPhotoIds.map(async (fotoId: number) => {
                        const responsefoto = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/${fotoId}`);
                        const datafoto: Foto = await responsefoto.json();
                        return datafoto;
                    });

                    // Menunggu hasil dari seluruh promise dan kemudian memperbarui state vfoto
                    const photosData = await Promise.all(photoDataPromises);
                    setVphoto(photosData);
                } else {
                    console.error('Failed to fetch liked photos:', data.Error);
                }
            }
        } catch (error) {
            console.error('Error fetching liked photos:', error);
        }
    };

    const fetchLikedPhotos = async (userID: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/like-foto/user?id=${userID}`);
            const data = await response.json();

            if (data.success) {
                const likedPhotoIDs = data.data;
                setLikedPhotos(likedPhotoIDs);
            } else {
                console.error('Gagal mengambil foto yang disukai:', data.Error);
            }
        } catch (error) {
            console.error('Error mengambil foto yang disukai:', error);
        }
    };

    const fetchPhotoLikes = async (FotoID: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/like-foto/photo?photoId=${FotoID}`);
            const data = await response.json();

            if (data.success) {
                return data.data; // Return the updated likes data
            } else {
                console.error('Failed to fetch photo likes:', data.error);
                return { likeCount: 0, likedByUsers: [] }; // Return default values
            }
        } catch (error) {
            console.error('Error fetching photo likes:', error);
            return { likeCount: 0, likedByUsers: [] }; // Return default values
        }
    };

    useEffect(() => {
        fetchDataFoto(); // Mengambil data foto dari server
        const dataloginString = localStorage.getItem('datalogin');
        if (dataloginString) {
            const datalogin = JSON.parse(dataloginString);
            const userID = datalogin.id;
            fetchLikedPhotos(userID); // Mengambil data foto yang disukai oleh pengguna
        }
    }, []);

    useEffect(() => {
        console.log(vfoto); // Tambahkan ini untuk melihat data yang diambil dari API
        likedPhotos.forEach(async (FotoID) => {
            const updatedLikes = await fetchPhotoLikes(FotoID);
            setTotalLikes((prevTotalLikes) => ({
                ...prevTotalLikes,
                [FotoID]: updatedLikes.likeCount || 0
            }));
        });
    }, [likedPhotos]);

    const toggleLike = async (FotoID: number) => {
        const dataloginString = localStorage.getItem('datalogin');

        if (dataloginString) {
            const datalogin = JSON.parse(dataloginString);
            const userID = datalogin.id;

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/like/like&unlike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ FOTOID: FotoID, USERID: userID })
            });

            const data = await response.json();

            if (data.success) {
                if (data.message === 'Like') {
                    setLikedPhotos((prevLikedPhotos) => [...prevLikedPhotos, FotoID]);
                } else if (data.message === 'Unlike') {
                    setLikedPhotos((prevLikedPhotos) => prevLikedPhotos.filter((id) => id !== FotoID));
                }
                // Now, get the updated totalLikes and totalComments from the server response
                const updatedLikes = await fetchPhotoLikes(FotoID);
                // Update totalLikes and totalComments based on FotoID
                setTotalLikes((prevTotalLikes) => ({
                    ...prevTotalLikes,
                    [FotoID]: updatedLikes.likeCount || 0
                }));
            } else {
                console.error('Failed to toggle like:', data.message);
            }
        }
    };

    return (
        <>
            <div className="item-foto-container">
                {vfoto &&
                    vfoto.map((photo) => (
                        <div key={photo.LikeID} className="card-foto">
                            <div key={photo.FotoID} className="item-foto">
                                <img src={photo.LokasiFile} alt={photo.JudulFoto} className="card-img-top" />
                                {/* <Button icon="pi pi-download" className="download-button" style={{ fontSize: '15px', position: 'absolute', top: '10px', right: '10px' }} onClick={() => handleDownload(photo.LokasiFile, photo.JudulFoto)} /> */}
                                <div className="item-foto-content">
                                    <div className="item-foto-text">
                                        <h6>
                                            <b>{photo.JudulFoto}</b>
                                        </h6>
                                        <p>{photo.DeskripsiFoto}</p>
                                    </div>
                                    <div className="like-container">
                                        <Button icon="pi pi-heart-fill" className={`button-like ${likedPhotos.includes(photo.FotoID) ? 'liked' : ''}`} onClick={() => toggleLike(photo.FotoID)} />
                                        <span className="like-count" style={{ fontSize: '15px', marginLeft: '5px', marginBottom: '7px' }}>
                                            {totalLikes[photo.FotoID] || 0}
                                        </span>
                                        <hr className="like-divider" />
                                        <Button
                                            icon="pi pi-comment"
                                            className="comment-button"
                                            onClick={() => {
                                                console.log('Klik ID Foto:', photo.FotoID);
                                                setCurrentPhotoID(photo.FotoID);
                                                setIsCommentDialogOpen(true);
                                            }}
                                        >
                                            <span className="like-count" style={{ fontSize: '15px', marginLeft: '5px', marginBottom: '7px' }}>
                                                {totalComments[photo.FotoID] || 0}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default LikePage;
