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

    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Foto[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
                console.error('Gagal mengambil foto:', data.Error);
            }
        } catch (error) {
            console.error('Error mengambil foto:', error);
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

                // Update totalComments based on all fetched comments
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
                    [FotoID]: 0 // Atur total komentar sebagai 0 terlebih dahulu
                }));

                // Setelah itu, perbarui total komentar berdasarkan respons server
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

    useEffect(() => {
        const fetchTotalCommentsForAllPhotos = async () => {
            try {
                const totalCommentsData = await Promise.all(
                    vfoto.map(async (photo: Foto) => {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/komentar/total/${photo.FotoID}`);
                        const data = await response.json();

                        if (data.success) {
                            console.log(`Total komentar untuk ID Foto ${photo.FotoID}: ${data.totalKomentar || 0}`);
                            return {
                                [photo.FotoID]: data.totalKomentar || 0
                            };
                        } else {
                            console.error(`Gagal mengambil total komentar untuk ID Foto ${photo.FotoID}:`, data.error);
                            return {
                                [photo.FotoID]: 0
                            };
                        }
                    })
                );

                console.log('Data total komentar:', totalCommentsData);
                return totalCommentsData;
            } catch (error) {
                console.error('Error dalam fetchTotalCommentsForAllPhotos:', error);
                throw error; // Propagasi error jika diperlukan
            }
        };

        fetchTotalCommentsForAllPhotos();
    }, [vfoto]);
    // ...

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

                // Update totalComments berdasarkan FotoID
                setTotalComments((prevTotalComments) => ({
                    ...prevTotalComments,
                    [currentPhotoID]: updatedComments.length
                }));
            }
        }
    };

    const handleDownload = async (url: string, judulFoto?: string) => {
        try {
            const fileName = judulFoto || url.split('/').pop() || 'downloaded_file';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to download file. Status code: ${response.status}`);
            }

            const blob = await response.blob();

            const aTag = document.createElement('a');
            aTag.href = window.URL.createObjectURL(blob);
            aTag.setAttribute('download', fileName);
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);

            window.URL.revokeObjectURL(aTag.href);
        } catch (error) {
            console.error(`Error downloading file: ${error}`);
        }
    };

    const handleSearch = async () => {
        try {
            setIsSearching(true);
            if (isSearchActive) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/foto/search?keyword=${searchKeyword}`);
                const data = await response.json();

                if (data.success) {
                    setSearchResults(data.datafoto);
                } else {
                    console.error('Gagal melakukan pencarian:', data.error);
                }
            } else {
                setSearchKeyword('');
            }
        } catch (error) {
            console.error('Error melakukan pencarian:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
    };

    // const performSearch = (query: string) => {
    //     const fuse = new Fuse(vfoto, {
    //         keys: ['JudulFoto', 'DeskripsiFoto']
    //     });

    //     const result = fuse.search(query);
    //     setSearchResults(result.map((item) => item.item));
    // };

    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const query = event.target.value;
    //     setSearchQuery(query);

    //     if (query.trim() === '') {
    //         setIsSearching(false);
    //         setSearchResults([]);
    //     } else {
    //         setIsSearching(true);
    //         performSearch(query);
    //     }
    // };

    return (
        <>
            <div className="input-search">
                <div className="col-12 mb-2 lg:col- lg:mb-0">
                    <span className="p-input-icon-right">
                        <InputText type="text" placeholder="Search" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onFocus={() => setIsSearchActive(true)} />
                        {searchKeyword && <i className="pi pi-times-circle clear-icon" onClick={handleClearSearch} />}
                    </span>
                    <Button icon="pi pi-search" onClick={handleSearch} className="button-search" />
                </div>
            </div>

            {/* <div className="col-12 mb-2 lg:col- lg:mb-0">
                <span className="p-input-icon-right">
                    <InputText type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                    <i className="pi pi-search" />
                </span>
            </div> */}

            <div className="item-foto-container">
                {isSearching ? (
                    <p>Mencari...</p>
                ) : (
                    searchResults.map((photo) => (
                        <div key={photo.LikeID} className="card-foto">
                            <div key={photo.FotoID} className="item-foto">
                                <img src={photo.LokasiFile} alt={photo.JudulFoto} className="card-img-top" />
                                {/* Tombol download dan konten foto lainnya */}
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
                                        />
                                        <span className="like-count" style={{ fontSize: '15px', marginLeft: '5px', marginBottom: '7px' }}>
                                            {totalComments[photo.FotoID] || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="item-foto-container">
                {vfoto &&
                    vfoto.map((photo) => (
                        <div key={photo.LikeID} className="card-foto">
                            <div key={photo.FotoID} className="item-foto">
                                <img src={photo.LokasiFile} alt={photo.JudulFoto} className="card-img-top" />
                                <Button icon="pi pi-download" className="download-button" style={{ fontSize: '15px', position: 'absolute', top: '10px', right: '10px' }} onClick={() => handleDownload(photo.LokasiFile, photo.JudulFoto)} />
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
