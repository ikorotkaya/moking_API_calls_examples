import React, { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
		let url = `https://www.reddit.com/r/popular.json`;
  
		let requestOptions = {
			method: 'GET',
			redirect: 'follow',
		};
  
		const response = await fetch(url, requestOptions);
		const jsondata = await response.json();

		// console.log('--> jsondata: ', jsondata);
  
		return jsondata;
	};

  useEffect(() => {
		fetchPosts().then((jsondata) => {
			const feedPosts = {};
			jsondata.data.children.forEach(post => {
				feedPosts[post.data.id] = post.data;
			});

      setPostsLoaded(true);
      setPosts(feedPosts);
		});
	}, []);


  return (
    <div className='container'>
      <h1>Reddit</h1>

      {!postsLoaded && <p>Loading</p>}

      {postsLoaded && Object.keys(posts).length > 0 && Object.keys(posts).map((key) => {
        const post = posts[key];
        return (
          <div className='card' key={key} data-testid='card'>
            <h2 data-testid="headline">{post.title}</h2>
            <p data-testid="author">{post.author}</p>
            <p data-testid="num_comments">{post.num_comments}</p>
          </div>
        );
      })}

    </div>
  );
}

export default App;
