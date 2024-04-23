/* eslint-disable react/no-array-index-key */

'use client';

import { motion } from 'framer-motion';

import PlaylistCard from '@/components/playlist/PlaylistCard';
import WhiteSpace from '@/components/whitespace/WhiteSpace';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { YoutubePlaylistLink } from '@/lib/const';
import { useTheme } from '@/providers/context/Context';

const PlayList = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default PlayList;
