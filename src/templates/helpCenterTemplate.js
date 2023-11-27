import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import '../components/help-center.css';
import MarkdownContent from '../components/MarkdownContent';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/seo';

const HelpCenterTemplate = ({ pageContext }) => {
  const { content, title, type } = pageContext;
  console.log(`Rendering content for: ${title}`);
  console.log(`Content: `, content.slice(0, 200)); // Log the first 200 characters
  return (
    <div>
      <Seo
        title={`${type === 'user' ? 'User Help Center' : 'Help Center'} | ${title}`}
        description={`Help article about ${title}`}
      />
      <Header />
      <Breadcrumbs link={type === 'user' ? "/user-help-center" : "/help-center"} title={title}/>
      <MarkdownContent content={content} />
      <Footer />
    </div>
  );
};

export default HelpCenterTemplate;
