const temperature = (mongoose:any) => {
  const schema = mongoose.Schema(
    {
      t: Date,
      v: Number,
    }
  );

  schema.method("toJSON", () => {
    const { __v, _id, ...object } = (this as any).toObject();
    object.id = _id;
    return object;
  });

  const Temperature = mongoose.model("temperature", schema);
  return Temperature;
};

export default temperature;