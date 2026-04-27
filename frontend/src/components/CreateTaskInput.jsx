const TaskInput = ({
  img,
  submitTask,
  content,
  handleFormData,
}) => {
  return (
    <div>
      <form onSubmit={submitTask}>
        <textarea
          name="content"
          value={content}
          onChange={handleFormData}
          placeholder="share your jouney with Christ"
          rows="6"
        />
        {img && (
          <div>
            <p> Selected image: {img.name}</p>
            <img
              src={URL.createObjectURL(img)}
              alt="preview"
              width={200}
              style={{ marginTop: "10px" }}
            />
          </div>
        )}

        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleFormData}
        />

        <button type="submit"> Submit</button>
      </form>
    </div>
  );
};

export default TaskInput;
