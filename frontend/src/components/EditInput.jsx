import React from "react";

const TaskInput = ({ handleChange, content, img, handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="content"
          type="text"
          rows="6"
        />
        {img && (
          <img
            src={img instanceof File ? URL.createObjectURL(img) : img}
            alt="Post Preview"
            width={200}
            style={{ marginTop: "10px" }}
          />
        )}
        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};
export default TaskInput;
