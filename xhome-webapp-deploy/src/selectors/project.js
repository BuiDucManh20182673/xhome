const isNotArchived = (archivedIds) => (story) =>
  archivedIds.indexOf(story.objectID) === -1;

const getReadableStories = ({ storyState, archiveState }) =>
  storyState.filter(isNotArchived(archiveState));

const getFetchError = ({ storyState }) => storyState.error;

const getReadableProjects = state => state.projectState

export { getReadableStories, getFetchError, getReadableProjects };
