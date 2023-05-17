import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import PopularSubredditResponse from './subreddit.popular.json';

describe('App', () => {
  describe('when Reddit API successfully returns popular posts', () => {
    const redditApiServer = setupServer(
      // Describe network behavior with request handlers.
      // Tip: move the handlers into their own module and
      // import it across your browser and Node.js setups!
      rest.get('https://www.reddit.com/r/popular.json', (req, res, ctx) => {
        return res(ctx.json(PopularSubredditResponse));
      })
    );

    // Enable request interception.
    beforeAll(() => redditApiServer.listen());

    // Reset handlers so that each test could alter them
    // without affecting other, unrelated tests.
    afterEach(() => redditApiServer.resetHandlers());

    // Don't forget to clean up afterwards.
    afterAll(() => redditApiServer.close());

    test('renders all posts from a JSON response', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('React Testing library is so much fun')).toBeInTheDocument()
      })
      
      // screen.debug(undefined, null, { highlight: false });

      const cards = await screen.findAllByTestId('card');
      expect(cards).toHaveLength(2);

      const firstCard = screen.getAllByTestId('card').find((card) => card.textContent.includes('React Testing library is so much fun'));
      const firstHeadline = within(firstCard).getByTestId('headline');
      expect(firstHeadline).toHaveTextContent('React Testing library is so much fun');

      const auhtorFirst = within(firstCard).getByTestId('author');
      expect(auhtorFirst).toHaveTextContent('Turbostrider27');

      const numCommentsFirst = within(firstCard).getByTestId('num_comments');
      expect(numCommentsFirst).toHaveTextContent('3492');

      const secondCard = screen.getAllByTestId('card').find((card) => card.textContent.includes('MSW FTW'));
      const headlineSecond = within(secondCard).getByTestId('headline');
      expect(headlineSecond).toHaveTextContent('MSW FTW');

      const auhtorSeccond = within(secondCard).getByTestId('author');
      expect(auhtorSeccond).toHaveTextContent('_Saahil_');

      const numCommentsSecond = within(secondCard).getByTestId('num_comments');
      expect(numCommentsSecond).toHaveTextContent('4955');
    });
  });

  describe('when Reddit API returns no posts', () => {
    const redditApiServer = setupServer(
      // Describe network behavior with request handlers.
      // Tip: move the handlers into their own module and
      // import it across your browser and Node.js setups!
      rest.get('https://www.reddit.com/r/popular.json', (req, res, ctx) => {
        return res(ctx.json({ data : { children: [] }} ));
      })
    );

    // Enable request interception.
    beforeAll(() => redditApiServer.listen());

    // Reset handlers so that each test could alter them
    // without affecting other, unrelated tests.
    afterEach(() => redditApiServer.resetHandlers());

    // Don't forget to clean up afterwards.
    afterAll(() => redditApiServer.close());

    test('renders "No posts"', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('No posts')).toBeInTheDocument()
      })
      expect(screen.queryByText('Error')).not.toBeInTheDocument()
      expect(screen.queryAllByTestId('card')).toHaveLength(0);
    });
  });

  describe('when Reddit API returns an error', () => {
    const redditApiServer = setupServer(
      // Describe network behavior with request handlers.
      // Tip: move the handlers into their own module and
      // import it across your browser and Node.js setups!
      rest.get('https://www.reddit.com/r/popular.json', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    // Enable request interception.
    beforeAll(() => redditApiServer.listen());

    // Reset handlers so that each test could alter them
    // without affecting other, unrelated tests.
    afterEach(() => redditApiServer.resetHandlers());

    // Don't forget to clean up afterwards.
    afterAll(() => redditApiServer.close());

    test('renders "Error"', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument()
      })
      expect(screen.queryByText('No posts')).not.toBeInTheDocument()
      expect(screen.queryAllByTestId('card')).toHaveLength(0);
    });
  });

});