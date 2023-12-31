import React, { useEffect, useState } from 'react';

function Preview({ isPreview, setIsPreview, file }) {
    const handleOpenClosePreview = () => {
        setIsPreview(!isPreview);
    }


    return (
        <div className="preview">
            <div className="pre-preview" onClick={handleOpenClosePreview}>
                {file && (
                    file.file_type.includes("png") ||
                    file.file_type.includes("jpg") ||
                    file.file_type.includes("jpeg") ||
                    file.file_type.includes("gif") ? (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/download/${file.path}`} alt="Image" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            fill={"#ffffff"}
                            height={"40px"}
                            width={"40px"}
                            version="1.1"
                            id="Capa_1"
                            viewBox="0 0 58 58"
                            xmlSpace="preserve">
                            <g xmlns="http://www.w3.org/2000/svg">
                                <path d="M50.949,12.187l-1.361-1.361l-9.504-9.505c-0.001-0.001-0.001-0.001-0.002-0.001l-0.77-0.771   C38.957,0.195,38.486,0,37.985,0H8.963C7.776,0,6.5,0.916,6.5,2.926V39v16.537V56c0,0.837,0.841,1.652,1.836,1.909   c0.051,0.014,0.1,0.033,0.152,0.043C8.644,57.983,8.803,58,8.963,58h40.074c0.16,0,0.319-0.017,0.475-0.048   c0.052-0.01,0.101-0.029,0.152-0.043C50.659,57.652,51.5,56.837,51.5,56v-0.463V39V13.978C51.5,13.211,51.407,12.644,50.949,12.187   z M39.5,3.565L47.935,12H39.5V3.565z M8.963,56c-0.071,0-0.135-0.025-0.198-0.049C8.61,55.877,8.5,55.721,8.5,55.537V41h41v14.537   c0,0.184-0.11,0.34-0.265,0.414C49.172,55.975,49.108,56,49.037,56H8.963z M8.5,39V2.926C8.5,2.709,8.533,2,8.963,2h28.595   C37.525,2.126,37.5,2.256,37.5,2.391V14h11.608c0.135,0,0.265-0.025,0.391-0.058c0,0.015,0.001,0.021,0.001,0.036V39H8.5z"/>
                                <polygon points="15.197,45.045 18.205,45.045 18.205,54 19.859,54 19.859,45.045 22.867,45.045 22.867,43.924 15.197,43.924  "/>
                                <polygon points="30.291,43.924 28.363,48.025 28.227,48.025 26.449,43.924 24.576,43.924 27.297,49.105 24.74,54 26.641,54    28.363,50.199 28.5,50.199 30.1,54 32,54 29.443,49.105 32.164,43.924  "/>
                                <polygon points="33.859,45.045 36.867,45.045 36.867,54 38.521,54 38.521,45.045 41.529,45.045 41.529,43.924 33.859,43.924  "/>
                                <path d="M13.5,14h6c0.553,0,1-0.448,1-1s-0.447-1-1-1h-6c-0.553,0-1,0.448-1,1S12.947,14,13.5,14z"/>
                                <path d="M13.5,19h9c0.553,0,1-0.448,1-1s-0.447-1-1-1h-9c-0.553,0-1,0.448-1,1S12.947,19,13.5,19z"/>
                                <path d="M26.5,19c0.26,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.26-0.11-0.52-0.29-0.71   c-0.37-0.37-1.05-0.37-1.41,0c-0.19,0.19-0.3,0.44-0.3,0.71s0.109,0.52,0.29,0.71C25.979,18.89,26.24,19,26.5,19z"/>
                                <path d="M30.5,19h8c0.553,0,1-0.448,1-1s-0.447-1-1-1h-8c-0.553,0-1,0.448-1,1S29.947,19,30.5,19z"/>
                                <path d="M12.79,32.29c-0.181,0.19-0.29,0.45-0.29,0.71c0,0.26,0.109,0.52,0.29,0.71C12.979,33.89,13.24,34,13.5,34   s0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.26-0.11-0.52-0.29-0.7C13.84,31.92,13.16,31.92,12.79,32.29z"/>
                                <path d="M25.5,32h-8c-0.553,0-1,0.448-1,1s0.447,1,1,1h8c0.553,0,1-0.448,1-1S26.053,32,25.5,32z"/>
                                <path d="M44.5,17h-2c-0.553,0-1,0.448-1,1s0.447,1,1,1h2c0.553,0,1-0.448,1-1S45.053,17,44.5,17z"/>
                                <path d="M13.5,24h22c0.553,0,1-0.448,1-1s-0.447-1-1-1h-22c-0.553,0-1,0.448-1,1S12.947,24,13.5,24z"/>
                                <path d="M44.5,22h-6c-0.553,0-1,0.448-1,1s0.447,1,1,1h6c0.553,0,1-0.448,1-1S45.053,22,44.5,22z"/>
                                <path d="M13.5,29h4c0.553,0,1-0.448,1-1s-0.447-1-1-1h-4c-0.553,0-1,0.448-1,1S12.947,29,13.5,29z"/>
                                <path d="M31.5,27h-10c-0.553,0-1,0.448-1,1s0.447,1,1,1h10c0.553,0,1-0.448,1-1S32.053,27,31.5,27z"/>
                                <path d="M44.5,27h-9c-0.553,0-1,0.448-1,1s0.447,1,1,1h9c0.553,0,1-0.448,1-1S45.053,27,44.5,27z"/>
                            </g>
                        </svg>
                ))}

            </div>

            {isPreview && (
                <div className="preview-bg" onClick={handleOpenClosePreview}>
                    <div className="preview-window">
                        {file && (
                            file.file_type.includes("png") ||
                            file.file_type.includes("jpg") ||
                            file.file_type.includes("jpeg") ||
                            file.file_type.includes("gif") ? (
                                <img src={`${import.meta.env.VITE_API_BASE_URL}/download/${file.path}`} alt="Image" />
                            ) : (
                                file.file_type.includes("txt") ? (
                                    <div>
                                        <iframe
                                            src={`${import.meta.env.VITE_API_BASE_URL}/download/${file.path}`}
                                            title="Text File"
                                        />
                                    </div>
                                ) : null
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Preview;
