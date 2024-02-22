'use client';

import { Button } from 'primereact/button';
import '../../styles/dashboardcss/dashboard.css';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { createLikeAsync } from '../action/CLike';
import { UnlikeAsync } from '../action/DLike';
import { createKomentarAsync } from '../action/CKomentar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

interface Foto {
    FotoID: number;
    LikeID: number;
    JudulFoto: string;
    DeskripsiFoto: string;
    TanggalUnggah: Date;
    LokasiFile: string;
    UserID: number;
    totalKomentar?: number;
}

interface Comment {
    KomentarID: number;
    IsiKomentar: string;
    TanggalKomentar: Date;
    fotoId: number;
    userId: number;
}

interface Foto {
    totalKomentar?: number;
}

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const [vfoto, setVphoto] = useState<Foto[]>([]);
    const [likedPhotos, setLikedPhotos] = useState<number[]>([]);
    const [totalLikes, setTotalLikes] = useState<{ [key: number]: number }>({});
    const [totalComments, setTotalComments] = useState<{ [key: number]: number }>({});
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [currentPhotoID, setCurrentPhotoID] = useState<number | null>(null);

    const fetchDataFoto = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/view`);
            const data = await response.json();

            if (data.success) {
                const fetchedVphoto = data.datafoto.map(async (vfoto: Foto) => {
                    const updatedLikes = await fetchPhotoLikes(vfoto.FotoID);
                    const updatedComments = await fetchPhotoComments(vfoto.FotoID);

                    setTotalLikes((prevTotalLikes) => ({
                        ...prevTotalLikes,
                        [vfoto.FotoID]: updatedLikes.likeCount || 0
                    }));

                    setTotalComments((prevTotalComments) => ({
    ...prevTotalComments,
    [vfoto.FotoID]: updatedComments.totalKomentar || 0
}));

                    return {
                        ...vfoto,
                        totalLikes: updatedLikes.likeCount || 0,
                        totalComments: updatedComments.totalKomentar || 0
                    };
                });

                const updatedVphoto = await Promise.all(fetchedVphoto);

                setVphoto(updatedVphoto);
            } else {
                console.error('Failed to fetch photos:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
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

    const fetchComments = async (FotoID: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/komentar/view?fotoID=${FotoID}`);
            const data = await response.json();

            if (data.success) {
            const newComments = data.datakomenfoto.map((comment: Comment) => ({
                KomentarID: comment.KomentarID,
                IsiKomentar: comment.IsiKomentar,
                TanggalKomentar: new Date(comment.TanggalKomentar),
                userId: comment.userId,
                fotoId: comment.fotoId
            }));

                setComments(newComments);
                // Update totalComments based on FotoID
                setTotalComments((prevTotalComments) => ({
                    ...prevTotalComments,
                    [FotoID]: newComments.length || 0
                }));

                setIsCommentDialogOpen(true);
                return newComments;
            } else {
                console.error('Failed to fetch comments:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchPhotoComments = async (FotoID: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/komentar/total/${FotoID}`);
            const data = await response.json();

            if (data.success) {
                // Update totalKomentar based on FotoID
                setTotalComments((prevTotalComments) => ({
                    ...prevTotalComments,
                    [FotoID]: data.data.totalKomentar || 0
                }));
                return data.data; // Return the updated totalKomentar data
            } else {
                console.error('Failed to fetch photo comments:', data.error);
                return { totalKomentar: 0 };
            }
        } catch (error) {
            console.error('Error fetching photo comments:', error);
            return { totalKomentar: 0 };
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
        likedPhotos.forEach(async (FotoID) => {
            const updatedLikes = await fetchPhotoLikes(FotoID);
            setTotalLikes((prevTotalLikes) => ({
                ...prevTotalLikes,
                [FotoID]: updatedLikes.likeCount || 0
            }));
        });
    }, [likedPhotos]);

    useEffect(() => {
        // Fetch comments when currentPhotoID changes
        const fetchCommentsForCurrentPhoto = async () => {
            if (currentPhotoID !== null) {
                await fetchComments(currentPhotoID);
            }
        };

        fetchCommentsForCurrentPhoto();
    }, [currentPhotoID]);
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

   const handleCommentSubmit = async () => {
    if (currentPhotoID !== null) {
        const dataloginString = localStorage.getItem('datalogin');
        if (dataloginString) {
            const datalogin = JSON.parse(dataloginString);
            const userID = datalogin.id;

            // Panggil aksi createKomentarAsync
            dispatch(
                createKomentarAsync({
                    ISIKOMENTAR: newComment,
                    FOTOID: currentPhotoID,
                    USERID: userID
                })
            );

            // Bersihkan input setelah mengirimkan komentar
            setNewComment('');

            // Ambil kembali komentar dan like untuk memperbarui daftar dengan data baru
            const updatedComments = await fetchComments(currentPhotoID);
            
            // Update totalComments based on FotoID
            setTotalComments((prevTotalComments) => ({
                ...prevTotalComments,
                [currentPhotoID]: updatedComments.length
            }));
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
                                                console.log('Clicked Photo ID:', photo.FotoID);
                                                setCurrentPhotoID(photo.FotoID);
                                                setIsCommentDialogOpen(true); // Move this line here
                                                fetchComments(photo.FotoID);
                                            }}
                                        >
                                            <span className="like-count" style={{ fontSize: '15px', marginLeft: '5px', marginBottom: '7px' }}>
                                                {totalComments[photo.FotoID]}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <Dialog header="Komentar" visible={isCommentDialogOpen} style={{ width: '30vw' }} onHide={() => setIsCommentDialogOpen(false)}>
                <div className="comment-section">
                    {comments.map(
                        (comment) =>
                            comment.fotoId === currentPhotoID && ( // Use fotoId instead of FotoID
                                <div key={comment.KomentarID} className="comment">
                                    <p>{comment.IsiKomentar}</p>
                                    {/* <p>{comment.userId}</p> Use userId instead of UserID */}
                                </div>
                            )
                    )}
                </div>
                {/* Komentar input form */}
                <div className="comment-input">
                    <InputText value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Tambahkan komentar..." style={{ marginTop: '5px' }} />
                    <Button label="Kirim" icon="pi pi-send" onClick={() => handleCommentSubmit()} style={{ marginTop: '5px' }} />
                </div>
            </Dialog>
        </>
    );
};

export default Dashboard;
