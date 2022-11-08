const temperature = (mongoose:any) => {
  const schema = new mongoose.Schema(
    {
      t: Date,
      v: Number,
    },
  );

  schema.options.toJSON = {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  };

  const Temperature = mongoose.model("temperature", schema);
  return Temperature;
};

export default temperature;