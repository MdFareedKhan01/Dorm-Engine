export function toPublicUser(student) {
  if (!student) {
    return null;
  }

  const plain = student.toObject ? student.toObject() : student;
  // eslint-disable-next-line no-unused-vars
  const { password, __v, ...rest } = plain;
  return rest;
}

export function buildRoomNumber(block = 'C', index = 1) {
  return `${String(index).padStart(3, '0')}-${block}`;
}
