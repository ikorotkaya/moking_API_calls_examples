import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import PopularSubredditResponse from './subreddit.popular.json';

describe('App', () => {
  

});