import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useLocation, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";
import { app } from "../firebase";

const CreateBlog = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formdata, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const[posts, setPosts] =useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const postId = new URLSearchParams(location.search).get("_id");
  const isEditing = !!postId;

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [isEditing]);

  const fetchPost = async () => {
    try {
        const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/getpost/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        const token = localStorage.getItem("Token");
      const response = await fetch(
        "https://blog-diary-flis.onrender.com/api/post/userpost",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("image upload failed");
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploadError(null);
            setFormData({ ...formdata, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed");
      setImageFileUploadProgress(null);
      console.log(error);
    }
  };

 const handleSubmit =async(e)=>{
  e.preventDefault();
  try {

    const strippedDescription =formdata.description.replace(/<[^>]+>/g, "");
    let response;
    if(isEditing){
      const token = localStorage.getItem("Token");
      response =await fetch(`https://blog-diary-flis.onrender.com/api/post/updatepost/${postId}`,
        {
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({...formdata,description:strippedDescription}),
        }
      );
    } else{
      const token = localStorage.getItem("Token");
      response=await fetch('https://blog-diary-flis.onrender.com/api/post/create-post',
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({...formdata, description:strippedDescription}),
        }
      );
    }
    const data =await response.json();
    if(!response.ok){
      setPublishError(data.message);
      return;
    }else{
      setPublishError(null);
      navigate("/blogs")
    }
  } catch (error) {
    setPublishError("Something went wrong")
  }
 };
 const handleDelete =async(id)=>{
  try {
    //token
    const token = localStorage.getItem("Token");
    //delete the post id
    const response =await fetch(`https://blog-diary-flis.onrender.com/api/post/deletepost/${id}`,{

      method:"DELETE",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    if(!response.ok){
      console.log("Failed to delete post");
    }
    fetchPosts();
  } catch (error) {
    console.log("Error deleting post:",error);
  }
 }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="blog text-center text-3xl my-7 font-extralight text-lime-800">{isEditing ?"Edit Blog" :"Create Blog"}</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-brtween">
          
          <TextInput
            type="text"
            placeholder="Enter the Title"
            required
            id="title"
            value={formdata.title || ""}
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formdata, title: e.target.value })
            }
          />
          <Select
          value={formdata.category || ""}
            onChange={(e) =>
              setFormData({ ...formdata, category: e.target.value })
            }
          >
            <option>Select Category</option>
            <option value="Travel">Travel</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Music">Music</option>
            <option value="Food">Food</option>
            <option value="Finance">Finance</option>
            <option value="News">News</option>
            <option value="Pets">Pets</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Education">Education</option>
            <option value="Technology">Technology</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health&Fitness">Health&Fitness</option>
            <option value="cience and Medicine">Science and Medicine</option>
            <option value="LifeStyle and hobbies">LifeStyle and hobbies</option>
            <option value="Personal development">Personal development</option>
            <option value="Your own journey">Your own journey</option>
          </Select>
        </div>
        <div className="flex gap-4 item-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="tealToLime"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😒OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        {formdata.image && (
          <img
            src={formdata.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formdata.description || ""}
          placeholder="Write Somthing...."
          required
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formdata, description: value });
          }}
        />
        <Button type="submit" gradientDuoTone="tealToLime">
         {isEditing ? "Update":"Publish"}
        </Button>
        {publishError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😒OOPS</span>
            {publishError}
          </Alert>
        )}
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 ">All Posts</h2>
        {posts.map((post)=>(
          <div key={post._id} className="border p-4 mb-4">
            <h3 className="text-xl font-medium">{post.title}</h3>
            <p className="text-gray-500 mb-2">Category:{post.category}</p>
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover mb-2" />
           <div dangerouslySetInnerHTML={{__html:post.description}}  className="mb-2"/>
           <div className="flex gap-2">
            <Button onClick={()=>navigate(`/update-post?id=${post._id}`)} gradientDuoTone="tealToLime">
              Edit
            </Button>
            <Button onClick={()=>handleDelete(post._id)}  gradientDuoTone="tealToLime">
              Delete
            </Button>
           </div>
          </div>
        ))}
      </div>
    </div>
   
  );
};

export default CreateBlog;
