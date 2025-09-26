export const shouldTrollTheUser = (userId?: string) => {
  if(!userId) return false;
  const trollUserIds = process.env.TROLL_USER_IDS?.split(',') || [];
  return trollUserIds.includes(userId);
}