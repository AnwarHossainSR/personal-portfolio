import Image from 'next/image';
import Link from 'next/link';

import anwar from '@/assets/img/anwar.svg';
import { getDateCompare } from '@/lib';

/* eslint-disable @next/next/no-img-element */
const BlogCard = ({ darkMode, post }: { darkMode: boolean; post: any }) => {
  return (
    <div className="blog_container">
      <div
        className="blog_card"
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#f3f4f6',
          color: darkMode ? '#f3f4f6' : '#1e293b',
        }}
      >
        <div className="blog_card-header">
          <img src={post?.image_url} alt={post?.title} />
        </div>
        <div className="blog_card-body">
          <span className={`blog_tag blog_tag-${post?.category?.color}`}>
            {post?.category?.name}
          </span>
          <Link
            href={`/blogs/${post?._id}`}
            style={{
              color: darkMode ? '#f3f4f6' : '#1e293b',
            }}
          >
            <h4>{post?.title}</h4>
          </Link>
          <p>{post?.short_content?.substring(0, 100)}</p>
          <div className="blog_user">
            <Image src={post?.image || anwar} alt="user" />
            <div className="blog_user-info">
              <h5>{post?.author?.name}</h5>
              <small>{getDateCompare(post?.createdAt)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
