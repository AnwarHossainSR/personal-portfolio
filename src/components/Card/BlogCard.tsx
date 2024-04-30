/* eslint-disable @next/next/no-img-element */
const BlogCard = () => {
  return (
    <div className="blog_container">
      <div className="blog_card">
        <div className="blog_card-header">
          <img
            src="https://c0.wallpaperflare.com/preview/483/210/436/car-green-4x4-jeep.jpg"
            alt="rover"
          />
        </div>
        <div className="blog_card-body">
          <span className="blog_tag blog_tag-teal">Technology</span>
          <h4>Why is the Tesla Cybertruck designed the way it is?</h4>
          <p>An exploration into the truck's polarising design</p>
          <div className="blog_user">
            <img
              src="https://yt3.ggpht.com/a/AGF-l7-0J1G0Ue0mcZMw-99kMeVuBmRxiPjyvIYONg=s900-c-k-c0xffffffff-no-rj-mo"
              alt="user"
            />
            <div className="blog_user-info">
              <h5>July Dec</h5>
              <small>2h ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
