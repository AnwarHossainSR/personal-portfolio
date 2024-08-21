/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-console */

'use client';

/* eslint-disable react/no-danger */
import Image from 'next/image';
import { useRef } from 'react';

import Loader from '@/components/common/Loader';
import { useFetch, usePost } from '@/hooks/useAPiCall';
import { getDateCompare } from '@/lib';
import { useTheme } from '@/providers/context/Context';
import { getBlogDetails, submitComment } from '@/services/posts';

const BlogDetailsPage = ({ slug }: { slug: string }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const newComment = useRef<any>(null);

  const {
    data: blogData,
    isLoading,
    isError,
    refetch: refetchBlogData,
  } = useFetch([`blogDetails-${slug}`], () => getBlogDetails(slug));

  const {
    post: submitCommentPost,
    // @ts-ignore
    isLoading: isSubmitting,
    isError: isSubmitError,
  } = usePost(formData => submitComment(formData));

  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const comment = newComment.current?.value;
      if (!comment) return;
      const formData = new FormData();
      formData.append('postId', blogData?._id);
      formData.append('comment', comment);
      await submitCommentPost(formData);
      newComment.current.value = '';
      refetchBlogData(); // Refetch blog data to show the new comment
    } catch (err: any) {
      console.log(err.message);
    }
  };

  if (isLoading) {
    return <Loader text="fetching..." />;
  }

  if (isError) {
    return <p>Error: Failed to load blog data</p>;
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
        {/* <p>{blogData.short_content}</p> */}
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
                    comment?.author?.image ||
                    'https://themewagon.github.io/pinwheel/images/comment-author-1.png'
                  }
                  alt="author"
                  width={50}
                  height={50}
                />
              </div>
              <div className="right">
                <div className="upper">
                  <h3>{comment?.author?.name || 'Anonymous'}</h3>
                  <p>{getDateCompare(comment?.updatedAt)}</p>
                </div>
                <p>{comment?.comment}</p>
              </div>
            </div>
          ))}
        <div className="comment-form">
          <h2>Leave a Comment</h2>
          <form onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea id="comment" ref={newComment} rows={5} />
            </div>
            {isSubmitError && <p className="error">Failed to submit comment</p>}
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
