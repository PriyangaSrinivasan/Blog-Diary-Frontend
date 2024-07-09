import React, { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import { FaShareSquare } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [likeBlog, setLikeBlog] = useState([]);
  const [comments, setcomments] = useState({});
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await fetch("https://blog-diary-flis.onrender.com/api/post/getposts");
    const data = await response.json();
    setBlogs(data);
    setLikeBlog(
      data.filter((post) => 
        (post.likes || []).includes(localStorage.getItem("userId"))
      )
    )
    
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/likepost/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async (post) => {
    const postUrl = `${window.location.orgin}/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: postUrl,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/comment/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );
      if (response.ok) {
        fetchData();
        setcomments({ ...comments, [postId]: "" });
      }
    } catch (error) {
      console.log("Failed to post commment:", error);
    }
  };
  const handleCommentChange = (postId, value) => {
    setcomments((prevcomments) => ({
      ...prevcomments,
      [postId]: value,
    }));
  };

  return (
    <div className="flex space-y-8 p-4">
      {blogs.map((ele, index) => (
          <div key={index}  className="w-full max-w-2xl mb-8">
            <Card className="card max-w-md " >
              <div className="flex items-center mb-4">
                {ele.userId && (
                  <img  className="w-10 h-10 rounded-full" src={ele.userId.profileImage}
                  alt={ele.userId.username}/>
                )}
                <div className="ml-2">
                  {ele.userId && (
                    <h4 className="username text-lg font-semibold">{ele.userId.username}</h4>
                  )}
                </div>
                </div>
            <img src={ele.image} alt="post" className="w-full" />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.title}
              </h5>
              
              <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.category}
              </h4>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {ele.description}
              </p>
              <div className="flex justify-between items-center">
                <Button color="blue" onClick={() => handleLike(ele._id)}>
                  <BiSolidLike  className="inline-block mr-2 text-xl" />
                  {ele.likes ? ele.likes.length : 0}Likes
                </Button>
                <Button color="green" onClick={() => handleShare(ele)}>
                  <FaShareSquare className="inline-block mr-2 text-xl" />
                  Share
                </Button>
              </div>
              <div className="mt-4 max-h-20 overflow-y-auto">
                <h4 className="text-xl font-semibold mb-2">Comments</h4>
                {ele.comments.map((comment, index) => (
                  <div key={index} className="mb-4 flex items-start">
                    {comment.postedBy && (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={comment.postedBy.profileImage}
                        alt={comment.postedBy.username}
                      />
                    )}
                    <div className="ml-2">
                      {comment.postedBy && (
                        <h3 className="text-md front-semibold">
                          {comment.postedBy.username}
                        </h3>
                      )}
                      <p className="text-md">{comment.text}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <textarea
                  value={comments[ele._id] || ""}
                  onChange={(e) => handleCommentChange(ele._id, e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded mb-2"
                />
                <Button
                  color="blue"
                  onClick={() => handleComment(ele._id, comments[ele._id])}
                >
                  <FaCommentAlt className="inline-block mr-2 text-xl" />
                  comment
                </Button>
              </div>
            </Card>
          </div>
        ))}
        </div>
      

  );
};

export default Blogs;
