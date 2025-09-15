export const formatNextReviewDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return 'Now';
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour' : `${diffHours} hours`;
  }

  if (diffDays <= 7) {
    if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${diffDays} days`;
  }

  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
