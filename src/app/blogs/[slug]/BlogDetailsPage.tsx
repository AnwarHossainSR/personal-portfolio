import Image from 'next/image';

const BlogDetailsPage = ({ slug }: { slug: string }) => {
  return (
    <div className="blog-details_container">
      <Image
        src="https://themewagon.github.io/pinwheel/images/blog-single.png"
        className="blog-details_image"
        alt={slug}
        width={1200}
        height={800}
      />
      <div className="blog-details_title">
        <h1>
          Memo To All Housekeeping, Kitchen, & Dining Room Staff At Mar-A-Lago
        </h1>
      </div>
      <div className="blog-details_author">
        <div className="left">
          <Image
            src="https://themewagon.github.io/pinwheel/images/blog-author.png"
            className="blog-details_author-image"
            alt="author"
            width={50}
            height={50}
          />
        </div>
        <div className="right">
          <h3>By John Doe</h3>
          <p>January 1, 2021</p>
        </div>
      </div>
      <div className="blog-details_content">
        <p>
          Dear Staff, I am writing to you today to express my gratitude for the
          hard work and dedication you have shown over the past year. Your
          commitment to excellence has not gone unnoticed, and I want to take
          this opportunity to thank you for all that you do. As we move into the
          new year, I am confident that we will continue to achieve great things
          together. I look forward to working with you all in the coming months
          and wish you all the best for the year ahead. Sincerely, John Doe
        </p>

        <p>
          Dear Staff, I am writing to you today to express my gratitude for the
          hard work and dedication you have shown over the past year. Your
          commitment to excellence has not gone unnoticed, and I want to take
          this opportunity to thank you for all that you do. As we move into the
          new year, I am confident that we will continue to achieve great things
          together. I look forward to working with you all in the coming months
          and wish you all the best for the year ahead. Sincerely, John Doe
        </p>
      </div>
      <div className="blog-details_comments">
        <h2>Comments</h2>
        <div className="comment">
          <div className="left">
            <Image
              src="https://themewagon.github.io/pinwheel/images/comment-author-1.png"
              className="comment-image"
              alt="author"
              width={50}
              height={50}
            />
          </div>
          <div className="right">
            <h3>John Doe</h3>
            <p>January 1, 2021</p>
            <p>
              Dear Staff, I am writing to you today to express my gratitude for
              the hard work and dedication you have shown over the past year.
              Your commitment to excellence has not gone unnoticed, and I want
              to take this opportunity to thank you for all that you do. As we
              move into the new year, I am confident that we will continue to
              achieve great things together. I look forward to working with you
              all in the coming months and wish you all the best for the year
              ahead. Sincerely, John Doe
            </p>
          </div>
        </div>
        <div className="comment">
          <div className="left">
            <Image
              src="https://themewagon.github.io/pinwheel/images/comment-author-2.png"
              className="comment-image"
              alt="author"
              width={50}
              height={50}
            />
          </div>
          <div className="right">
            <h3>John Doe</h3>
            <p>January 1, 2021</p>
            <p>
              Dear Staff, I am writing to you today to express my gratitude for
              the hard work and dedication you have shown over the past year.
              Your commitment to excellence has not gone unnoticed, and I want
              to take this opportunity to thank you for all that you do. As we
              move into the new year, I am confident that we will continue to
              achieve great things together. I look forward to working with you
              all in the coming months and wish you all the best for the year
              ahead. Sincerely, John Doe
            </p>
          </div>
        </div>

        <div className="comment-form">
          <h2>Leave a Comment</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
            </div>
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
