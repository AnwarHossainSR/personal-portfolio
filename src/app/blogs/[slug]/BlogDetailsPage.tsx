/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-console */

'use client';

/* eslint-disable react/no-danger */
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Loader from '@/components/common/Loader';
import { getDateCompare } from '@/lib';
import { useTheme } from '@/providers/context/Context';

const BlogDetailsPage = ({ slug }: { slug: string }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchBlogData = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog data');
      }
      const data = await response.json();
      setBlogData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  if (loading) {
    return <Loader text="fetching blogs..." />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!blogData) {
    return <p>No blog data available</p>;
  }

  return (
    <div
      className="blog-details_container"
      style={{
        color: darkMode ? '#c0c6d1' : '',
      }}
    >
      <img
        src={
          blogData?.image_url ||
          'https://themewagon.github.io/pinwheel/images/blog-single.png'
        }
        className="blog-details_image"
        alt=""
      />
      <div className="blog-details_title">
        <h1>{blogData?.title}</h1>
      </div>
      <div className="blog-details_author">
        <div className="left">
          <Image
            src={
              blogData?.author?.image ||
              'https://themewagon.github.io/pinwheel/images/blog-author.png'
            }
            className="blog-details_author-image"
            alt="author"
            width={50}
            height={50}
          />
        </div>
        <div className="right">
          <h3>By {blogData?.author?.name}</h3>
          <p>{getDateCompare(blogData?.createdAt)}</p>
        </div>
      </div>
      <div className="blog-details_content">
        <p>{blogData.short_content}</p>
        <div
          className="text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />
      </div>
      <div className="blog-details_comments">
        <h2>Comments</h2>
        {blogData?.comments?.length > 0 &&
          blogData?.comments?.map((comment: any) => (
            <div className="comment" key={comment._id}>
              <div className="left">
                <Image
                  src={
                    comment.authorImage ||
                    'https://themewagon.github.io/pinwheel/images/comment-author-1.png'
                  }
                  className="comment-image"
                  alt="author"
                  width={50}
                  height={50}
                />
              </div>
              <div className="right">
                <h3>{comment.authorName}</h3>
                <p>{new Date(comment.date).toLocaleDateString()}</p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        <div className="comment-form">
          <h2>Leave a Comment</h2>
          <form>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea id="comment" rows={5} />
            </div>
            <button className="button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
