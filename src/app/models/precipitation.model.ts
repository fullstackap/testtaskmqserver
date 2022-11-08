const precipitation = (mongoose: any) => {
  const schema = mongoose.Schema(
    {
      t: Date,
      v: Number,
    }
  );

  schema.options.toJSON = {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  };

  const Precipitation = mongoose.model("precipitation", schema);
  return Precipitation;
};

export default precipitation;