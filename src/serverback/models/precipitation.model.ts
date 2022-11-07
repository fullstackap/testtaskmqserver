const precipitation = (mongoose:any) => {
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

  const Precipitation = mongoose.model("precipitation", schema);
  return Precipitation;
};

export default precipitation;