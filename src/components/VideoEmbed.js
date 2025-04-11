import React from 'react';
import { Helmet } from 'react-helmet';

const VideoEmbed = ({ videoUrl, title, description, thumbnailUrl, uploadDate }) => {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:embed\/|v=|\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": title,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "embedUrl": embedUrl,
    "contentUrl": videoUrl
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </>
  );
};

export default VideoEmbed;
