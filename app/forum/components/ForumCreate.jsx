import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ForumCreate = ({ create, newPost, setNewPost }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Preview the image
        setNewPost({ ...newPost, imageFile: file }); // Save the file in the state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={create}
      className="mb-12 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">สร้างโพสต์ใหม่</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="หัวข้อ"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full bg-transparent border-white text-white placeholder-gray-300"
        />
        <Textarea
          placeholder="เนื้อหา"
          value={newPost.content}
          onChange={(e) =>
            setNewPost({ ...newPost, content: e.target.value })
          }
          className="w-full bg-transparent border-white text-white placeholder-gray-300"
        />
        <div>
          <label className="text-white block mb-2">อัปโหลดรูปภาพ:</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full bg-transparent border-white text-white placeholder-gray-300"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          โพสต์
        </Button>
      </div>
    </form>
  );
};

export default ForumCreate;
  