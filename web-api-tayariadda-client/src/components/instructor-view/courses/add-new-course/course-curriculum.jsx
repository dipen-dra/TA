import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
  mediaUploadServiceLocal,
} from "@/services";
import { Upload, Trash, FileVideo, Youtube, AlertTriangle, BookOpen, Image, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)
              }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  // --- Book Management Handlers ---

  function handleAddBook(lectureIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const currentLecture = cpyCourseCurriculumFormData[lectureIndex];

    // Initialize recommendedBooks if it doesn't exist
    if (!currentLecture.recommendedBooks) {
      currentLecture.recommendedBooks = [];
    }

    currentLecture.recommendedBooks.push({
      title: "",
      author: "",
      description: "",
      coverImage: "",
      bookUrl: "",
    });

    cpyCourseCurriculumFormData[lectureIndex] = currentLecture;
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleBookChange(event, lectureIndex, bookIndex, field) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const currentLecture = cpyCourseCurriculumFormData[lectureIndex];
    currentLecture.recommendedBooks[bookIndex][field] = event.target.value;

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleRemoveBook(lectureIndex, bookIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const currentLecture = cpyCourseCurriculumFormData[lectureIndex];
    currentLecture.recommendedBooks.splice(bookIndex, 1);
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleBookFileUpload(event, lectureIndex, bookIndex, type) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      // Use local upload for PDFs to avoid Cloudinary CORS/Access issues, Cloudinary for Images
      const uploadService = type === 'pdf' ? mediaUploadServiceLocal : mediaUploadService;
      const response = await uploadService(formData, setMediaUploadProgressPercentage);

      if (response.success) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const currentLecture = cpyCourseCurriculumFormData[lectureIndex];

        if (type === 'pdf') {
          currentLecture.recommendedBooks[bookIndex].bookUrl = response.data.url;
        } else if (type === 'image') {
          currentLecture.recommendedBooks[bookIndex].coverImage = response.data.url;
        }

        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.error("Book Upload Error:", error);
      setMediaUploadProgress(false);
    }
  }

  return (
    <Card className="shadow-lg rounded-2xl p-6 bg-white">
      <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          Create Course Curriculum
        </CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer flex items-center gap-2 px-5 py-3 border rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-shadow shadow-md hiver:text-white"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-5 h-5" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
          className="bg-blue-600 mt-6 text-white hover:bg-blue-700 transition rounded-lg px-4 py-3 font-semibold shadow-md"
        >
          Add Lecture
        </Button>

        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
            className="mt-4"
          />
        )}

        <div className="mt-6 space-y-6">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={index}
              className="border p-5 rounded-xl shadow-sm bg-gray-50"
            >
              <div className="flex gap-5 items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lecture {index + 1}
                </h3>

                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="w-full max-w-lg border-gray-300 rounded-lg px-3 py-2"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={curriculumItem?.title}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={curriculumItem?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label
                    htmlFor={`freePreview-${index + 1}`}
                    className="text-gray-700"
                  >
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-6">
                {curriculumItem?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={curriculumItem?.videoUrl}
                      width="450px"
                      height="200px"
                      className="rounded-lg border"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleReplaceVideo(index)}
                        className="bg-blue-600 text-white hover:bg-blue-700 transition rounded-lg px-4 py-2 shadow-md"
                      >
                        Replace Video
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="bg-red-600 text-white hover:bg-red-700 transition rounded-lg px-4 py-2 shadow-md flex items-center gap-2"
                          >
                            <Trash className="w-5 h-5" />
                            Delete Lecture
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-5 h-5" />
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete this lecture permanently. If you have uploaded a video, it will be removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteLecture(index)} className="bg-red-600 hover:bg-red-700 text-white">
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Video Source Selection */}
                    <div className="flex gap-4 mb-2">
                      <Button
                        type="button" // Prevent form submission
                        variant={curriculumItem?.videoType === "youtube" ? "outline" : "default"}
                        onClick={() => {
                          let cpy = [...courseCurriculumFormData];
                          cpy[index] = { ...cpy[index], videoType: "file" };
                          setCourseCurriculumFormData(cpy);
                        }}
                        className={`flex-1 ${curriculumItem?.videoType !== "youtube" ? "bg-blue-600 text-white" : "border-gray-200 text-gray-600"}`}
                      >
                        <Upload className="w-4 h-4 mr-2" /> Upload File
                      </Button>
                      <Button
                        type="button" // Prevent form submission
                        variant={curriculumItem?.videoType === "youtube" ? "default" : "outline"}
                        onClick={() => {
                          let cpy = [...courseCurriculumFormData];
                          cpy[index] = { ...cpy[index], videoType: "youtube" };
                          setCourseCurriculumFormData(cpy);
                        }}
                        className={`flex-1 ${curriculumItem?.videoType === "youtube" ? "bg-red-600 text-white hover:bg-red-700" : "border-gray-200 text-gray-600"}`}
                      >
                        <Youtube className="w-4 h-4 mr-2" /> YouTube URL
                      </Button>
                    </div>

                    {curriculumItem?.videoType === "youtube" ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Paste YouTube URL here (e.g. https://youtube.com/watch?v=...)"
                          className="flex-1 border-gray-300"
                          value={curriculumItem?.videoUrl || ""}
                          onChange={(e) => {
                            let cpy = [...courseCurriculumFormData];
                            cpy[index] = { ...cpy[index], videoUrl: e.target.value, public_id: "youtube_video" }; // Set dummy public_id for validation
                            setCourseCurriculumFormData(cpy);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor={`video-upload-${index}`}
                          className="flex items-center justify-center w-full px-4 py-3 text-blue-800 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 border border-blue-200 transition-colors"
                        >
                          <FileVideo className="w-5 h-5 mr-2" />
                          Select Video File
                        </label>
                        <input
                          id={`video-upload-${index}`}
                          type="file"
                          accept="video/*"
                          onChange={(event) =>
                            handleSingleLectureUpload(event, index)
                          }
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>


              {/* Recommended Books Section */}
              < div className="mt-8 border-t border-gray-100 pt-6" >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Recommended Books
                  </h4>
                  <Button
                    onClick={() => handleAddBook(index)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    + Add Book
                  </Button>
                </div>

                <div className="space-y-4">
                  {curriculumItem?.recommendedBooks && curriculumItem.recommendedBooks.map((book, bookIndex) => (
                    <div key={bookIndex} className="bg-white border rounded-lg p-4 shadow-sm relative group">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveBook(index, bookIndex)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Input
                            placeholder="Book Title"
                            value={book.title}
                            onChange={(e) => handleBookChange(e, index, bookIndex, 'title')}
                            className="h-9"
                          />
                          <Input
                            placeholder="Author Name"
                            value={book.author}
                            onChange={(e) => handleBookChange(e, index, bookIndex, 'author')}
                            className="h-9"
                          />
                          <Input // Textarea/Input for description
                            placeholder="Brief Description"
                            value={book.description}
                            onChange={(e) => handleBookChange(e, index, bookIndex, 'description')}
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label htmlFor={`book-cover-${index}-${bookIndex}`} className="cursor-pointer border-dashed border-2 border-gray-200 rounded-md p-2 flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-500 text-xs h-9 overflow-hidden">
                                <Image className="w-4 h-4" />
                                {book.coverImage ? "Change Cover" : "Upload Cover"}
                              </Label>
                              <Input
                                id={`book-cover-${index}-${bookIndex}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleBookFileUpload(e, index, bookIndex, 'image')}
                              />
                            </div>
                            {book.coverImage && <span className="text-xs text-green-600 font-medium">Uploaded</span>}
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label htmlFor={`book-pdf-${index}-${bookIndex}`} className="cursor-pointer border-dashed border-2 border-gray-200 rounded-md p-2 flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-500 text-xs h-9 overflow-hidden">
                                <FileText className="w-4 h-4" />
                                {book.bookUrl ? "Change PDF" : "Upload PDF"}
                              </Label>
                              <Input
                                id={`book-pdf-${index}-${bookIndex}`}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => handleBookFileUpload(e, index, bookIndex, 'pdf')}
                              />
                            </div>
                            {book.bookUrl && <span className="text-xs text-green-600 font-medium">Uploaded</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!curriculumItem?.recommendedBooks || curriculumItem.recommendedBooks.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg border border-dashed">
                      No books added yet. Click "+ Add Book" to attach reading materials.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent >
    </Card >
  );
}

export default CourseCurriculum;
