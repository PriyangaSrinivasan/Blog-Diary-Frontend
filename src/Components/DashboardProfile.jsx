import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { Alert, Button, TextInput } from "flowbite-react";
  import React, { useEffect, useRef, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { app } from "../firebase";
  import { CircularProgressbar } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  import { HiInformationCircle } from "react-icons/hi";
  import { Modal } from "flowbite-react";
  import { HiOutlineExclamationCircle } from "react-icons/hi";
  import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    logOutSuccess,
    updateFailure,
    updateStart,
    updateSuccess,
  } from "../Redux/Slice/UserSlice";
  import { Link } from "react-router-dom";
  
  const DashboardProfile = () => {
    const dispatch = useDispatch();
    const { currentuser, loading, error } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formdata, setFormData] = useState({});
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const filePickerRef = useRef();
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };
  
    useEffect(() => {
      if (imageFile) {
        uploadImage();
      }
    }, [imageFile]);
  
    const uploadImage = async () => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError(
            "Could not upload the image (File size must be less than 2MB"
          );
          setImageFileUrl(null);
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formdata, profileImage: downloadURL });
            setImageFileUploading(false);
          });
        }
      );
    };
    //handleChange
    const handleChange = (e) => {
      setFormData({ ...formdata, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      if (Object.keys(formdata).length === 0) {
        setUpdateUserError("No Changes Made");
        return;
      }
      if (imageFileUploading) {
        setUpdateUserError("Please wait while the image is uploading");
        return;
      }
      try {
        dispatch(updateStart());
        const token =localStorage .getItem("Token");
        const response = await fetch(
          `https://blog-diary-flis.onrender.com/api/user/edit/${currentuser.rest._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            //   token: localStorage.getItem("Token"),
              Authorization:`Bearer ${token}`,
            },
            body: JSON.stringify(formdata),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          // alert("User Profile Updated Successfully")
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        } else {
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User Profile Updated Successfully");
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message);
      }
    };
  
    const handleLogout = () => {
      dispatch(logOutSuccess());
      localStorage.removeItem("Token");
    };
    const handleDelete = async () => {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const token =localStorage .getItem("Token");
        const response = await fetch(
          `https://blog-diary-flis.onrender.com/api/user/delete/${currentuser.rest._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            //   token: localStorage.getItem("Token"),
            Authorization:`Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };
    return (
      <div className="max-w-lg mx-auto p-4 w-full">
        <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            ref={filePickerRef}
            onChange={handleImageChange}
            hidden
          />
  
          <div
            className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    heigth: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62,150,200,${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            )}
  
            <img
              src={imageFileUrl || currentuser.rest.profileImage}
              alt="user"
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
            />
          </div>
          {imageFileUploadError && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-5">
              <span className="font-medium me-2">😔OOPS!</span>
              {imageFileUploadError}
            </Alert>
          )}
          <TextInput
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentuser.rest.username}
            onChange={handleChange}
          />
          <TextInput
            type="text"
            id="email"
            placeholder="Email"
            defaultValue={currentuser.rest.email}
            onChange={handleChange}
          />
          <TextInput
            type="password"
            id="password"
            placeholder="*******"
            onChange={handleChange}
          />
          <Button
            type="submit"
            gradientDuoTone="tealToLime"
            disabled={loading || imageFileUploading}
          >
            {loading ? "loading..." : "Update"}
          </Button>
          {currentuser.rest.isAdmin && (
            <Link to ={'/create-post'} >
              <Button type ='submit' gradientDuoTone="tealToLime" className="w-full">Create Post</Button>
            </Link>
          )}
        </form>
        <div className="text-red-600 flex justify-between mt-5">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer" onClick={handleLogout}>
            Log Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color="success" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😎Yeah!</span>
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😒OOPS!</span>
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😒OOPS!</span>
            {error}
          </Alert>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
                Are you sure want to delete this account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  Yes,I'm Sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default DashboardProfile;
  