import React, { useEffect, useRef } from 'react';

const CommentSection = ({ articleSlug, articleTitle }) => {
  const cusdisAppId = process.env.GATSBY_CUSDIS
  const commentRef = useRef(null)

  useEffect(() => {
    if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID" || !commentRef.current) {
      return
    }

    const script = document.createElement("script")
    script.src = process.env.GATSBY_CUSDIS
    script.async = true
    script.defer = true

    commentRef.current.innerHTML = ""
    commentRef.current.appendChild(script)
  }, [cusdisAppId])

  if (!cusdisAppId || cusdisAppId === 'YOUR_CUSDIS_APP_ID') {
    return (
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
        <p><strong>Note for site administrator:</strong> The comment system is not yet configured. Please replace <code>'YOUR_CUSDIS_APP_ID'</code> in <code>src/components/blog_components/CommentSection.js</code> with your actual Cusdis App ID.</p>
      </div>
    );
  }

  return (
    <div id="comments" style={{ marginTop: '3rem' }}>
      <div
        id="cusdis_thread"
        ref={commentRef}
        data-host="https://cusdis.com"
        data-app-id={cusdisAppId}
        data-page-id={articleSlug}
        data-page-url={typeof window !== 'undefined' ? window.location.href : ''}
        data-page-title={articleTitle}
      ></div>
    </div>
  );
};

export default CommentSection;
