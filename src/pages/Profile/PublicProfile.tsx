// Public profile page - uses the same Profile component
// The Profile component already handles both public and own profiles
// through the useUserPresenter hook which extracts userId from URL params
// and sets isOwnProfile accordingly
export { default } from './Profile';
