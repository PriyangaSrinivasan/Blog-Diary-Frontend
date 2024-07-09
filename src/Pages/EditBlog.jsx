import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
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


const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const postId = new URLSearchParams(location.search).get("id");
  
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formdata, setFormData] = useState({
    title: "",
    category: "Uncategorized",
    description: "",
    image: "",
  });
  const [editError, setEditError] = useState(null);
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);
  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `http://localhost:4100/api/post/getpost/${postId}`, //getpost by Id
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.log("Failed to fech post");
        return;
      }
      const postData = await response.json();
      setFormData({
        title: postData.title,
        category: postData.category,
        description: postData.description,
        image: postData.image,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUploadImage = async () => {
    if (!file) return;
    try {
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
      // console.log(error);
    }
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (file) {
        await handleUploadImage();
      }
  
    const strippedDescription = formdata.description.replace(/<[^>]+>/g, "");
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `https://blog-diary-flis.onrender.com/api/post/updatepost/${postId}`, // update your post
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formdata,
            description: strippedDescription}),
        });
      const data = await response.json();
      if (!response.ok) {
        setEditError(data.message);
        return;
      }
      navigate(`/create-post?id=${postId}`);
    } catch (error) {
      setEditError("Something went wrong");
    }
  };
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="post text-center text-3xl my-7 font-extralight text-lime-800">Update Post</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-brtween">
            <TextInput
              type="text"
              placeholder="Enter the Title"
              id="title"
              className="flex-1"
              value={formdata.title}
              onChange={(e) =>
                setFormData({ ...formdata, title: e.target.value })
              }
            />
            <Select
              value={formdata.category}
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
              <option value="Pets">coding</option>
              <option value="Sports">Sports</option>
              <option value="Politics">Politics</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health&Fitness">Health&Fitness</option>
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
          {formdata.image && !file && (
            <img
              src={formdata.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write Somthing...."
            required
            className="h-72 mb-12"
            value={formdata.description}
            onChange={(value) => {
              setFormData({ ...formdata, description: value });
            }}
          />
          <Button type="submit" gradientDuoTone="tealToLime">
            Update Post
          </Button>
          {editError && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-5">
              <span className="font-medium me-2">😒OOPS</span>
              {editError}
            </Alert>
          )}
        </form>
  
      </div>
    );
  }

export default EditBlog;
