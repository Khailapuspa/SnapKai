'use client';
import { useState, useEffect } from "react";
import { Image } from 'primereact/image';


const ImagesPage : React.FC = () => {

    const imageUrl = 'http://127.0.0.1:3001/images/file-1706690159732.jpg';
    const [image, setImage] = useState<string | null>(null);


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Image = reader.result as string;
          setImage(base64Image);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [imageUrl]);

    return(
        <>
            {image ? (
                <div className="card flex justify-content-start">
                  <Image src={image} alt="Image" width="250" preview />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}

export default ImagesPage;