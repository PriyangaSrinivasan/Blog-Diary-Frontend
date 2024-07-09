import { Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaShareSquare } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
const[comment,setcomments]=useState("")
  useEffect(() => {
    fetchPostById();
  }, []);

  const  fetchPostById = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/getpost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.log("Failed to fetch post by id", error);
    }
  };
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/likepost/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchPostById();
      }
    } catch (error) {
      console.log( error);
    }
  };
  const handleShare = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      navigate("/login");
      return;
    }
    const postUrl = `${window.location.origin}/post/${post._id}`;
    if (navigate.share) {
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
  const handleComment = async () => {
    const token = localStorage.getItem("Token");
    if(!token){
      alert("YOu need to sign in toComment");
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/comment/${id}`,
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
        fetchPostById();
        setcomments("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    post &&(
    <div className="flex space-y-8 p-4">
      <div>
            <Card className="card max-w-md " >
              <div className="flex items-center mb-4">
                {post.userId && (
                  <img  className="w-10 h-10 rounded-full" src={post.userId.profileImage}
                  alt={post.userId.username}/>
                )}
                <div className="ml-2">
                  {post.userId && (
                    <h4 className="username text-lg font-semibold">{ele.userId.username}</h4>
                  )}
                </div>
                </div>
            <img src={post.image} alt="post" className="w-full" />
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {post.title}
              </h5>
              
              {/* <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.category}
              </h4> */}
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {post.description}
              </p>
              <div className="flex justify-between items-center">
                <Button color="blue" onClick={handleLike}>
                  <BiSolidLike  className="inline-block mr-2 text-xl" />
                  {post.likes.length}Likes
                </Button>
                <Button color="green" onClick={handleShare}>
                  <FaShareSquare className="inline-block mr-2 text-xl" />
                  Share
                </Button>
              </div>
              <div className="mt-4 max-h-20 overflow-y-auto">
                <h4 className="text-xl font-semibold mb-2">Comments</h4>
                {post.comments.map((comment, index) => (
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
                  value={comment}
                  onChange={(e) => setcomments(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded mb-2"
                />
                <Button
                  color="blue"
                  onClick={handleComment}
                >
                  <FaCommentAlt className="inline-block mr-2 text-xl" />
                  comment
                </Button>
              </div>
            </Card>
          </div>
      </div>
    )
  );
};

export default Post;
