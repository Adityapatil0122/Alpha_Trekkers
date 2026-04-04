export function paginate(page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}
