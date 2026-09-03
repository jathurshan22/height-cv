export function mapCV(cv) {
  const obj = cv.toObject ? cv.toObject() : cv;
  return { ...obj, id: obj._id.toString(), _id: undefined, user: undefined, createdAt: undefined };
}
