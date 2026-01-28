export const ADMIN_URLS = {
  GET_ALL_USERS: "/admin/users",
  GET_ALL_INFLUENCERS: "/admin/get-all-influencers",
  REVOKE_INFLUENCER: "/admin/influencer/revoke",
  INVITE_INFLUENCER: "/admin/invite-influencer",
  GET_INFLUENCER_BY_ID:"/admin/single-influencer",
  UPDATE_INFLUENCER:"/admin/update-influencer",
  REGENERATE_INVITE_LINK:"/admin/influencer/regenerate-link",
  GET_ALL_TOKENS:"/admin/token-details",
  DELETE_INFLUENCER:"/admin/delete-influencer"
} as const;
