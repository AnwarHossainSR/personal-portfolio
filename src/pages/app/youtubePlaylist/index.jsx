import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import PlaylistCard from '../../../components/app/playlist/PlaylistCard';
import WhiteSpace from '../../../components/app/whitespace/WhiteSpace';
import { YoutubePlaylistLink } from '../../../constant/Playlists';

const PlayList = ({ darkMode }) => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Anwar Hossain | Portfolio</title>
      </Helmet>
      <div className="portfolio-page">
        <div className="portfolio-page__header">
          <p
            className="portfolio-page__header--text"
            style={{
              color: darkMode ? 'white' : '',
            }}
          >
            Some of my youtube playlist
          </p>
        </div>
        <div className="portfolio-page__body">
          <motion.div layoutId="underline">
            <div className="portfolio-page__body--content">
              {YoutubePlaylistLink.map((item, index) => (
                <PlaylistCard
                  key={index}
                  link={item?.link}
                  title={item?.title}
                />
              ))}
            </div>
          </motion.div>
          <WhiteSpace height={200} />
        </div>
      </div>
    </>
  );
};

export default PlayList;
